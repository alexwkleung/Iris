import { DirectoryTree } from "../file-directory-tree/file-directory"
import { MilkdownEditor, MilkdownEditorNode } from "../milkdown/milkdown-editor"
import { replaceAll } from '@milkdown/utils'

const fsMod = window.fsMod;

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
    
    private parentNameTagsArr(): string[] {    
        const parentNameTagsArr: string[] = [];

        Array.from(this.getParentNameTags).forEach(
            (elem) => parentNameTagsArr.push(elem.textContent)
        );

        return parentNameTagsArr;
    }

    /**
     * Parent root listener 
     */
    public parentRootListener(): void {
        this.getParentTags = document.querySelector('#file-directory-tree-container').getElementsByClassName('parent-of-root-folder');
        this.getParentNameTags = document.querySelector('#file-directory-tree-container').getElementsByClassName('parent-folder-name');

        if(this.getParentTags !== null && this.getParentNameTags !== null) {
            for(let i = 0; i < this.getParentTags.length; i++) {
                //console.log(getParentTags[i]);
                this.getParentNameTags[i].addEventListener('click', () => {                         
                    this.getParentTags[i].classList.toggle('is-active-parent');

                    if(this.getParentTags[i].classList.contains('is-active-parent')) {
                        this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                        //document.querySelector('.parent-folder-caret').classList.toggle('is-active-parent-folder');

                        document.querySelectorAll('.parent-folder-caret')[i].classList.toggle('is-active-parent-folder');
                        //call child node listener when parent is active 
                        this.childNodeListener();
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
                childFileName[i].addEventListener('click', async () => {
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

                    //console.log(document.querySelector('#editor-container'));

                    for(let j = 0; j < this.getParentTags.length, j < this.getParentNameTags.length; j++) {
                        if(this.getParentTags[j].contains(childFileName[i])) {
                            //log parent folder
                            console.log(this.getParentNameTags[j]);
                            //log child file that corresponds to parent folder
                            console.log(childFileName[i]);

                            //insert contents of clicked child file into milkdown editor
                            //use parent folder and child file names as arguments
                            MilkdownEditor.editor.action(replaceAll(fsMod._readFileFolder(this.getParentNameTags[j].textContent, childFileName[i].textContent)));      
                        }
                    }
                    
                    //change document title so it corresponds to the opened file
                    //as a visual indicator
                    document.title = "Iris - " + childFileName[i].textContent;
                });
            }
        });
    }
}