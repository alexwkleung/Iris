import { fsMod }  from "../utils/alias"
import { DirectoryTree } from "../file-directory-tree/file-directory"
import { MilkdownEditor } from "../milkdown/milkdown-editor"
import { replaceAll, getMarkdown } from '@milkdown/utils'

//eslint-disable-next-line @typescript-eslint/no-namespace
namespace RefsNs {
    /**
     * Generic interface for current parent child data
     * 
     * Anything that implements `ICurrentParentChildData` should default to `<string, Element>` unless other types are necessary:
     * 
     * `T` corresponds to type `string`
     * 
     * `K` corresponds to type `Element`
     */
    interface ICurrentParentChildData<T, K> {
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
    * It's a global within `listeners.ts` with strict usage so it doesn't pollute
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

export class DirectoryTreeListeners extends DirectoryTree {
    /**
     * Get parent tags
     * 
     * @private
     */
    private getParentTags: HTMLCollectionOf<Element>;

    /**
     * Get parent name tags
     * 
     * @private
     */
    private getParentNameTags: HTMLCollectionOf<Element>;

    /**
     * Parent name tag reference variable
     * 
     * @protected
     */
    protected parentNameTagRef: string;

    /**
     * Child file name reference variable
     * 
     * @protected
     */
    protected childFileNameRef: string;

    /**
     * Parent name tag node reference variable
     * 
     * @protected
     */
    protected parentTagNodeRef: Element; 

    /**
     * Child file node reference variable
     * 
     * @protected
     */
    protected childFileNodeRef: Element;

    /**
     * Parent name tags array
     * 
     * @private
     * @returns An array of strings with parent name tag nodes
     */
    private parentNameTagsArr(): string[] {    
        const parentNameTagsArr: string[] = [];

        Array.from(this.getParentNameTags).forEach(
            (elem) => parentNameTagsArr.push(elem.textContent)
        );

        return parentNameTagsArr;
    }

    /**
     * Create file listener
     */
    public createFileListener(): void {
        const parentFolderName: NodeListOf<Element> = document.querySelectorAll('.parent-folder-name');

        parentFolderName.forEach((elem) => {
            //temp testing 
            elem.addEventListener('mouseover', (/*e*/) => {
                //e.stopPropagation();
                console.log("mouse over parent folder");
            })
        })
    }

    /**
     * Parent root listener 
     */
    public parentRootListener(): void {
        this.getParentTags = document.querySelector('#file-directory-tree-container').getElementsByClassName('parent-of-root-folder');
        this.getParentNameTags = document.querySelector('#file-directory-tree-container').getElementsByClassName('parent-folder-name');

        if(this.getParentTags !== null && this.getParentNameTags !== null) {
            for(let i = 0; i < this.getParentTags.length; i++) {
                this.getParentNameTags[i].addEventListener('click', () => {                         
                    this.getParentTags[i].classList.toggle('is-active-parent');
                    this.getParentNameTags[i].classList.toggle('is-active-folder');

                    if(this.getParentTags[i].classList.contains('is-active-parent')) {
                        this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                        document.querySelectorAll('.parent-folder-caret')[i].classList.toggle('is-active-parent-folder');
                        
                        //call child node listener when parent is active 
                        this.childNodeListener();

                        //this.createFileListener();
                    } else if(!this.getParentTags[i].classList.contains('is-active-parent')) {
                        this.getParentTags[i].querySelectorAll('.child-file-name').forEach((elem) => elem.remove());
                        this.getParentTags[i].querySelectorAll('.parent-folder-caret').forEach((elem) => elem.classList.remove('is-active-parent-folder'));
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
            const childFileName: HTMLCollectionOf<Element> = isActiveParent.getElementsByClassName('child-file-name');

            //for all child file names
            for(let i = 0; i < childFileName.length; i++) {
                childFileName[i].addEventListener('click', () => {
                    //if document contains at least one active child
                    if(document.querySelector('.is-active-child')) {
                        //select all active children and remove them from the dom (active status)
                        //this removes any existing active children files
                        document.querySelectorAll('.is-active-child').forEach(
                            (isActiveChild) => isActiveChild.classList.remove('is-active-child')
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
                            MilkdownEditor.editor.action(replaceAll(fsMod.fs._readFileFolder(this.getParentNameTags[j].textContent, childFileName[i].textContent), true));      
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

                            //remove all current ranges
                            getSelection.removeAllRanges();

                            //add range based on new setStart and setEnd values
                            //the cursor will be at the beginning of the first node instead of random
                            getSelection.addRange(createRange);

                            //focus editor when file is active 
                            proseMirrorNode.focus();

                            //assign parent name tag to ref variable
                            this.parentNameTagRef = this.getParentNameTags[j].textContent;

                            //assign child file name to ref variable
                            this.childFileNameRef = childFileName[i].textContent;

                            //assign parent name tags/nodes and child file names/nodes to ref variables
                            this.parentNameTagRef = this.getParentNameTags[j].textContent;
                            this.childFileNameRef =  childFileName[i].textContent;
                            this.parentTagNodeRef = this.getParentNameTags[j];
                            this.childFileNodeRef = childFileName[i];
                        }
                    }
                    
                    //change document title so it corresponds to the opened file
                    //as a visual indicator
                    document.title = "Iris - " + childFileName[i].textContent;

                    //assign references to corresponding key properties
                    RefsNs.currentParentChildData.map((props) => {
                        //parent folder name
                        props.parentFolderName = this.parentNameTagRef;
                        //child file name
                        props.childFileName = this.childFileNameRef;
                        //parent folder node
                        props.parentFolderNode = this.parentTagNodeRef;
                        //child file node
                        props.childFileNode = this.childFileNodeRef;
                        //log
                        //console.log(props.parentFolderNode);
                        //log
                        //console.log(props.childFileNode);
                    })
                });
            }
        });
    }
}

export class EditorListeners extends DirectoryTreeListeners {
    /**
     * Auto save listener
     * 
     * @public
     */
    public autoSaveListener(): void {
        const editors = document.querySelector('.ProseMirror');

        //when a keyboard press is released
        editors.addEventListener('keyup', () => {
            RefsNs.currentParentChildData.map((props) =>  {
                //write to file
                //const t0: number = performance.now(); //start perf timer
                fsMod.fs._writeToFile(props.parentFolderName + "/" + props.childFileName, MilkdownEditor.editor.action(getMarkdown()));
                //const t1: number = performance.now(); //end perf timer
                //log perf timer
                //console.log("window.fsMod._writeToFile took " + (t1 - t0) + "ms!");
            });
        });
    }
}
