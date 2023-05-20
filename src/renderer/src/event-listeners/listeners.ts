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
    private getParentTags: HTMLCollectionOf<Element> = document.querySelector('#file-directory-tree-container').getElementsByClassName('parent-of-root-folder');

    /**
     * Get parent name tags
     * 
     * @private
     */
    private getParentNameTags: HTMLCollectionOf<Element> = document.querySelector('#file-directory-tree-container').getElementsByClassName('parent-folder-name');
    
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
        for(let i = 0; i < this.getParentTags.length; i++) {
            //console.log(getParentTags[i]);
            this.getParentNameTags[i].addEventListener('click', () => {                         
                this.getParentTags[i].classList.toggle('is-active-parent');

                if(this.getParentTags[i].classList.contains('is-active-parent')) {
                    this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                    //call child node listener when parent is active 
                    this.childNodeListener();
                } else if(!this.getParentTags[i].classList.contains('is-active-parent')) {
                    this.getParentTags[i].querySelectorAll('.child-file-name').forEach((elem) => elem.remove());
                }
            });
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

                    //log read file 
                    //console.log(fsMod._readFileFolder(this.getParentNameTags[i].textContent, childFileName.textContent));
                    
                    //temp
                    //await MilkdownEditor.editor.create();

                    //temp insert markdown into editor
                    //MilkdownEditor.editor.action(replaceAll(fsMod._readFileFolder(this.getParentNameTags[i].textContent, childFileName.textContent)));

                    //change document title so it corresponds to the opened file
                    //as a visual indicator
                    document.title = "Iris - " + childFileName[i].textContent;
                });
            }
        });
    }
}