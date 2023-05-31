import { fsMod }  from "../utils/alias"
import { DirectoryTree } from "../file-directory-tree/file-directory"
import { MilkdownEditor } from "../milkdown/milkdown-editor"
import { replaceAll, getMarkdown } from '@milkdown/utils'
import { DirectoryTreeUIModals } from "../file-directory-tree/file-directory"
import { setWindowTitle } from "../utils/window-title"
import { 
    IDirectoryTreeUIModalListeners, 
    IDirectoryTreeListeners, 
    IEditorListeners 
} from "../interfaces/listener-interfaces"

//eslint-disable-next-line @typescript-eslint/no-namespace
namespace RefsNs {
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
        childFileNode: K
    }

    /**
    * Current parent child data array of objects
    * 
    * References of the current parent folder and child file data can be accessed here.
    * 
    */
    export const currentParentChildData: ICurrentParentChildData<string, Element>[] = [
        {
            parentFolderName: "",
            childFileName: "",
            parentFolderNode: {} as Element,
            childFileNode: {} as Element
        }
    ];
}

export class DirectoryTreeListeners extends DirectoryTree implements IDirectoryTreeListeners {
    /**
     * Get parent tags
     * 
     * @private
     */
    private getParentTags: HTMLCollectionOf<Element> = {} as HTMLCollectionOf<Element>;

    /**
     * Get parent name tags
     * 
     * @private
     */
    private getParentNameTags: HTMLCollectionOf<Element> = {} as HTMLCollectionOf<Element>;

    /**
     * Parent name tag reference variable
     * 
     * @protected
     */
    protected parentNameTagRef: string = "";

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
     */
    public parentRootListener(): void {
        this.getParentTags = (document.querySelector('#file-directory-tree-container') as HTMLDivElement).getElementsByClassName('parent-of-root-folder');
        this.getParentNameTags = (document.querySelector('#file-directory-tree-container') as HTMLDivElement).getElementsByClassName('parent-folder-name');

        if(this.getParentTags !== null && this.getParentNameTags !== null) {
            for(let i = 0; i < this.getParentTags.length; i++) {
                this.getParentNameTags[i].addEventListener('click', () => {          
                    //toggle is-active-parent class on parent tag               
                    this.getParentTags[i].classList.toggle('is-active-parent');
                    
                    //toggle is-active-folder class on parent name tag
                    this.getParentNameTags[i].classList.toggle('is-active-folder');

                    //check if parent tag contains is-active-parent class
                    if(this.getParentTags[i].classList.contains('is-active-parent')) {
                        this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                        document.querySelectorAll('.parent-folder-caret')[i].classList.toggle('is-active-parent-folder');
                        
                        //call child node listener when parent is active 
                        this.childNodeListener();
                        //console.log(this.getParentTags[i].getElementsByClassName('child-file-name').length);
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
                    }
                    
                    //assign refs
                    if(this.parentNameTagRef !== null && this.parentTagNodeRef !== null) {            
                        this.parentNameTagRef = this.getParentNameTags[i].textContent as string;                                            
                        this.parentTagNodeRef = this.getParentNameTags[i];
                    }
                                
                    RefsNs.currentParentChildData.map((props) => {
                        //null check
                        if(props !== null) {
                            //parent folder name
                            props.parentFolderName = this.parentNameTagRef;
                                      
                            //parent folder node
                            props.parentFolderNode = this.parentTagNodeRef;
                        }
                    })
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
            const childFileName: HTMLCollectionOf<Element> = isActiveParent.getElementsByClassName('child-file-name');

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
                        if(this.getParentTags[j].contains(childFileName[i])) {
                            //log parent folder
                            //console.log(this.getParentNameTags[j].textContent);
                            //log child file that corresponds to parent folder
                            //console.log(childFileName[i].textContent);

                            //set milkdown editor readonly to true (disables readonly)
                            MilkdownEditor.readonly = true;

                            //insert contents of clicked child file into milkdown editor
                            //use parent folder and child file names as arguments
                            //note: by setting flush to true, it (somewhat) helps performance when inserting large note content
                            //since it resets the contenteditable buffer in memory

                            //const t0: number = performance.now(); //start perf timer
                            MilkdownEditor.editor.action(replaceAll(fsMod.fs._readFileFolder(this.getParentNameTags[j].textContent as string, childFileName[i].textContent as string), true));      
                            //const t1: number = performance.now(); //end perf timer
                            //log perf timer
                            //console.log("Milkdown replaceAll took " + (t1 - t0) + "ms!");

                            const proseMirrorNode = (document.querySelector('.ProseMirror') as HTMLDivElement);
                            const getSelection = window.getSelection();
                            const createRange = document.createRange();

                            //adopted from: https://stackoverflow.com/questions/2388164/set-focus-on-div-contenteditable-element

                            //set start range to the first node
                            createRange.setStart(proseMirrorNode, 0);

                            //set end range to the first node
                            createRange.setEnd(proseMirrorNode, 0);

                            if(getSelection !== null) {
                                //remove all current ranges
                                getSelection.removeAllRanges();

                                //add range based on new setStart and setEnd values
                                //the cursor will be at the beginning of the first node instead of random
                                getSelection.addRange(createRange);
                            }

                            //focus editor when file is active 
                            proseMirrorNode.focus();

                            //null check
                            if(this.parentNameTagRef !== null && this.childFileNodeRef !== null) {
                                //assign refs
                                this.childFileNameRef =  childFileName[i].textContent as string;
                                this.childFileNodeRef = childFileName[i];
                            }
                        } else if(!this.getParentTags[j].contains(childFileName[i])) {
                            continue;
                        }
                    }
                    
                    //change document title so it corresponds to the opened file
                    //as a visual indicator
                    await setWindowTitle("Iris", true, childFileName[i].textContent).catch((e) => { throw console.error(e) });

                    //assign references to corresponding key properties
                    RefsNs.currentParentChildData.map((props) => {
                        //null check
                        if(props !== null) {
                            //child file name
                            props.childFileName = this.childFileNameRef;

                            //child file node
                            props.childFileNode = this.childFileNodeRef;

                            //log
                            //console.log(props.childFileName);
                            //log
                            //console.log(props.childFileNode);
                        }
                    })
                });
            }
        });
    }
}

export class DirectoryTreeUIModalListeners extends DirectoryTreeUIModals implements IDirectoryTreeUIModalListeners {
    /**
     * Parent tags
     * 
     * @private
     */
    private parentTags: HTMLCollectionOf<Element> = {} as HTMLCollectionOf<Element>;

    /**
     * Parent name tags
     * 
     * @private
     */
    private parentNameTags: HTMLCollectionOf<Element> = {} as HTMLCollectionOf<Element>;

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
     * Create file listener
     */
    public createFileListener(): void {
        const createFileNode: NodeListOf<Element> = document.querySelectorAll('.create-new-file');

        this.parentTags = (document.querySelector('#file-directory-tree-container') as HTMLDivElement).getElementsByClassName('parent-of-root-folder');
        this. parentNameTags = (document.querySelector('#file-directory-tree-container') as HTMLDivElement).getElementsByClassName('parent-folder-name');

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

                                    this.createFileModalCurrentFolderNode(props.parentFolderName);

                                    //log
                                    //console.log(props.parentFolderName);
                                    //log
                                    //console.log(props.parentFolderNode);
                                }
                            });
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

export class EditorListeners extends DirectoryTreeListeners implements IEditorListeners {
    /**
     * Auto save listener
     * 
     * @public
     */
    public autoSaveListener(): void {
        const editors: HTMLDivElement = document.querySelector('.ProseMirror') as HTMLDivElement;

        //when a keyboard press is released
        editors.addEventListener('keyup', () => {
            RefsNs.currentParentChildData.map((props) =>  {
                //null check
                if(props !== null) {
                    //write to file
                    //const t0: number = performance.now(); //start perf timer
                    fsMod.fs._writeToFile(props.parentFolderName + "/" + props.childFileName, MilkdownEditor.editor.action(getMarkdown()));
                    //const t1: number = performance.now(); //end perf timer
                    //log perf timer
                    //console.log("window.fsMod._writeToFile took " + (t1 - t0) + "ms!");
                }
            });
        });
    }
}