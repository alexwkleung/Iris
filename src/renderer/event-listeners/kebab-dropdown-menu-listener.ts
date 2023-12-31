import { EditorKebabDropdownMenu } from "../misc-ui/editor-kebab-dropdown-menu";
import { EditorKebabDropdownModals } from "../misc-ui/editor-kebab-dropdown-modals";
import { fsMod } from "../../utils/alias";
import { isModeAdvanced } from "../../utils/is";
import { setWindowTitle } from "../window/window-title";
import { RefsNs } from "./directory-tree-listeners";
import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { DirectoryTree } from "../file-directory-tree/file-directory";
import { GenericEvent } from "./event";
import { KeyBinds } from "../keybinds/keybinds";

/**
 * @extends EditorKebabDropdownModals
 */
export class EditorKebabDropdownMenuListeners extends EditorKebabDropdownModals {
    private readonly directoryTree = new DirectoryTree();

    private renameFile: string = "";

    public kebabModalContainerCb: () => void = (): void => {
        EditorKebabDropdownModals.kebabModalContainerNode.remove();

        GenericEvent.use.disposeEvent(
            EditorKebabDropdownModals.kebabModalExitButtonNode,
            "click",
            this.kebabModalContainerCb,
            undefined,
            "Disposed kebab modal container event"
        );

        GenericEvent.use.disposeEvent(
            window,
            "keydown",
            this.kebabModalContainerCb,
            undefined,
            "Disposed event for kebab modal container (keydown escape)"
        );

        KeyBinds.map.resetMapList();
    };

    /**
     * Kebab exit modal listener
     */
    public kebabExitModalListener(): void {
        GenericEvent.use.createDisposableEvent(
            EditorKebabDropdownModals.kebabModalExitButtonNode,
            "click",
            this.kebabModalContainerCb,
            undefined,
            "Created disposable event for kebab modal container event"
        );

        KeyBinds.map.bind(this.kebabModalContainerCb, "Escape", false);
    }

    /**
     * Kebab delete file continue callback
     *
     * @public
     */
    public kebabDeleteFileContinueCb: () => void = (): void => {
        document.querySelectorAll(".child-file-name.is-active-child").forEach(async (el) => {
            if (isModeAdvanced()) {
                fsMod.fs._deletePath(
                    fsMod.fs._baseDir("home") +
                        "/Iris/Notes/" +
                        document.title.split("-")[1].trim() +
                        "/" +
                        el.textContent +
                        ".md"
                );

                CMEditorView.editorView.destroy();
                CMEditorView.createEditorView();
                CMEditorView.setContenteditable(false);
            }

            //remove kebab modal container node
            EditorKebabDropdownModals.kebabModalContainerNode.remove();

            //remove active file from tree
            el.remove();

            //hide kebab dropdown menu container
            (document.getElementById("kebab-dropdown-menu-container") as HTMLElement).style.display = "none";

            //kebab after click menu container
            (document.getElementById("kebab-after-click-menu-container") as HTMLElement).style.display = "none";
            (document.getElementById("kebab-after-click-menu-container") as HTMLElement).classList.remove("is-active");

            //word counter
            (document.getElementById("word-count-container") as HTMLElement).style.display = "none";

            //set window title to default
            await setWindowTitle("Iris", false, null);

            //remove top bar directory info node
            (document.getElementById("top-bar-directory-info") as HTMLElement).remove();

            (document.getElementById("file-directory-kebab-dropdown-menu-container") as HTMLElement).style.display =
                "none";
        });

        GenericEvent.use.disposeEvent(
            window,
            "keydown",
            KeyBinds.map.bindCb,
            undefined,
            "Disposed event for kebab delete file continue (keydown enter)"
        );
    };

    /**
     * Kebab delete file continue modal listener
     */
    public kebabDeleteFileContinueModalListener(): void {
        GenericEvent.use.createDisposableEvent(
            EditorKebabDropdownModals.kebabModalContinueButtonNode,
            "click",
            this.kebabDeleteFileContinueCb,
            undefined,
            "Created event for kebab modal continue button (click)"
        );

        KeyBinds.map.bind(this.kebabDeleteFileContinueCb, "Enter", false);
    }

    public kebabDropdownDeleteFileCb: () => void = (): void => {
        //log
        console.log("clicked kebab delete");

        document.querySelectorAll("#kebab-modal-container-node").forEach((el) => {
            //null check
            if (el !== null) {
                //remove any remaining kebab modal container nodes
                el.remove();
            }

            GenericEvent.use.disposeEvent(
                document.getElementById("kebab-delete-file-button-node") as HTMLElement,
                "click",
                this.kebabDropdownDeleteFileCb,
                undefined,
                "Disposed event for kebab dropdown delete file (click)"
            );
        });

        //create kebab modal container
        this.kebabModalDeleteFileContainer();

        //invoke kebab delete file exit modal listener
        this.kebabExitModalListener();

        //invoke kebab delete file continue modal listener
        this.kebabDeleteFileContinueModalListener();
    };

    /**
     * Kebab dropdown delete file listener
     */
    public kebabDropdownDeleteFileListener(): void {
        GenericEvent.use.createDisposableEvent(
            document.getElementById("kebab-delete-file-button-node") as HTMLElement,
            "click",
            this.kebabDropdownDeleteFileCb,
            undefined,
            "Created event for kebab dropdown delete file (click)"
        );
    }

    /**
     * Kebab rename file continue callback
     *
     * @public
     */
    public kebabRenameFileContinueCb: () => void = (): void => {
        console.log(
            ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0]
        );
        console.log(
            fsMod.fs._baseDir("home") +
                "/Iris/Notes" +
                ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string)
                    .split("-")[0]
                    .trim() +
                "/" +
                (document.querySelector(".child-file-name.is-active-child") as HTMLElement).textContent
        );
        console.log(
            fsMod.fs._baseDir("home") +
                "/Iris/Notes" +
                ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string)
                    .split("-")[0]
                    .trim() +
                "/" +
                this.renameFile
        );

        if (
            this.renameFile === " " ||
            this.renameFile === "" ||
            this.renameFile ===
                (document.querySelector(".child-file-name.is-active-child") as HTMLElement).textContent ||
            (document.getElementById("rename-file-input-node") as HTMLElement).textContent ===
                (document.querySelector(".child-file-name.is-active-child") as HTMLElement).textContent
        ) {
            //log
            console.log("name is equal or empty");

            window.electron.ipcRenderer.invoke(
                "show-message-box",
                "Cannot rename note. Name must be different and not empty."
            );

            return;
        } else {
            //log
            console.log("name is not equal or empty");

            //rename file
            fsMod.fs._renameFile(
                fsMod.fs._baseDir("home") +
                    "/Iris/Notes/" +
                    ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string)
                        .split("-")[0]
                        .trim() +
                    "/" +
                    (document.querySelector(".child-file-name.is-active-child") as HTMLElement).textContent +
                    ".md",
                fsMod.fs._baseDir("home") +
                    "/Iris/Notes/" +
                    ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string)
                        .split("-")[0]
                        .trim() +
                    "/" +
                    this.renameFile +
                    ".md"
            );

            //remove kebab modal container node
            EditorKebabDropdownModals.kebabModalContainerNode.remove();

            //create top bar info
            const topBarInfo: string =
                ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string)
                    .split("-")[0]
                    .trim() +
                " - " +
                this.renameFile;

            //update top bar directory info
            (document.getElementById("top-bar-directory-info") as HTMLElement).textContent = topBarInfo;

            //update child file name in directory tree
            (document.querySelector(".child-file-name.is-active-child") as HTMLElement).textContent = this.renameFile;

            //update child file name reference
            RefsNs.currentParentChildData.map((props) => {
                props.childFileName = this.renameFile;
            });

            GenericEvent.use.disposeEvent(
                document.getElementById("kebab-modal-continue-button") as HTMLElement,
                "click",
                this.kebabRenameFileContinueCb,
                undefined,
                "Disposed event for kebab rename file continue (click)"
            );
            GenericEvent.use.disposeEvent(
                window,
                "keydown",
                KeyBinds.map.bindCb,
                undefined,
                "Disposed event for kebab rename file continue (keydown enter)"
            );
        }
    };

    public renameFileCb: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
        this.renameFile = (e.target as HTMLInputElement).value.trim();

        (document.getElementById("rename-file-input-node") as HTMLElement).textContent = this.renameFile;

        //log
        console.log(this.renameFile);
    };

    public kebabRenameFileContinueModalListener(): void {
        GenericEvent.use.createDisposableEvent(
            document.getElementById("rename-file-input-node") as HTMLElement,
            "keyup",
            this.renameFileCb,
            undefined,
            "Created event for rename file (keyup)"
        );

        GenericEvent.use.createDisposableEvent(
            document.getElementById("kebab-modal-continue-button") as HTMLElement,
            "click",
            this.kebabRenameFileContinueCb,
            undefined,
            "Created event for kebab rename file continue (click)"
        );

        KeyBinds.map.bind(this.kebabRenameFileContinueCb, "Enter", false);
    }

    public kebabDropdownRenameFileCb: () => void = (): void => {
        //log
        console.log("clicked kebab rename");

        document.querySelectorAll("#kebab-modal-container-node").forEach((el) => {
            //null check
            if (el !== null) {
                //remove any remaining kebab modal container nodes
                el.remove();
            }
        });

        GenericEvent.use.setEventCallbackTimeout(() => {
            this.kebabDropdownRenameFileContainer();

            this.kebabExitModalListener();

            this.kebabRenameFileContinueModalListener();
        }, 20);
    };

    /**
     * Kebab dropdown rename file listener
     */
    public kebabDropdownRenameFileListener(): void {
        GenericEvent.use.createDisposableEvent(
            document.getElementById("kebab-rename-file-button") as HTMLElement,
            "click",
            () => GenericEvent.use.setEventCallbackTimeout(this.kebabDropdownRenameFileCb, 50),
            undefined,
            "Created disposable event for kebab dropdown rename file"
        );
    }

    /**
     * Kebab dropdown menu listener
     */
    public kebabDropdownMenuListener(): void {
        EditorKebabDropdownMenu.kebabDropdownMenuContainerNode.addEventListener("click", (e) => {
            e.stopImmediatePropagation();

            console.log("clicked kebab");

            (document.getElementById("kebab-after-click-menu-container") as HTMLElement).classList.toggle("is-active");

            if (
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).classList.contains(
                    "is-active"
                )
            ) {
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).style.display = "";
            } else {
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).style.display = "none";
            }

            //invoke kebab dropdown delete file listener
            this.kebabDropdownDeleteFileListener();

            this.kebabDropdownRenameFileListener();
        });

        if (document.querySelector(".ProseMirror") as HTMLElement) {
            //hide kebab after click menu container when editor is clicked
            (document.querySelector(".ProseMirror") as HTMLElement).addEventListener("click", () => {
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).style.display = "none";
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).classList.remove(
                    "is-active"
                );
            });
        } else if (document.querySelector(".cm-editor") as HTMLElement) {
            //hide kebab after click menu container when editor is clicked
            (document.querySelector(".cm-editor") as HTMLElement).addEventListener("click", () => {
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).style.display = "none";
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).classList.remove(
                    "is-active"
                );
            });
        }

        //hide kebab after click menu container when file directory inner is clicked
        (document.getElementById("file-directory-tree-container-inner") as HTMLElement).addEventListener(
            "click",
            () => {
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).style.display = "none";
                (document.getElementById("kebab-after-click-menu-container") as HTMLElement).classList.remove(
                    "is-active"
                );
            }
        );
    }
}
