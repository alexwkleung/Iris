import { EditorNs } from "../editor-main";
import { DirectoryTreeUIModals } from "../file-directory-tree/file-directory-tree-modals";
import { IDirectoryTreeUIModalListeners } from "../interfaces/listener-interfaces";
import { DirectoryTreeListeners } from "./directory-tree-listeners";
import { EditorListeners } from "./editor-listeners";
import { DirectoryTreeStateListeners } from "./file-directory-state-listener";
import { isModeAdvanced, isModeReading } from "../utils/is";
import { fsMod } from "../utils/alias";
import { RefsNs } from "./directory-tree-listeners";
import { wordCountListener } from "./word-count-listener";
import { setWindowTitle } from "../window/window-title";
import { EditorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener";
import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { CMEditorState } from "../codemirror/editor/cm-editor-state";
import { cursors } from "../codemirror/extensions/cursor-extension/cursors";
import { Settings } from "../settings/settings";
import { AdvancedModeSettings } from "../settings/settings";
import { reading } from "../misc-ui/reading-mode";
import { GenericEvent } from "./event";
import { KeyBinds } from "../keybinds/keybinds";

/**
 * @extends DirectoryTreeUIModals
 * @implements `IDirectoryTreeUIModalListeners`
 */
export class DirectoryTreeUIModalListeners extends DirectoryTreeUIModals implements IDirectoryTreeUIModalListeners {
    /**
     * Parent tags
     *
     * @private
     */
    private parentTags: NodeListOf<Element> = {} as NodeListOf<Element>;

    /**
     * Parent name tags
     *
     * @private
     */
    private parentNameTags: NodeListOf<Element> = {} as NodeListOf<Element>;

    /**
     * Directory tree listeners object
     *
     * @private
     * @readonly
     */
    private readonly directoryTreeListeners = new DirectoryTreeListeners();

    /**
     * Editor listeners object
     *
     * @private
     * @readonly
     */
    private readonly editorListeners = new EditorListeners();

    /**
     * Editor top bar container object
     *
     * @private
     * @readonly
     */
    private readonly editorTopBarContainer = new EditorNs.EditorTopBarContainer();

    /**
     * Kebab dropdown menu listeners
     *
     * @private
     * @readonly
     */
    private readonly editorkebabDropdownMenuListeners = new EditorKebabDropdownMenuListeners();

    /**
     * Directory tree state listeners object
     *
     * @private
     * @readonly
     */
    private readonly dirTreeStateListeners = new DirectoryTreeStateListeners();

    /**
     * File name for create file input
     * @private
     */
    private fileName: string = "" + ".md";

    /**
     * Folder name for create folder input
     * @private
     */
    private folderName: string = "";

    /**
     * Create modal exit callback
     *
     * @public
     */
    public createModalExitCb: () => void = (): void => {
        const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll(".create-new-file");

        createFileNode.forEach((elem) => {
            //null check
            if (elem !== null) {
                elem.classList.remove("is-active-create-new-file-modal");
            }
        });

        //null check
        if (DirectoryTreeUIModals.createModalContainer !== null) {
            DirectoryTreeUIModals.createModalContainer.remove();
        }

        //invoke parent root listener
        this.directoryTreeListeners.parentRootListener();

        //invoke child node listener
        this.directoryTreeListeners.childNodeListener();

        //invoke parent root listener again so the directory tree will be in sync
        this.directoryTreeListeners.parentRootListener();

        //dispose
        GenericEvent.use.disposeEvent(
            DirectoryTreeUIModals.createModalExitButton,
            "click",
            this.createModalExitCb,
            undefined,
            "Disposed event for create modal exit"
        );

        GenericEvent.use.disposeEvent(
            window,
            "keydown",
            KeyBinds.map.bindCb,
            undefined,
            "Disposed event for create modal exit (keydown escape)"
        );

        KeyBinds.map.resetMapList();
    };

    /**
     * Create file modal exit listener
     *
     * @public
     */
    public createFileModalExitListener(): void {
        GenericEvent.use.createDisposableEvent(
            DirectoryTreeUIModals.createModalExitButton,
            "click",
            this.createModalExitCb,
            undefined,
            "Created disposable event for create modal exit"
        );

        KeyBinds.map.bind(this.createModalExitCb, "Escape", false);
    }

    /**
     * Create file modal input callback
     *
     * @param e Event
     *
     * @public
     */
    public createFileModalInputCb: (e: Event) => void = (e: Event): void => {
        //assign current value of input element on keyup + extension
        this.fileName = (e.target as HTMLInputElement).value.trim() + ".md";

        //log
        console.log(this.fileName);
    };

    /**
     * Create file modal continue callback
     *
     * @async
     * @public
     */
    public createFileModalContinueCb: () => Promise<void> = async (): Promise<void> => {
        if (this.fileName === ".md") {
            window.electron.ipcRenderer.invoke(
                "show-message-box",
                "Note name cannot be empty. Enter a valid note name."
            );

            return;
        }

        if (this.fileName !== ".md") {
            fsMod.fs._createFile(
                fsMod.fs._baseDir("home") +
                    "/Iris/Notes/" +
                    (document.querySelector("#create-file-modal-folder-name-input-node") as HTMLElement).textContent +
                    "/" +
                    this.fileName,
                "# " + this.fileName.split(".md")[0] + " " + "\n"
            );
        }

        const createFileModalFolderNameRef: string = (
            document.querySelector("#create-file-modal-folder-name-input-node") as HTMLElement
        ).textContent as string;
        const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll(".create-new-file");

        createFileNode.forEach((elem) => {
            //null check
            if (elem !== null) {
                elem.classList.remove("is-active-create-new-file-modal");
            }
        });

        if (document.querySelector(".is-active-child")) {
            //select all active children and remove them from the dom (active status)
            //this removes any existing active children files
            document.querySelectorAll(".is-active-child").forEach((isActiveChild) => {
                if (isActiveChild !== null) {
                    isActiveChild.classList.remove("is-active-child");
                }
            });
        }

        //null check
        if (DirectoryTreeUIModals.createModalContainer !== null) {
            DirectoryTreeUIModals.createModalContainer.remove();
        }

        const childFileContainer: HTMLDivElement = document.createElement("div");
        childFileContainer.setAttribute("class", "child-file-name-container");

        const childFile: HTMLDivElement = document.createElement("div");
        childFile.setAttribute("class", "child-file-name is-active-child");

        const childFileTextNode: Text = document.createTextNode(this.fileName.split(".md")[0]);

        childFileContainer.appendChild(childFile);

        //assign references to corresponding key properties
        RefsNs.currentParentChildData.map((props) => {
            //log
            console.log(this.fileName);
            //log
            console.log(document.querySelector(".child-file-name.is-active-child") as HTMLElement);

            //null check
            if (props !== null) {
                //child file name
                props.childFileName = this.fileName.split(".md")[0];
                props.childFileNode = document.querySelector(".child-file-name.is-active-child") as HTMLElement;
            }
        });

        document.querySelectorAll(".parent-folder-name").forEach((el) => {
            //this doesn't cover duplicate folder names, so it might cause bugs
            if (el.textContent === createFileModalFolderNameRef) {
                childFile.appendChild(childFileTextNode);

                (el.parentNode as ParentNode).appendChild(childFileContainer);
            }
        });

        //execute parent root listener so it understands the new file
        this.directoryTreeListeners.parentRootListener();

        //execute child node listener to allow new file to be clicked
        this.directoryTreeListeners.childNodeListener();

        //execute parent root listener again so everything will be in sync
        this.directoryTreeListeners.parentRootListener();

        //apply active state listener
        this.dirTreeStateListeners.activeChildFileStateListener();

        //mode check
        if (isModeAdvanced()) {
            //log
            console.log(this.fileName);

            //log
            console.log(createFileModalFolderNameRef);

            //log
            console.log(this.fileName);

            CMEditorView.reinitializeEditor(fsMod.fs._readFileFolder(createFileModalFolderNameRef, this.fileName));

            //set contenteditable
            CMEditorView.setContenteditable(true);

            //cursor theme
            if (Settings.getSettings.lightTheme) {
                CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) });

                AdvancedModeSettings.highlightLight();
            } else if (Settings.getSettings.darkTheme) {
                CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]) });

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

            (document.getElementById("kebab-dropdown-menu-container") as HTMLElement).style.display = "";

            //invoke auto save listener
            this.editorListeners.autoSaveListener("codemirror");

            //word count listener
            wordCountListener("codemirror");

            //kebab dropdown menu listener
            this.editorkebabDropdownMenuListeners.kebabDropdownMenuListener();
        } else if (isModeReading()) {
            reading.createReadingMode(createFileModalFolderNameRef, this.fileName);
        }

        //change document title so it corresponds to the opened file
        await setWindowTitle("Iris", true, createFileModalFolderNameRef + " - " + this.fileName.split(".md")[0]).catch(
            (e) => {
                throw console.error(e);
            }
        );

        //add directory info to editor top bar
        this.editorTopBarContainer.directoryInfo();

        (document.getElementById("file-directory-kebab-dropdown-menu-container") as HTMLElement).style.display = "";

        //dispose
        GenericEvent.use.disposeEvent(
            DirectoryTreeUIModals.createModalContinueButton,
            "click",
            this.createFileModalContinueCb,
            undefined,
            "Disposed create file modal continue event"
        );

        GenericEvent.use.disposeEvent(
            window,
            "keydown",
            KeyBinds.map.bindCb,
            undefined,
            "Disposed event for bind (keydown enter)"
        );
    };

    /**
     * Create file modal continue listener
     *
     * @param el Element to attach `keyup` event listener to
     */
    public createFileModalContinueListener(el: HTMLElement): void {
        GenericEvent.use.createDisposableEvent(
            el,
            "keyup",
            this.createFileModalInputCb,
            undefined,
            "Created disposable event for create file modal input"
        );

        GenericEvent.use.createDisposableEvent(
            DirectoryTreeUIModals.createModalContinueButton,
            "click",
            this.createFileModalContinueCb,
            undefined,
            "Created disposable event for create file modal continue"
        );

        KeyBinds.map.bind(this.createFileModalContinueCb, "Enter", false);
    }

    /**
     * Create file listener
     */
    public createFileListener(): void {
        const createFileNode: NodeListOf<Element> = document.querySelectorAll(".create-new-file");

        this.parentTags = document.querySelectorAll(".parent-of-root-folder");
        this.parentNameTags = document.querySelectorAll(".parent-folder-name");

        //clean this up
        for (let i = 0; i < this.parentNameTags.length; i++) {
            GenericEvent.use.createDisposableEvent(this.parentNameTags[i], "click", () => {
                //check if parent tag contains is-active-parent class
                if (this.parentTags[i].classList.contains("is-active-parent")) {
                    //toggle show-create-file class on create-new-file node
                    createFileNode[i].classList.toggle("show-create-file");

                    GenericEvent.use.createDisposableEvent(createFileNode[i], "click", () => {
                        if (createFileNode[i].classList.contains("show-create-file")) {
                            //invoke create file modal
                            this.createFileModal();

                            //invoke the exit listener for the create file modal
                            this.createFileModalExitListener();

                            //map over parent child data props
                            RefsNs.currentParentChildData.map((props) => {
                                //null check
                                if (props !== null) {
                                    //override current parent folder name ref
                                    props.parentFolderName = this.parentNameTags[i].textContent as string;
                                    props.parentFolderNode = this.parentTags[i];

                                    //invoke createFileModalCurrentFolderNode
                                    this.createFileModalCurrentFolderNode(props.parentFolderName);
                                }
                            });

                            //invoke createFileModalNewFileNameNode
                            this.createFileModalNewFileNameNode();

                            //invoke createFileModalContinueListener
                            this.createFileModalContinueListener(
                                document.querySelector("#create-file-modal-new-file-name-input-node") as HTMLElement
                            );
                        } else if (!createFileNode[i].classList.contains("show-create-file")) {
                            createFileNode[i].classList.remove("show-create-file");
                        }
                    });
                } else if (!this.parentTags[i].classList.contains("is-active-parent")) {
                    createFileNode[i].classList.remove("show-create-file");
                }
            });
        }
    }

    /**
     * Create folder input callback
     *
     * @param e Event
     * @public
     */
    public createFolderInputCb: (e: Event) => void = (e: Event): void => {
        this.folderName = (e.target as HTMLInputElement).value.trim();
        console.log(this.folderName);
    };

    /**
     * Create folder modal continue callback
     *
     * @public
     */
    public createFolderModalContinueCb: () => void = (): void => {
        let parentFolder: HTMLDivElement = {} as HTMLDivElement;

        if (this.folderName === "" || this.folderName === " ") {
            window.electron.ipcRenderer.invoke(
                "show-message-box",
                "Folder name cannot be empty. Enter a valid folder name."
            );

            return;
        } else if (this.folderName !== "" || this.folderName !== (" " as string)) {
            //create directory
            fsMod.fs._createDir(fsMod.fs._baseDir("home") + "/Iris/Notes/" + this.folderName);
        }

        parentFolder = document.createElement("div");
        parentFolder.setAttribute("class", "parent-of-root-folder is-not-active-parent");
        (document.getElementById("file-directory-tree-container-inner") as HTMLElement).appendChild(parentFolder);

        const parentFolderName: HTMLDivElement = document.createElement("div");
        parentFolderName.setAttribute("class", "parent-folder-name");
        parentFolder.appendChild(parentFolderName);

        const parentFolderTextNode: Text = document.createTextNode(this.folderName);
        parentFolderName.appendChild(parentFolderTextNode);

        const parentFolderCaret: HTMLDivElement = document.createElement("div");
        parentFolderCaret.setAttribute("class", "parent-folder-caret");

        const parentFolderCaretTextNode: Text = document.createTextNode(String.fromCharCode(94));
        parentFolderCaret.appendChild(parentFolderCaretTextNode);
        parentFolder.appendChild(parentFolderCaret);

        //invoke parent root listener (created directory only)
        this.directoryTreeListeners.parentRootListener();

        //invoke create file node
        //bug
        this.createFileNode(parentFolder);
        this.createFileNode(parentFolder);

        //invoke create file listener
        this.createFileListener();

        //null check
        if (DirectoryTreeUIModals.createModalContainer !== null) {
            DirectoryTreeUIModals.createModalContainer.remove();
        }

        //invoke parent root listener again so entire directory tree will function normally and be in sync
        //bug
        this.directoryTreeListeners.parentRootListener();
        this.directoryTreeListeners.parentRootListener();

        //dispose create file modal continue cb
        GenericEvent.use.disposeEvent(
            DirectoryTreeUIModals.createModalContinueButton,
            "click",
            this.createFileModalContinueCb,
            undefined,
            "Disposed event for create file modal continue"
        );

        //dispose bind cb
        GenericEvent.use.disposeEvent(
            window,
            "keydown",
            KeyBinds.map.bindCb,
            undefined,
            "Disposed event for bind (keydown enter)"
        );

        //dispose create folder input cb
        GenericEvent.use.disposeEvent(
            document.body,
            "keyup",
            this.createFolderInputCb,
            undefined,
            "Disposed event for create folder input"
        );
    };

    /**
     * Create folder continue listener
     *
     * @param el Element to attach the `keyup` event listener to
     */
    public createFolderContinueListener(el: HTMLElement): void {
        GenericEvent.use.createDisposableEvent(
            el,
            "keyup",
            this.createFolderInputCb,
            undefined,
            "Created disposable event for create folder input"
        );

        GenericEvent.use.createDisposableEvent(
            DirectoryTreeUIModals.createModalContinueButton,
            "click",
            this.createFolderModalContinueCb,
            undefined,
            "Created event for create folder modal continue"
        );

        KeyBinds.map.bind(this.createFolderModalContinueCb, "Enter", false);
    }

    /**
     * Create folder modal exit callback
     * @public
     */
    public createFolderModalExitCb: () => void = (): void => {
        if ((document.getElementById("create-modal-container") as HTMLElement) !== null) {
            (document.getElementById("create-modal-container") as HTMLElement).remove();
        }

        if (isModeAdvanced() || isModeReading()) {
            this.directoryTreeListeners.parentRootListener();
            this.createFileListener();
        }

        GenericEvent.use.setEventCallbackTimeout(() => {
            //dispose create folder modal exit cb
            GenericEvent.use.disposeEvent(
                DirectoryTreeUIModals.createModalExitButton,
                "click",
                this.createFolderModalExitCb,
                undefined,
                "Disposed event for create folder modal exit (click)"
            );

            //dispose bind cb
            GenericEvent.use.disposeEvent(
                window,
                "keydown",
                KeyBinds.map.bindCb,
                undefined,
                "Disposed event for bind (keydown escape)"
            );

            //dispose create folder input cb
            GenericEvent.use.disposeEvent(
                document.body,
                "keyup",
                this.createFolderInputCb,
                undefined,
                "Disposed event for create folder input"
            );
        }, 150);

        KeyBinds.map.resetMapList();
    };

    /**
     * Create folder modal exit listener
     */
    public createFolderModalExitListener(): void {
        GenericEvent.use.createDisposableEvent(
            DirectoryTreeUIModals.createModalExitButton,
            "click",
            this.createFolderModalExitCb,
            undefined,
            "Created event for create folder modal exit (click)"
        );

        KeyBinds.map.bind(this.createFolderModalExitCb, "Escape", false);
    }

    /**
     * Create folder callback
     *
     * @public
     */
    public createFolderCb: () => void = (): void => {
        GenericEvent.use.setEventCallbackTimeout(() => {
            //log
            console.log("clicked create folder");

            //invoke create folder modal
            this.createFolderModal();

            //invoke create modal exit listener
            this.createFolderModalExitListener();

            //mode check
            if (isModeAdvanced() || isModeReading()) {
                //invoke create folder continue listener
                this.createFolderContinueListener(document.getElementById("create-folder-input-node") as HTMLElement);
            }

            //dispose create folder cb
            GenericEvent.use.disposeEvent(
                document.getElementById("create-folder") as HTMLElement,
                "click",
                () => GenericEvent.use.setEventCallbackTimeout(this.createFolderCb, 50),
                undefined,
                "Disposed event for create folder (click)"
            );
        }, 50);
    };

    /**
     * Create folder listener
     */
    public createFolderListener(): void {
        GenericEvent.use.createDisposableEvent(
            document.getElementById("create-folder") as HTMLElement,
            "click",
            () => GenericEvent.use.setEventCallbackTimeout(this.createFolderCb, 50),
            undefined,
            "Created event for create folder (click)"
        );
    }
}
