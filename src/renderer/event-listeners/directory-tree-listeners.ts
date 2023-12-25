import { fsMod } from "../utils/alias";
import { DirectoryTree } from "../file-directory-tree/file-directory";
import { setWindowTitle } from "../window/window-title";
import { IDirectoryTreeListeners } from "../interfaces/listener-interfaces";
import { EditorListeners } from "./editor-listeners";
import { DirectoryTreeStateListeners } from "./file-directory-state-listener";
import { EditorNs } from "../editor-main";
import { wordCountListener } from "./word-count-listener";
import { isModeAdvanced, isModeReading } from "../utils/is";
import { FolderFileCount } from "../misc-ui/folder-file-count";
import { EditorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener";
import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { CMEditorState } from "../codemirror/editor/cm-editor-state";
import { Settings } from "../settings/settings";
import { cursors } from "../codemirror/extensions/cursor-extension/cursors";
import { EditorView } from "@codemirror/view";
import { AdvancedModeSettings } from "../settings/settings";
import { reading } from "../misc-ui/reading-mode";

export namespace RefsNs {
    /**
     * Generic interface for current parent child data
     *
     * Anything that implements `ICurrentParentChildData` should default to any type that inherits `string` or `Element` only, for example:
     *
     * `T` corresponds to type `string`
     *
     * `K` corresponds to type `Element`
     */
    interface ICurrentParentChildData<T extends string, K extends Element> {
        parentFolderName: T;
        childFileName: T;
        parentFolderNode: K;
        parentFolderNameNode: K;
        childFileNode: K;
    }

    /**
     * Current parent child data array of objects
     *
     * References of the current parent folder and child file data can be accessed here.
     *
     * Since the references may change, you will have to reassign the values.
     *
     */
    export const currentParentChildData: ICurrentParentChildData<string, Element>[] = [
        {
            parentFolderName: "",
            childFileName: "",
            parentFolderNode: {} as Element,
            parentFolderNameNode: {} as Element,
            childFileNode: {} as Element,
        },
    ];
}

/**
 * @extends DirectoryTree
 * @implements `IDirectoryTreeListeners`
 */
export class DirectoryTreeListeners extends DirectoryTree implements IDirectoryTreeListeners {
    /**
     * Get parent tags
     *
     * @private
     */
    private getParentTags: NodeListOf<Element> = {} as NodeListOf<Element>;

    /**
     * Get parent name tags
     *
     * @private
     */
    private getParentNameTags: NodeListOf<Element> = {} as NodeListOf<Element>;

    /**
     * Parent name tag reference variable
     *
     * @protected
     */
    protected parentNameTagRef: string = "";

    /**
     * Parent name tag node reference variable
     *
     * @protected
     */
    protected parentNameTagNodeRef: Element = {} as Element;

    /**
     * Child file name reference variable
     *
     * @protected
     */
    protected childFileNameRef: string = "";

    /**
     * Parent name tag node reference variable
     *
     * @protected
     */
    protected parentTagNodeRef: Element = {} as Element;

    /**
     * Child file node reference variable
     *
     * @protected
     */
    protected childFileNodeRef: Element = {} as Element;

    /**
     * Editor listeners object
     *
     * @private
     * @readonly
     */
    private readonly editorListeners = new EditorListeners();

    /**
     * Directory tree state listeners object
     *
     * @private
     * @readonly
     */
    private readonly dirTreeStateListeners = new DirectoryTreeStateListeners();

    /**
     * Editor top bar container object
     *
     * @private
     * @readonly
     */
    private readonly editorTopBarContainer = new EditorNs.EditorTopBarContainer();

    /**
     * Folder file count object
     *
     * @private
     * @readonly
     */
    private readonly folderFileCountObject = new FolderFileCount();

    /**
     * Kebab dropdown menu listeners
     *
     * @private
     * @readonly
     */
    private readonly editorKebabDropdownMenuListeners = new EditorKebabDropdownMenuListeners();

    /**
     * Parent root listener
     */
    public parentRootListener(): void {
        this.getParentTags = document.querySelectorAll(".parent-of-root-folder");
        this.getParentNameTags = document.querySelectorAll(".parent-folder-name");

        if (this.getParentTags !== null && this.getParentNameTags !== null) {
            for (let i = 0; i < this.getParentTags.length; i++) {
                this.folderFileCountObject.folderFileCount(this.getParentTags[i], this.parentNameTagsArr()[i]);

                this.getParentNameTags[i].addEventListener("click", () => {
                    //toggle is-active-parent class on parent tag
                    this.getParentTags[i].classList.toggle("is-active-parent");

                    //toggle is-active-folder class on parent name tag
                    this.getParentNameTags[i].classList.toggle("is-active-folder");

                    //check if parent tag contains is-active-parent class
                    if (this.getParentTags[i].classList.contains("is-active-parent")) {
                        this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                        document
                            .querySelectorAll(".parent-folder-caret")
                            [i].classList.toggle("is-active-parent-folder");

                        //remove is-not-active-parent class
                        this.getParentTags[i].classList.remove("is-not-active-parent");

                        //call child node listener when parent is active
                        this.childNodeListener();

                        //console.log(this.getParentTags[i].querySelectorAll('.child-file-name').length);
                        //if parent tag doesn't contain is-active-parent class
                    } else if (!this.getParentTags[i].classList.contains("is-active-parent")) {
                        //remove all child files
                        this.getParentTags[i].querySelectorAll(".child-file-name").forEach((elem) => {
                            if (elem !== null) {
                                elem.remove();
                            }
                        });

                        //remove is-active-parent-folder class
                        this.getParentTags[i].querySelectorAll(".parent-folder-caret").forEach((elem) => {
                            if (elem !== null) {
                                elem.classList.remove("is-active-parent-folder");
                            }
                        });

                        //add is-not-active-parent
                        this.getParentTags[i].classList.add("is-not-active-parent");
                    }
                });
            }
        } else {
            throw console.error("Generic error. Cannot find parent and parent name tags.");
        }
    }

    /**
     * Child node listener
     */
    public childNodeListener(): void {
        document.querySelectorAll(".is-active-parent").forEach((isActiveParent) => {
            const childFileName: NodeListOf<Element> = isActiveParent.querySelectorAll(".child-file-name");

            //for all child file names
            for (let i = 0; i < childFileName.length; i++) {
                childFileName[i].addEventListener("click", async () => {
                    //if document contains at least one active child
                    if (document.querySelector(".is-active-child")) {
                        //select all active children and remove them from the dom (active status)
                        //this removes any existing active children files
                        document.querySelectorAll(".is-active-child").forEach((isActiveChild) => {
                            if (isActiveChild !== null) {
                                isActiveChild.classList.remove("is-active-child");
                            }
                        });
                    }

                    //for all clicked children files, add 'is-active-child' class
                    childFileName[i].classList.add("is-active-child");

                    for (let j = 0; j < this.getParentTags.length, j < this.getParentNameTags.length; j++) {
                        if (
                            this.getParentTags[j].contains(childFileName[i]) &&
                            childFileName[i].classList.contains("is-active-child")
                        ) {
                            if (isModeAdvanced()) {
                                CMEditorView.reinitializeEditor(
                                    fsMod.fs._readFileFolder(
                                        this.getParentNameTags[j].textContent as string,
                                        (childFileName[i].textContent as string) + ".md"
                                    )
                                );

                                //set contenteditable
                                CMEditorView.setContenteditable(true);

                                //show kebab dropdown menu
                                (
                                    document.getElementById("kebab-dropdown-menu-container") as HTMLElement
                                ).style.display = "";

                                //invoke auto save listener
                                this.editorListeners.autoSaveListener("codemirror");

                                //invoke insert tab listener
                                this.editorListeners.insertTabListener(
                                    document.querySelector(".cm-content") as HTMLElement,
                                    2
                                );

                                (
                                    document.getElementById(
                                        "file-directory-kebab-dropdown-menu-container"
                                    ) as HTMLElement
                                ).style.display = "";

                                //null check
                                if (
                                    this.parentTagNodeRef !== null &&
                                    this.parentNameTagRef !== null &&
                                    this.childFileNameRef !== null &&
                                    this.childFileNodeRef !== null
                                ) {
                                    //assign child refs
                                    this.childFileNameRef = childFileName[i].textContent as string;
                                    this.childFileNodeRef = childFileName[i];

                                    if (this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                        //assign parent refs
                                        this.parentNameTagRef = this.getParentNameTags[j].textContent as string;
                                        this.parentNameTagNodeRef = this.getParentNameTags[j];
                                        this.parentTagNodeRef = this.getParentTags[j];
                                    } else if (!this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                        continue;
                                    }

                                    //assign references to corresponding key properties
                                    RefsNs.currentParentChildData.map((props) => {
                                        //null check
                                        if (props !== null) {
                                            //child file name
                                            props.childFileName = this.childFileNameRef;

                                            //child file node
                                            props.childFileNode = this.childFileNodeRef;

                                            //parent folder name
                                            props.parentFolderName = this.parentNameTagRef;

                                            //parent folder name node
                                            props.parentFolderNameNode = this.parentNameTagNodeRef;

                                            //parent folder node
                                            props.parentFolderNode = this.parentTagNodeRef;

                                            //log
                                            //console.log(props.childFileName);
                                            //log
                                            //console.log(props.childFileNode);
                                        }
                                    });

                                    //word count listener
                                    wordCountListener("codemirror");

                                    //apply active state listener
                                    this.dirTreeStateListeners.activeChildFileStateListener();

                                    //kebab dropdown menu listener
                                    this.editorKebabDropdownMenuListeners.kebabDropdownMenuListener();

                                    //default cursors
                                    if (Settings.getSettings.lightTheme) {
                                        CMEditorView.editorView.dispatch({
                                            effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]),
                                        });

                                        AdvancedModeSettings.highlightLight();
                                    } else if (Settings.getSettings.darkTheme) {
                                        CMEditorView.editorView.dispatch({
                                            effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]),
                                        });

                                        AdvancedModeSettings.highlightDark();
                                    }

                                    //check block cursor
                                    if (Settings.getSettings.defaultCursor && Settings.getSettings.lightTheme) {
                                        AdvancedModeSettings.defaultCursor("light");

                                        AdvancedModeSettings.highlightLight();
                                    } else if (Settings.getSettings.defaultCursor && Settings.getSettings.darkTheme) {
                                        AdvancedModeSettings.defaultCursor("dark");

                                        AdvancedModeSettings.highlightDark();
                                    } else if (Settings.getSettings.blockCursor && Settings.getSettings.lightTheme) {
                                        AdvancedModeSettings.blockCursor();

                                        AdvancedModeSettings.highlightLight();
                                    } else if (Settings.getSettings.blockCursor && Settings.getSettings.darkTheme) {
                                        AdvancedModeSettings.blockCursor();

                                        AdvancedModeSettings.highlightDark();
                                    }

                                    //set scroll position to the beginning of the view
                                    CMEditorView.editorView.dispatch({
                                        effects: EditorView.scrollIntoView(0),
                                    });

                                    //kebab dropdown menu listener
                                    this.editorKebabDropdownMenuListeners.kebabDropdownMenuListener();
                                }
                                //if mode is reading
                            } else if (isModeReading()) {
                                //create reading mode
                                reading.createReadingMode(this.parentNameTagsArr()[j], childFileName[i].textContent);

                                //assign refs
                                RefsNs.currentParentChildData.map((props) => {
                                    //null check
                                    if (props !== null) {
                                        props.childFileName = childFileName[i].textContent as string;
                                        props.parentFolderName = this.parentNameTagsArr()[j];
                                    }
                                });

                                //prevent default behaviour of clicked anchor tags opening inside electron window
                                //only allow selection and context menu
                                document.querySelectorAll("#reading-mode-container a").forEach((el) => {
                                    el.addEventListener("click", (e) => {
                                        e.preventDefault();
                                    });
                                });
                            }

                            //show kebab
                            (
                                document.getElementById("file-directory-kebab-dropdown-menu-container") as HTMLElement
                            ).style.display = "";

                            //invoke state listener
                            this.dirTreeStateListeners.activeChildFileStateListener();
                        } else if (
                            !this.getParentTags[j].contains(childFileName[i]) &&
                            !childFileName[i].classList.contains("is-active-child")
                        ) {
                            continue;
                        }
                    }

                    //change document title so it corresponds to the opened file
                    console.log(this.parentNameTagNodeRef.textContent);
                    if (this.parentNameTagNodeRef.textContent !== undefined) {
                        await setWindowTitle(
                            "Iris",
                            true,
                            this.parentNameTagRef + " - " + childFileName[i].textContent
                        ).catch((e) => {
                            throw console.error(e);
                        });
                    } else {
                        RefsNs.currentParentChildData.map(async (props) => {
                            await setWindowTitle(
                                "Iris",
                                true,
                                props.parentFolderName + " - " + childFileName[i].textContent
                            ).catch((e) => {
                                throw console.error(e);
                            });
                        });
                    }

                    //add directory info to editor top bar
                    this.editorTopBarContainer.directoryInfo();
                });
            }
        });
    }
}
