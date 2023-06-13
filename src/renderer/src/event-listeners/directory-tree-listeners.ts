import { fsMod }  from "../utils/alias"
import { DirectoryTree } from "../file-directory-tree/file-directory"
import { DirectoryTreeUIModals } from "../file-directory-tree/file-directory"
import { setWindowTitle } from "../window/window-title"
import { 
    IDirectoryTreeUIModalListeners, 
    IDirectoryTreeListeners
} from "../interfaces/listener-interfaces"
import { DirectoryRefNs } from "../file-directory-tree/file-directory"
import { defaultMarkdownParser } from "prosemirror-markdown"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { PMEditorState } from "../prosemirror/editor/editor-state"
import { EditorListeners } from "./editor-listeners"
import { DirectoryTreeStateListeners } from "./file-directory-state-listener"
import { EditorNs } from "../../editor-main"
import { wordCountListener } from "./word-count-listener"
import { isModeBasic } from "../utils/is"

//eslint-disable-next-line @typescript-eslint/no-namespace
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
        parentFolderName: T,
        childFileName: T,
        parentFolderNode: K,
        parentFolderNameNode: K,
        childFileNode: K
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
            childFileNode: {} as Element
        }
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
     * Parent name tags array
     * 
     * @private
     * @returns An array of strings with parent name tag nodes
     */
    private parentNameTagsArr(): string[] {    
        const parentNameTagsArr: string[] = [];

        Array.from(this.getParentNameTags).forEach(
            (elem) => {
                if(elem !== null) {
                    parentNameTagsArr.push(elem.textContent as string);
                }
            }
        );

        return parentNameTagsArr;
    }

    /**
     * Parent root listener 
     * 
     * @param type The mode type
     */
    public parentRootListener(type: string): void {
        this.getParentTags = document.querySelectorAll('.parent-of-root-folder');
        this.getParentNameTags = document.querySelectorAll('.parent-folder-name');

        if(this.getParentTags !== null && this.getParentNameTags !== null) {
            for(let i = 0; i < this.getParentTags.length; i++) {
                this.getParentNameTags[i].addEventListener('click', () => {          
                    //toggle is-active-parent class on parent tag               
                    this.getParentTags[i].classList.toggle('is-active-parent');
                    
                    //toggle is-active-folder class on parent name tag
                    this.getParentNameTags[i].classList.toggle('is-active-folder');

                    //check if parent tag contains is-active-parent class
                    if(this.getParentTags[i].classList.contains('is-active-parent')) {
                        //
                        if(type === "Basic" && isModeBasic()) {
                            this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home", type);
                        }

                        document.querySelectorAll('.parent-folder-caret')[i].classList.toggle('is-active-parent-folder');

                        //remove is-not-active-parent class 
                        this.getParentTags[i].classList.remove('is-not-active-parent');

                        //call child node listener when parent is active 
                        this.childNodeListener();

                    //console.log(this.getParentTags[i].querySelectorAll('.child-file-name').length);
                    //if parent tag doesn't contain is-active-parent class
                    } else if(!this.getParentTags[i].classList.contains('is-active-parent')) {
                        //remove all child files
                        this.getParentTags[i].querySelectorAll('.child-file-name').forEach(
                            (elem) => {
                                if(elem !== null) {
                                    elem.remove();
                                }
                            }
                        );

                        //remove is-active-parent-folder class
                        this.getParentTags[i].querySelectorAll('.parent-folder-caret').forEach(
                            (elem) => { 
                                if(elem !== null) {
                                    elem.classList.remove('is-active-parent-folder');
                                }
                            }
                        );

                        //add is-not-active-parent
                        this.getParentTags[i].classList.add('is-not-active-parent');
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
        document.querySelectorAll('.is-active-parent').forEach((isActiveParent) => {
            const childFileName: NodeListOf<Element> = isActiveParent.querySelectorAll('.child-file-name');

            //for all child file names
            for(let i = 0; i < childFileName.length; i++) {
                childFileName[i].addEventListener('click', async () => {
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
                    
                    //for all clicked children files, add 'is-active-child' class
                    childFileName[i].classList.add('is-active-child');

                    for(let j = 0; j < this.getParentTags.length, j < this.getParentNameTags.length; j++) {
                        if(this.getParentTags[j].contains(childFileName[i]) && childFileName[i].classList.contains('is-active-child')) {
                            //log parent folder
                            //console.log(this.getParentNameTags[j].textContent);
                            //log child file that corresponds to parent folder
                            //console.log(childFileName[i].textContent);

                            const t0: number = performance.now(); //start perf timer

                            //destroy current editor view
                            PMEditorView.editorView.destroy();
                            
                            //create new editor view
                            PMEditorView.createEditorView();
                            
                            //update editor view state
                            PMEditorView.editorView.updateState(
                                //apply transaction
                                PMEditorView.editorView.state.apply(
                                    //since editor gets destroyed and re-created, the 
                                    //range is 0 to 0 
                                    PMEditorState.editorState.tr.replaceRangeWith(
                                        0, 
                                        0,
                                        //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        defaultMarkdownParser.parse(
                                        fsMod.fs._readFileFolder(this.getParentNameTags[j].textContent as string, 
                                        (childFileName[i].textContent as string) + ".md", 
                                        DirectoryRefNs.basicRef
                                    )
                                )!
                            )));

                            const t1: number = performance.now(); //end perf timer
                            
                            //log perf timer
                            console.log("Editor destroy, create, and replace in total took " + (t1 - t0) + "ms!");

                            //set contenteditable 
                            PMEditorView.setContenteditable(true);
                            
                            //if contenteditable attribute is set to true 
                            if((document.querySelector('.ProseMirror') as HTMLElement).getAttribute('contenteditable') === 'true') {
                                //show the menubar
                                (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "";
                            }

                            //invoke auto save listener (Basic)
                            this.editorListeners.autoSaveListener("Basic");

                            //null check
                            if(this.parentTagNodeRef !== null && this.parentNameTagRef !== null && this.childFileNameRef !== null && this.childFileNodeRef !== null) {
                                //assign child refs
                                this.childFileNameRef = childFileName[i].textContent as string;
                                this.childFileNodeRef = childFileName[i];

                                if(this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                    //assign parent refs
                                    this.parentNameTagRef = this.getParentNameTags[j].textContent as string;
                                    this.parentNameTagNodeRef = this.getParentNameTags[j];
                                    this.parentTagNodeRef = this.getParentTags[j];
                                } else if(!this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                    continue;
                                }

                                //assign references to corresponding key properties
                                RefsNs.currentParentChildData.map((props) => {
                                    //null check
                                    if(props !== null) {
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
                                })
                            }
                            
                            //apply active state listener 
                            this.dirTreeStateListeners.activeChildFileStateListener();

                            wordCountListener("prosemirror");
                        } else if(!this.getParentTags[j].contains(childFileName[i]) && !childFileName[i].classList.contains('is-active-child')) {
                            continue;
                        }
                    }
                    
                    //change document title so it corresponds to the opened file
                    await setWindowTitle("Iris", true, this.parentNameTagRef + " - " + (childFileName[i].textContent)).catch((e) => { throw console.error(e) });

                    //add directory info to editor top bar
                    this.editorTopBarContainer.directoryInfo();
                });
            }
        });
    }
}

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
     * Create file modal exit listener
     */
    public createFileModalExitListener(): void {
        DirectoryTreeUIModals.createFileModalExitButton.addEventListener('click', () => {
            const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll('.create-new-file');

            createFileNode.forEach((elem) => {
                //null check
                if(elem !== null) {
                    elem.classList.remove('is-active-create-new-file-modal');
                }
            });

            //null check
            if(DirectoryTreeUIModals.createFileModalContainer !== null) {
                DirectoryTreeUIModals.createFileModalContainer.remove();
            }
        })
    }

    /**
     * Create file modal continue listener 
     * 
     * @param el Element to attach `keyup` event listener to
     */
    public createFileModalContinueListener(el: HTMLElement, type: string): void {
        let fileName: string = "";

        el.addEventListener('keyup',(e) => {
            //assign current value of input element on keyup + extension
            fileName = (e.target as HTMLInputElement).value + ".md";
        })

        //console.log(fileName);

        DirectoryTreeUIModals.createFileModalContinueButton.addEventListener('click', () => {
            //basic mode check
            if(type === "Basic" && isModeBasic()) {
                //log
                console.log((document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent)
                
                fsMod.fs._createFile(
                    fsMod.fs._baseDir("home") 
                    + "/Iris/Basic/" 
                    + (document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent 
                    +  "/" + fileName
                )

                const createFileModalFolderNameRef: string = (document.querySelector('#create-file-modal-folder-name-input-node') as HTMLElement).textContent as string;

                const createFileNode: NodeListOf<HTMLElement> = document.querySelectorAll('.create-new-file');

                createFileNode.forEach((elem) => {
                    //null check
                    if(elem !== null) {
                        elem.classList.remove('is-active-create-new-file-modal');
                    }
                });

                //null check
                if(DirectoryTreeUIModals.createFileModalContainer !== null) {
                    DirectoryTreeUIModals.createFileModalContainer.remove();
                }

                //log
                console.log(fileName);

                const childFile: HTMLDivElement = document.createElement('div');
                childFile.setAttribute("class", "child-file-name");

                const childFileTextNode: Text = document.createTextNode(fileName.split('.md')[0]);

                document.querySelectorAll('.parent-folder-name').forEach((el) => {
                    //this doesn't cover duplicate folder names, so it might cause bugs
                    if(el.textContent === createFileModalFolderNameRef) {
                        childFile.appendChild(childFileTextNode);

                        (el.parentNode as ParentNode).appendChild(childFile);
                    }
                })
            
                //execute parent root listener so it understands the new file
                this.directoryTreeListeners.parentRootListener("Basic");

                //execute child node listener to allow new file to be clicked
                this.directoryTreeListeners.childNodeListener();

                //execute parent root listener again so everything will be in sync 
                this.directoryTreeListeners.parentRootListener("Basic");

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

                                    //invoke createFileModalCurrentFolderNode
                                    this.createFileModalCurrentFolderNode(props.parentFolderName);

                                    //log
                                    //console.log(props.parentFolderName);
                                    //log
                                    //console.log(props.parentFolderNode);

                                    //add event listener for continue....
                                }
                            });

                            //invoke createFileModalNewFileNameNode 
                            this.createFileModalNewFileNameNode();

                            //invoke createFileModalContinueListener
                            this.createFileModalContinueListener(
                                (document.querySelector('#create-file-modal-new-file-name-input-node') as HTMLElement),
                                "Basic"
                            );
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
}

