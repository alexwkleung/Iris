import { EditorNs } from "../../editor-main"
import { DirectoryTreeUIModals } from "../file-directory-tree/file-directory-tree-modals"
import { IDirectoryTreeUIModalListeners } from "../interfaces/listener-interfaces"
import { FolderFileCount } from "../misc-ui/folder-file-count"
import { DirectoryTreeListeners } from "./directory-tree-listeners"
import { EditorListeners } from "./editor-listeners"
import { DirectoryTreeStateListeners } from "./file-directory-state-listener"
import { isModeAdvanced, isModeBasic } from "../utils/is"
import { fsMod } from "../utils/alias"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { PMEditorState } from "../prosemirror/editor/editor-state"
import { Node } from "prosemirror-model"
import { defaultMarkdownParser } from "prosemirror-markdown"
import { RefsNs } from "./directory-tree-listeners"
import { wordCountListener } from "./word-count-listener"
import { setWindowTitle } from "../window/window-title"
import { EditorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener"
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { CMEditorState } from "../codemirror/editor/cm-editor-state"
import { cursors } from "../codemirror/extensions/cursors"
import { Settings } from "../settings/settings"

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
     * Folder file count object
     * 
     * @private 
     * @readonly
     */
    private readonly folderFileCountObject = new FolderFileCount();

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
     * Create file modal exit listener
     */
    public createFileModalExitListener(): void {
        DirectoryTreeUIModals.createModalExitButton.addEventListener('click', () => {
            const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll('.create-new-file');

            createFileNode.forEach((elem) => {
                //null check
                if(elem !== null) {
                    elem.classList.remove('is-active-create-new-file-modal');
                }
            });

            //null check
            if(DirectoryTreeUIModals.createModalContainer !== null) {
                DirectoryTreeUIModals.createModalContainer.remove();
            }
                //invoke parent root listener
                this.directoryTreeListeners.parentRootListener();
    
                //invoke child node listener
                this.directoryTreeListeners.childNodeListener();
    
                //invoke parent root listener again so the directory tree will be in sync
                this.directoryTreeListeners.parentRootListener();
        })
    }

    /**
     * Create file modal continue listener 
     * 
     * @param el Element to attach `keyup` event listener to
     */
    public createFileModalContinueListener(el: HTMLElement): void {
        let fileName: string = "";

        el.addEventListener('keyup', (e) => {
            //assign current value of input element on keyup + extension
            fileName = ((e.target as HTMLInputElement).value).trim() + ".md";

            //log
            console.log(fileName);
        })


        DirectoryTreeUIModals.createModalContinueButton.addEventListener('click', async () => {
            //mode check
            if(isModeBasic() && fileName !== " ") {
                //log
                console.log((document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent)
                
                fsMod.fs._createFile(
                    fsMod.fs._baseDir("home") 
                    + "/Iris/Notes/" 
                    + (document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent 
                    +  "/" + fileName,
                    "# " + fileName.split('.md')[0] + " " + '\n'
                );

                const createFileModalFolderNameRef: string = (document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent as string;

                const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll('.create-new-file');

                createFileNode.forEach((elem) => {
                    //null check
                    if(elem !== null) {
                        elem.classList.remove('is-active-create-new-file-modal');
                    }
                });

                //null check
                if(DirectoryTreeUIModals.createModalContainer !== null) {
                    DirectoryTreeUIModals.createModalContainer.remove();
                }

                //log
                console.log(fileName);

                //if document contains at least one active child
                if(document.querySelector('.is-active-child')) {
                    //select all active children and remove them from the dom (active status)
                    //this removes any existing active children files
                    document.querySelectorAll('.is-active-child').forEach(
                        (isActiveChild) => {
                            if(isActiveChild !== null) {
                                isActiveChild.classList.remove('is-active-child')
                            }
                        }
                    );
                }

                const childFile: HTMLDivElement = document.createElement('div');
                childFile.setAttribute("class", "child-file-name is-active-child");

                const childFileTextNode: Text = document.createTextNode(fileName.split('.md')[0]);

                document.querySelectorAll('.parent-folder-name').forEach((el) => {
                    //this doesn't cover duplicate folder names, so it might cause bugs
                    if(el.textContent === createFileModalFolderNameRef) {
                        childFile.appendChild(childFileTextNode);

                        (el.parentNode as ParentNode).appendChild(childFile);
                    }
                })
            
                //execute parent root listener so it understands the new file
                this.directoryTreeListeners.parentRootListener();

                //execute child node listener to allow new file to be clicked
                this.directoryTreeListeners.childNodeListener();

                //execute parent root listener again so everything will be in sync 
                this.directoryTreeListeners.parentRootListener();

                //destroy current editor view
                PMEditorView.editorView.destroy();
                            
                //create new editor view
                PMEditorView.createEditorView();

                //log
                console.log(createFileModalFolderNameRef);

                //log
                console.log(fileName);
    
                //update editor view state
                PMEditorView.editorView.updateState(             
                    //apply transaction
                    PMEditorView.editorView.state.apply(     
                        //since editor gets destroyed and re-created, the 
                        //range is 0 to 0 
                        PMEditorState.editorState.tr.replaceRangeWith(
                            0, 
                            0,
                            defaultMarkdownParser.parse(
                            fsMod.fs._readFileFolder(createFileModalFolderNameRef, 
                            fileName
                        )
                    ) as Node
                )));

                //set contenteditable 
                PMEditorView.setContenteditable(true);
                
                //if contenteditable attribute is set to true 
                if((document.querySelector('.ProseMirror') as HTMLElement).getAttribute('contenteditable') === 'true') {
                    //show the menubar
                    (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "";
                }

                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "";

                //invoke auto save listener
                this.editorListeners.autoSaveListener("prosemirror");

                //invoke insert tab listener
                this.editorListeners.insertTabListener((document.querySelector('.ProseMirror') as HTMLElement), 2);

                //assign references to corresponding key properties
                RefsNs.currentParentChildData.map((props) => {
                    //log
                    console.log(fileName);
                    //log
                    console.log(document.querySelector('.child-file-name.is-active-child') as HTMLElement);
                    
                    //null check
                    if(props !== null) {
                        //child file name
                        props.childFileName = fileName.split('.md')[0];
                        props.childFileNode = document.querySelector('.child-file-name.is-active-child') as HTMLElement
                    }
                });

                //apply active state listener 
                this.dirTreeStateListeners.activeChildFileStateListener();

                //word count listener
                wordCountListener("prosemirror");

                //kebab dropdown menu listener
                this.editorkebabDropdownMenuListeners.kebabDropdownMenuListener();

                //change document title so it corresponds to the opened file
                await setWindowTitle("Iris", true, createFileModalFolderNameRef + " - " + fileName.split('.md')[0]).catch((e) => { throw console.error(e) });

                //add directory info to editor top bar
                this.editorTopBarContainer.directoryInfo();

                //to-do: sort files...
            } else if(isModeAdvanced()) {
                //log
                console.log((document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent)
                
                fsMod.fs._createFile(
                    fsMod.fs._baseDir("home") 
                    + "/Iris/Notes/" 
                    + (document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent 
                    +  "/" + fileName,
                    "# " + fileName.split('.md')[0] + " " + '\n'
                );

                const createFileModalFolderNameRef: string = (document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent as string;

                const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll('.create-new-file');

                createFileNode.forEach((elem) => {
                    //null check
                    if(elem !== null) {
                        elem.classList.remove('is-active-create-new-file-modal');
                    }
                });

                //null check
                if(DirectoryTreeUIModals.createModalContainer !== null) {
                    DirectoryTreeUIModals.createModalContainer.remove();
                }

                //log
                console.log(fileName);

                //if document contains at least one active child
                if(document.querySelector('.is-active-child')) {
                    //select all active children and remove them from the dom (active status)
                    //this removes any existing active children files
                    document.querySelectorAll('.is-active-child').forEach(
                        (isActiveChild) => {
                            if(isActiveChild !== null) {
                                isActiveChild.classList.remove('is-active-child')
                            }
                        }
                    );
                }

                const childFile: HTMLDivElement = document.createElement('div');
                childFile.setAttribute("class", "child-file-name is-active-child");

                const childFileTextNode: Text = document.createTextNode(fileName.split('.md')[0]);

                document.querySelectorAll('.parent-folder-name').forEach((el) => {
                    //this doesn't cover duplicate folder names, so it might cause bugs
                    if(el.textContent === createFileModalFolderNameRef) {
                        childFile.appendChild(childFileTextNode);

                        (el.parentNode as ParentNode).appendChild(childFile);
                    }
                })
            
                //execute parent root listener so it understands the new file
                this.directoryTreeListeners.parentRootListener();

                //execute child node listener to allow new file to be clicked
                this.directoryTreeListeners.childNodeListener();

                //execute parent root listener again so everything will be in sync 
                this.directoryTreeListeners.parentRootListener();

                //destroy current editor view
                CMEditorView.editorView.destroy();
                            
                //create new editor view
                CMEditorView.createEditorView();

                //log
                console.log(createFileModalFolderNameRef);

                //log
                console.log(fileName);
    
                //dispatch text insertion tr
                CMEditorView.editorView.dispatch({
                    changes: {
                        from: 0,
                        to: 0,
                        insert: fsMod.fs._readFileFolder(createFileModalFolderNameRef, fileName)
                    }
                })

                //set contenteditable 
                CMEditorView.setContenteditable(true);

                //cursor theme
                if(Settings.parseThemeSettings().lightTheme) {
                    CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) })
                } else if(Settings.parseThemeSettings().darkTheme) {
                    CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]) })
                }

                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "";

                //invoke auto save listener
                this.editorListeners.autoSaveListener("codemirror");

                //invoke insert tab listener
                //this.editorListeners.insertTabListener((document.querySelector('.ProseMirror') as HTMLElement), 2);

                //assign references to corresponding key properties
                RefsNs.currentParentChildData.map((props) => {
                    //log
                    console.log(fileName);
                    //log
                    console.log(document.querySelector('.child-file-name.is-active-child') as HTMLElement);
                    
                    //null check
                    if(props !== null) {
                        //child file name
                        props.childFileName = fileName.split('.md')[0];
                        props.childFileNode = document.querySelector('.child-file-name.is-active-child') as HTMLElement
                    }
                });

                //apply active state listener 
                this.dirTreeStateListeners.activeChildFileStateListener();

                //word count listener
                wordCountListener("codemirror");

                //kebab dropdown menu listener
                this.editorkebabDropdownMenuListeners.kebabDropdownMenuListener();

                //change document title so it corresponds to the opened file
                await setWindowTitle("Iris", true, createFileModalFolderNameRef + " - " + fileName.split('.md')[0]).catch((e) => { throw console.error(e) });

                //add directory info to editor top bar
                this.editorTopBarContainer.directoryInfo();

                //to-do: sort files...
            }
        })
    }
    
    /**
     * Create file listener
     */
    public createFileListener(): void {
        const createFileNode: NodeListOf<Element> = document.querySelectorAll('.create-new-file');

        this.parentTags = document.querySelectorAll('.parent-of-root-folder');
        this.parentNameTags = document.querySelectorAll('.parent-folder-name');

        for(let i = 0; i < this.parentNameTags.length; i++) {
            //when a parent name tag is clicked 
            this.parentNameTags[i].addEventListener('click', () => {
                //check if parent tag contains is-active-parent class
                if(this.parentTags[i].classList.contains('is-active-parent')) {
                    //toggle show-create-file class on create-new-file node
                    createFileNode[i].classList.toggle('show-create-file');

                    //when a create-new-file node is clicked
                    createFileNode[i].addEventListener('click', (e) => {
                        //need stopImmediatePropagation so parentNameTag listener doesn't conflict with the createFileNode listener
                        e.stopImmediatePropagation();

                        if(createFileNode[i].classList.contains('show-create-file')) {
                            //invoke create file modal
                            this.createFileModal();

                            //invoke the exit listener for the create file modal
                            this.createFileModalExitListener();

                            //map over parent child data props
                            RefsNs.currentParentChildData.map((props) => {
                                //null check
                                if(props !== null) {
                                    //override current parent folder name ref
                                    props.parentFolderName = this.parentNameTags[i].textContent as string;
                                    props.parentFolderNode = this.parentTags[i]
                                    
                                    //invoke createFileModalCurrentFolderNode
                                    this.createFileModalCurrentFolderNode(props.parentFolderName);

                                    //log
                                    //console.log(props.parentFolderName);
                                    //log
                                    //console.log(props.parentFolderNode);
                                }
                            });

                            //invoke createFileModalNewFileNameNode 
                            this.createFileModalNewFileNameNode();

                            //invoke createFileModalContinueListener
                            this.createFileModalContinueListener((document.querySelector('#create-file-modal-new-file-name-input-node') as HTMLElement));

                            const parentRoot: NodeListOf<Element> = document.querySelectorAll('.parent-of-root-folder');

                            //invoke folder file count
                            this.folderFileCountObject.folderFileCount(parentRoot[i], this.directoryTreeListeners.parentNameTagsArr()[i], true);

                        } else if(!createFileNode[i].classList.contains('show-create-file')) {
                            createFileNode[i].classList.remove('show-create-file');        
                        }
                    });
                } else if(!this.parentTags[i].classList.contains('is-active-parent')) {
                    createFileNode[i].classList.remove('show-create-file');
                }
            });
        }
    }

    /**
     * Create folder continue listener
     * 
     * @param el Element to attach the `keyup` event listener to
     */
    public createFolderContinueListener(el: HTMLElement): void {
        let folderName: string = "";

        el.addEventListener('keyup', (e) => {
            folderName = ((e.target as HTMLInputElement).value).trim();
            console.log(folderName);
        });

        //console.log(folderName);

        let parentFolder: HTMLDivElement = {} as HTMLDivElement;
        
        DirectoryTreeUIModals.createModalContinueButton.addEventListener('click', () => {
            //log
            console.log(folderName);
            
            if(folderName !== " ") {
                //create directory
                fsMod.fs._createDir(
                    fsMod.fs._baseDir("home")
                    + "/Iris/Notes/"
                    + folderName
                );
            }

            parentFolder = document.createElement('div');
            parentFolder.setAttribute("class", "parent-of-root-folder is-not-active-parent");
            (document.getElementById('file-directory-tree-container-inner') as HTMLElement).appendChild(parentFolder);
                    
            const parentFolderName: HTMLDivElement = document.createElement('div');
            parentFolderName.setAttribute("class", "parent-folder-name");
            parentFolder.appendChild(parentFolderName);
                    
            const parentFolderTextNode: Text = document.createTextNode(folderName);
            parentFolderName.appendChild(parentFolderTextNode);
                    
            const parentFolderCaret: HTMLDivElement = document.createElement('div');
            parentFolderCaret.setAttribute("class", "parent-folder-caret");
                
            const parentFolderCaretTextNode: Text = document.createTextNode(String.fromCharCode(94));
            parentFolderCaret.appendChild(parentFolderCaretTextNode);
            parentFolder.appendChild(parentFolderCaret);

            const parentRoot: NodeListOf<Element> = document.querySelectorAll('.parent-of-root-folder');

            for(let i = 0; i < parentRoot.length; i++) {
                //invoke folder file count
                this.folderFileCountObject.folderFileCount(parentRoot[i], this.directoryTreeListeners.parentNameTagsArr()[i], true);
            }

            //invoke parent root listener (created directory only)
            this.directoryTreeListeners.parentRootListener();
    
            //invoke create file node
            this.createFileNode(parentFolder);
    
            //invoke create file listener
            this.createFileListener();

            //null check
            if(DirectoryTreeUIModals.createModalContainer !== null) {
                DirectoryTreeUIModals.createModalContainer.remove();
            }
                
            //invoke create file listener 
            //bug
            this.createFileListener();
            this.createFileListener();
                
            //invoke parent root listener again so entire directory tree will function normally and be in sync 
            //bug
            this.directoryTreeListeners.parentRootListener();
            this.directoryTreeListeners.parentRootListener();
        })
    }

    /**
     * Create folder modal exit listener
     */
    public createFolderModalExitListener(): void {
        DirectoryTreeUIModals.createModalExitButton.addEventListener('click', () => {
            //log 
            console.log("Clicked on exit button");

            if((document.getElementById('create-modal-container') as HTMLElement) !== null) {
                (document.getElementById('create-modal-container') as HTMLElement).remove();
            }

            //mode check
            if(isModeBasic()) {
                //invoke parent root listener 
                this.directoryTreeListeners.parentRootListener();
    
                //invoke create file listener
                this.createFileListener();
            }
        })
    }

    /**
     * Create folder listener
     */
    public createFolderListener(): void {
        (document.getElementById('create-folder') as HTMLElement).addEventListener('click', (e) => {
            e.stopImmediatePropagation();

            //log
            console.log("clicked create folder");

            //invoke create folder modal
            this.createFolderModal();

            //invoke create modal exit listener
            this.createFolderModalExitListener();

            //mode check
            if(isModeBasic()) {
                //invoke create folder continue listener
                this.createFolderContinueListener((document.getElementById('create-folder-input-node') as HTMLElement));
            }
        })
    }
}
