import { fsMod } from "../../utils/alias";
import { DirectoryTree } from "../file-directory-tree/file-directory";
import { setWindowTitle } from "../window/window-title";
import { IDirectoryTreeListeners } from "../interfaces/listener-interfaces";
import { EditorListeners } from "./editor-listeners";
import { DirectoryTreeStateListeners } from "./file-directory-state-listener";
import { EditorNs } from "../editor-main";
import { wordCountListener } from "./word-count-listener";
import { editorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener";
import { defaultMarkdownParser } from "../prosemirror/markdown/export";
import { PMEditorView } from "../prosemirror/editor/pm-editor-view";
import { PMEditorState } from "../prosemirror/editor/pm-editor-state";
import { Node } from "prosemirror-model";

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
     * Parent root listener
     */
    public parentRootListener(): void {
        this.getParentTags = document.querySelectorAll(".parent-of-root-folder");
        this.getParentNameTags = document.querySelectorAll(".parent-folder-name");

        if (this.getParentTags !== null && this.getParentNameTags !== null) {
            for (let i = 0; i < this.getParentTags.length; i++) {
                this.getParentNameTags[i].addEventListener("click", () => {
                    this.getParentTags[i].classList.toggle("is-active-parent");

                    this.getParentNameTags[i].classList.toggle("is-active-folder");

                    if (this.getParentTags[i].classList.contains("is-active-parent")) {
                        this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                        document
                            .querySelectorAll(".parent-folder-caret")
                            [i].classList.toggle("is-active-parent-folder");
                        this.getParentTags[i].classList.remove("is-not-active-parent");

                        this.childNodeListener();
                    } else if (!this.getParentTags[i].classList.contains("is-active-parent")) {
                        //remove all child files
                        this.getParentTags[i].querySelectorAll(".child-file-name").forEach((elem) => {
                            if (elem !== null) {
                                elem.remove();
                            }
                        });

                        this.getParentTags[i].querySelectorAll(".parent-folder-caret").forEach((elem) => {
                            if (elem !== null) {
                                elem.classList.remove("is-active-parent-folder");
                            }
                        });

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

            for (let i = 0; i < childFileName.length; i++) {
                childFileName[i].addEventListener("click", async () => {
                    if (document.querySelector(".is-active-child")) {
                        document.querySelectorAll(".is-active-child").forEach((isActiveChild) => {
                            if (isActiveChild !== null) {
                                isActiveChild.classList.remove("is-active-child");
                            }
                        });
                    }

                    childFileName[i].classList.add("is-active-child");

                    for (let j = 0; j < this.getParentTags.length, j < this.getParentNameTags.length; j++) {
                        if (
                            this.getParentTags[j].contains(childFileName[i]) &&
                            childFileName[i].classList.contains("is-active-child")
                        ) {
                            PMEditorView.editorView.destroy();

                            PMEditorView.createEditorView();

                            PMEditorView.editorView.updateState(
                                PMEditorView.editorView.state.apply(
                                    PMEditorState.editorState.tr.replaceRangeWith(
                                        0,
                                        0,
                                        defaultMarkdownParser.parse(
                                            fsMod.fs._readFileFolder(
                                                this.getParentNameTags[j].textContent as string,
                                                (childFileName[i].textContent as string) + ".md"
                                            )
                                        ) as Node
                                    )
                                )
                            );
                            wordCountListener("prosemirror");

                            this.editorListeners.autoSaveListener("prosemirror");
                            PMEditorView.setContenteditable(true);

                            (document.getElementById("kebab-dropdown-menu-container") as HTMLElement).style.display =
                                "";

                            editorKebabDropdownMenuListeners.kebabDropdownMenuListener();

                            //invoke insert tab listener
                            this.editorListeners.insertTabListener(
                                document.querySelector(".ProseMirror") as HTMLElement,
                                2
                            );

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

                                RefsNs.currentParentChildData.map((props) => {
                                    if (props !== null) {
                                        props.childFileName = this.childFileNameRef;
                                        props.childFileNode = this.childFileNodeRef;
                                        props.parentFolderName = this.parentNameTagRef;
                                        props.parentFolderNameNode = this.parentNameTagNodeRef;
                                        props.parentFolderNode = this.parentTagNodeRef;
                                    }
                                });
                            }

                            if (
                                (document.querySelector(".ProseMirror") as HTMLElement).getAttribute(
                                    "contenteditable"
                                ) === "true"
                            ) {
                                (document.querySelector(".ProseMirror-menubar") as HTMLElement).style.display = "";
                            }

                            this.dirTreeStateListeners.activeChildFileStateListener();
                        } else if (
                            !this.getParentTags[j].contains(childFileName[i]) &&
                            !childFileName[i].classList.contains("is-active-child")
                        ) {
                            continue;
                        }
                    }
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

                    this.editorTopBarContainer.directoryInfo();
                });
            }
        });
    }
}
