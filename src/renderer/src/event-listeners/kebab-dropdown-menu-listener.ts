import { EditorKebabDropdownMenu } from "../misc-ui/editor-kebab-dropdown-menu"
import { EditorKebabDropdownModals } from "../misc-ui/editor-kebab-dropdown-modals"
import { fsMod } from "../utils/alias"
import { isModeAdvanced, isModeBasic } from "../utils/is"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { setWindowTitle } from "../window/window-title"
import { RefsNs } from "./directory-tree-listeners"
import { CMEditorView } from "../codemirror/editor/cm-editor-view"

/**
 * @extends EditorKebabDropdownModals
 */
export class EditorKebabDropdownMenuListeners extends EditorKebabDropdownModals {
    /**
     * Kebab exit modal listener
     */
    public kebabExitModalListener(): void {
        EditorKebabDropdownModals.kebabModalExitButtonNode.addEventListener('click', () => {
            EditorKebabDropdownModals.kebabModalContainerNode.remove();
        })
    }

    /**
     * Kebab delete file continue modal listener
     */
    public kebabDeleteFileContinueModalListener(): void {
        EditorKebabDropdownModals.kebabModalContinueButtonNode.addEventListener('click', () => {
            document.querySelectorAll('.child-file-name.is-active-child').forEach(async (el) => {
                //mode check
                if(isModeBasic()) {
                    //log
                    console.log(
                        fsMod.fs._baseDir("home")
                        + "/Iris/Notes/"
                        + document.title.split('-')[1].trim()
                        + "/"
                        + el.textContent + ".md"
                    );

                    fsMod.fs._deletePath(
                        fsMod.fs._baseDir("home")
                        + "/Iris/Notes/"
                        + document.title.split('-')[1].trim()
                        + "/"
                        + el.textContent + ".md"
                    );

                    //hide prosemirror menubar
                    (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "none";
                    
                    //destroy editor and respawn 
                    PMEditorView.editorView.destroy();
                    PMEditorView.createEditorView();
                    PMEditorView.setContenteditable(false);
                } else if(isModeAdvanced()) {
                    CMEditorView.editorView.destroy();
                    CMEditorView.createEditorView();
                    CMEditorView.setContenteditable(false);
                }
                    //remove kebab modal container node
                    EditorKebabDropdownModals.kebabModalContainerNode.remove();

                    //remove active file from tree
                    el.remove();

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
            })
        })
    }

    /**
     * Kebab dropdown delete file listener
     */
    public kebabDropdownDeleteFileListener(): void {
        (document.getElementById('kebab-delete-file-button-node') as HTMLElement).addEventListener('click', () => {
            //log
            console.log("clicked kebab delete");

            document.querySelectorAll('#kebab-modal-container-node').forEach((el) => {
                //null check
                if(el !== null) {
                    //remove any remaining kebab modal container nodes
                    el.remove();
                }
            })

            //create kebab modal container
            this.kebabModalDeleteFileContainer();

            //invoke kebab delete file exit modal listener
            this.kebabExitModalListener();

            //invoke kebab delete file continue modal listener
            this.kebabDeleteFileContinueModalListener();
        })
    }

    public kebabRenameFileContinueModalListener(): void {
        let renameFile: string = "";

        (document.getElementById('rename-file-input-node') as HTMLElement).addEventListener('keyup', (e) => {
            renameFile = ((e.target as HTMLInputElement).value).trim();

            (document.getElementById('rename-file-input-node') as HTMLElement).textContent = renameFile;

            //log
            console.log(renameFile);
        });

        (document.getElementById('kebab-modal-continue-button') as HTMLElement).addEventListener('click', () => {
            console.log(((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0]);
            console.log(fsMod.fs._baseDir("home") + "/Iris/Notes" + ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0].trim() + "/" + (document.querySelector('.child-file-name.is-active-child') as HTMLElement).textContent);
            console.log(fsMod.fs._baseDir("home") + "/Iris/Notes" + ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0].trim() + "/" + renameFile);
            if(renameFile === " " || renameFile === "" || renameFile === (document.querySelector('.child-file-name.is-active-child') as HTMLElement).textContent || (document.getElementById('rename-file-input-node') as HTMLElement).textContent === (document.querySelector('.child-file-name.is-active-child') as HTMLElement).textContent) {
                //log
                console.log("name is equal or empty");
                
                return;
            } else {
                //log
                console.log("name is not equal or empty");

                //rename file
                fsMod.fs._renameFile(
                    fsMod.fs._baseDir("home") + "/Iris/Notes/" + ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0].trim() + "/" + (document.querySelector('.child-file-name.is-active-child') as HTMLElement).textContent + ".md",
                    fsMod.fs._baseDir("home") + "/Iris/Notes/" + ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0].trim() + "/" + renameFile + ".md"
                )
    
                //remove kebab modal container node
                EditorKebabDropdownModals.kebabModalContainerNode.remove();
    
                //create top bar info
                const topBarInfo: string = ((document.getElementById("top-bar-directory-info") as HTMLElement).textContent as string).split("-")[0].trim() + " - " + renameFile;
                    
                //update top bar directory info 
                (document.getElementById('top-bar-directory-info') as HTMLElement).textContent = topBarInfo;
                    
                //update child file name in directory tree
                (document.querySelector('.child-file-name.is-active-child') as HTMLElement).textContent = renameFile;
    
                //update child file name reference
                RefsNs.currentParentChildData.map((props) => {
                    props.childFileName = renameFile
                });
            }
        })
    }

    /**
     * Kebab dropdown rename file listener
     */
    public kebabDropdownRenameFileListener(): void {
        (document.getElementById('kebab-rename-file-button') as HTMLElement).addEventListener('click', () => {
            //log 
            console.log("clicked kebab rename");

            document.querySelectorAll('#kebab-modal-container-node').forEach((el) => {
                //null check
                if(el !== null) {
                    //remove any remaining kebab modal container nodes
                    el.remove();
                }
            })
            
            this.kebabDropdownRenameFileContainer();

            this.kebabExitModalListener();

            this.kebabRenameFileContinueModalListener();
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

            this.kebabDropdownRenameFileListener();
        });

        if((document.querySelector('.ProseMirror') as HTMLElement)) {
            //hide kebab after click menu container when editor is clicked 
            (document.querySelector('.ProseMirror') as HTMLElement).addEventListener('click', () => {
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');
            });
        } else if((document.querySelector('.cm-editor') as HTMLElement)) {
            //hide kebab after click menu container when editor is clicked 
            (document.querySelector('.cm-editor') as HTMLElement).addEventListener('click', () => {
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');
            });
        }

        //hide kebab after click menu container when file directory inner is clicked
        (document.getElementById('file-directory-tree-container-inner') as HTMLElement).addEventListener('click', () => {
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');
        });
    }
}