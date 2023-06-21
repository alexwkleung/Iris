import { EditorKebabDropdownMenu } from "../misc-ui/editor-kebab-dropdown-menu"
import { EditorKebabDropdownModals } from "../misc-ui/editor-kebab-dropdown-modals"
import { fsMod } from "../utils/alias"
import { isModeBasic } from "../utils/is"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { setWindowTitle } from "../window/window-title"

export class EditorKebabDropdownMenuListeners extends EditorKebabDropdownModals {
    /**
     * Kebab delete file exit modal listener
     */
    public kebabDeleteFileExitModalListener(): void {
        EditorKebabDropdownModals.kebabModalExitButtonNode.addEventListener('click', () => {
            EditorKebabDropdownModals.kebabModalContainerNode.remove();
        })
    }

    /**
     * Kebab delete file continue modal listener
     * 
     * @param type Mode type
     */
    public kebabDeleteFileContinueModalListener(type: string): void {
        EditorKebabDropdownModals.kebabModalContinueButtonNode.addEventListener('click', () => {
            document.querySelectorAll('.child-file-name.is-active-child').forEach(async (el) => {
                //mode check
                if(type === "Basic" && isModeBasic()) {
                    //log
                    console.log(
                        fsMod.fs._baseDir("home")
                        + "/Iris/Basic/"
                        + document.title.split('-')[1].trim()
                        + "/"
                        + el.textContent + ".md"
                    );

                    fsMod.fs._deletePath(
                        fsMod.fs._baseDir("home")
                        + "/Iris/Basic/"
                        + document.title.split('-')[1].trim()
                        + "/"
                        + el.textContent + ".md"
                    );

                    //remove kebab modal container node
                    EditorKebabDropdownModals.kebabModalContainerNode.remove();

                    //remove active file from tree
                    el.remove();

                    //destroy editor and respawn 
                    PMEditorView.editorView.destroy();
                    PMEditorView.createEditorView();
                    PMEditorView.setContenteditable(false);

                    //hide prosemirror menubar
                    (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "none";

                    //hide kebab dropdown menu container
                    (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "none";

                    //kebab after click menu container reset
                    (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
                    (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');

                    //word counter reset
                    (document.getElementById('word-count-container') as HTMLElement).style.display = "none";
                    (document.getElementById('word-count-container') as HTMLElement).textContent = "";
                    
                    //set window title to default
                    await setWindowTitle("Iris", false, null);

                    //remove top bar directory info node
                    (document.getElementById('top-bar-directory-info') as HTMLElement).remove();
                }
            })
        })
    }

    /**
     * Kebab dropdown delete file listener
     */
    public kebabDropdownDeleteFileListener(): void {
        (document.getElementById('kebab-delete-file-button-node') as HTMLElement).addEventListener('click', () => {
            console.log("clicked kebab delete");

            document.querySelectorAll('#kebab-modal-container-node').forEach((el) => {
                //null check
                if(el !== null) {
                    //remove any remaining kebab modal container nodes
                    el.remove();
                }
            })

            //create kebab modal container
            this.kebabModalContainer();

            //invoke kebab delete file exit modal listener
            this.kebabDeleteFileExitModalListener();

            //invoke kebab delete file continue modal listener
            this.kebabDeleteFileContinueModalListener("Basic");
        })
    }

    /**
     * Kebab dropdown menu listener
     */
    public kebabDropdownMenuListener(): void {
        EditorKebabDropdownMenu.kebabDropdownMenuContainerNode.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
    
            console.log("clicked kebab");
    
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.toggle('is-active');
    
            if((document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.contains('is-active')) {
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "";
            } else {
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
            }

            //invoke kebab dropdown delete file listener
            this.kebabDropdownDeleteFileListener();
        });

        //hide kebab after click menu container when editor is clicked 
        (document.querySelector('.ProseMirror') as HTMLElement).addEventListener('click', () => {
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');
        });

        //hide kebab after click menu container when file directory is clicked
        (document.getElementById('file-directory-tree-container') as HTMLElement).addEventListener('click', () => {
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');
        });
    }
}