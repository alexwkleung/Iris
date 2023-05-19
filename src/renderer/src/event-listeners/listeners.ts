import { DirectoryTree } from "../file-directory-tree/file-directory"
import { MilkdownEditor, MilkdownEditorNode } from "../milkdown/milkdown-editor"

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
            (v) => parentNameTagsArr.push(v.textContent)
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
                    this.getParentTags[i].querySelectorAll('.child-file-name').forEach((v) => v.remove());
                }
            });
        }
    }

    /**
     * Child node listener
     */
    public childNodeListener(): void {
        document.querySelectorAll('.child-file-name').forEach(
            (childFileName) => childFileName.addEventListener('click', () => {
                //test
                MilkdownEditorNode.createMilkdownEditorNode();
                MilkdownEditor.createEditor();

                //need to deal with the state of active files
                //only allowing one file to be active at a time

                childFileName.classList.toggle('is-active-child');

                for(let i = 0; i < this.getParentTags.length; i++) {
                    if(this.getParentTags[i].contains(childFileName)/* && !getParentNameTags[i].classList.contains('child-active-in-folder') */) {
                        //log read file 
                        console.log(fsMod._readFileFolder(this.getParentNameTags[i].textContent, childFileName.textContent));
    
                        //childFileName.classList.add('is-active-child');
                        //getParentNameTags[i].classList.add("child-active-in-folder");
                    }
                }
        }));
    }
}