import { EditorKebabDropdownMenu } from "../misc-ui/editor-kebab-dropdown-menu"
import { EditorKebabDropdownModals } from "../misc-ui/editor-kebab-dropdown-modals"
import { fsMod } from "../utils/alias"
import { isModeAdvanced, isModeBasic } from "../utils/is"
import { PMEditorView } from "../prosemirror/editor/pm-editor-view"
import { setWindowTitle } from "../window/window-title"
import { RefsNs } from "./directory-tree-listeners"
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { FolderFileCount } from "../misc-ui/folder-file-count"
import { DirectoryTree } from "../file-directory-tree/file-directory"
import { GenericEvent } from "./event"

/**
 * @extends EditorKebabDropdownModals
 */
export class EditorKebabDropdownMenuListeners extends EditorKebabDropdownModals {
    private readonly folderFileCount = new FolderFileCount();
    private readonly directoryTree = new DirectoryTree();


    public kebabModalContainerCb: () => void  = (): void => {
        EditorKebabDropdownModals.kebabModalContainerNode.remove();

        GenericEvent.use.disposeEvent(EditorKebabDropdownModals.kebabModalExitButtonNode, 'click', this.kebabModalContainerCb, undefined, "Disposed kebab modal container event")
    }

    /**
     * Kebab exit modal listener
     */
    public kebabExitModalListener(): void {
        GenericEvent.use.createDisposableEvent(EditorKebabDropdownModals.kebabModalExitButtonNode, 'click', this.kebabModalContainerCb, undefined, "Created disposable event for kebab modal container event")
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

                    //destroy editor and respawn 
                    PMEditorView.editorView.destroy();
                    PMEditorView.createEditorView();
                    PMEditorView.setContenteditable(false);

                    //hide prosemirror menubar
                    (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "none";
                    
                    const parentRoot: NodeListOf<Element> = document.querySelectorAll('.parent-of-root-folder');
                    const parentNameTags: NodeListOf<Element> = document.querySelectorAll('.parent-folder-name');
                        
                    let count: number = 0;
                    //remove duplicate folder file count nodes
                    while(count <= 2) {
                        document.querySelectorAll('.folder-file-count-container').forEach((el) => {
                            el.remove();
                        });
                        count++;
                    }

                    for(let i = 0; i < parentNameTags.length; i++) {
                        //invoke folder file count
                        this.folderFileCount.folderFileCount(parentRoot[i], this.directoryTree.parentNameTagsArr()[i], true);
                    }

                    //hide file directory kebab dropdown menu container
                    (document.getElementById('file-directory-kebab-dropdown-menu-container') as HTMLElement).style.display = "none";
                } else if(isModeAdvanced()) {
                    fsMod.fs._deletePath(
                        fsMod.fs._baseDir("home")
                        + "/Iris/Notes/"
                        + document.title.split('-')[1].trim()
                        + "/"
                        + el.textContent + ".md"
                    );
                    
                    CMEditorView.editorView.destroy();
                    CMEditorView.createEditorView();
                    CMEditorView.setContenteditable(false);

                    const parentRoot: NodeListOf<Element> = document.querySelectorAll('.parent-of-root-folder');
                    const parentNameTags: NodeListOf<Element> = document.querySelectorAll('.parent-folder-name');
                        
                    let count: number = 0;
                    //remove duplicate folder file count nodes
                    while(count <= 2) {
                        document.querySelectorAll('.folder-file-count-container').forEach((el) => {
                            el.remove();
                        });
                        count++;
                    }

                    for(let i = 0; i < parentNameTags.length; i++) {
                        //invoke folder file count
                        this.folderFileCount.folderFileCount(parentRoot[i], this.directoryTree.parentNameTagsArr()[i], true);
                    }
                }
                
                //remove kebab modal container node
                EditorKebabDropdownModals.kebabModalContainerNode.remove();

                //remove active file from tree
                el.remove();

                //hide kebab dropdown menu container
                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "none";

                //kebab after click menu container
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
                (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.remove('is-active');

                //word counter
                (document.getElementById('word-count-container') as HTMLElement).style.display = "none";
                    
                //set window title to default
                await setWindowTitle("Iris", false, null);

                //remove top bar directory info node
                (document.getElementById('top-bar-directory-info') as HTMLElement).remove();

                (document.getElementById('file-directory-kebab-dropdown-menu-container') as HTMLElement).style.display = "none";
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
                
                window.electron.ipcRenderer.invoke('error-dialog', "Iris", "Cannot rename note. Name must be different and not empty.")

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