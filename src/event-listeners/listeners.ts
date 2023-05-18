import { DirectoryTree } from "../file-directory-tree/file-directory"
import { readFile, readFileRoot, readFileFolder } from "../utils/file-system/fs"
import { MilkdownEditor } from "../milkdown/milkdown-editor"

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
        (document.querySelector('#file-directory-tree-container') as HTMLDivElement).addEventListener("click", (e) => {
            //must use event delegation to handle events on dynamically created nodes or else it gets executed too early!
            const target = (e.target as Element).closest("#file-directory-tree-container");
          
            if(target) {
                for(let i = 0; i < this.getParentTags.length; i++) {
                    //console.log(getParentTags[i]);
                    this.getParentNameTags[i].addEventListener('click', (e) => { 
                        //need to use stopImmediatePropagation on event handler so child nodes can be removed from the dom
                        e.stopImmediatePropagation();

                        //console.log(e);
                        
                        this.getParentTags[i].classList.toggle('is-active-parent');

                        if(this.getParentTags[i].classList.contains('is-active-parent')) {
                            this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");
                        } else if(!this.getParentTags[i].classList.contains('is-active-parent')) {
                            this.getParentTags[i].querySelectorAll('.child-file-name').forEach((v) => v.remove());
                        }
                    });
                }
            }

            //call child node listener once parent listener finishes execution
            this.childNodeListener();
          });
    }

    /**
     * Child node listener
     */
    public childNodeListener() {
        document.querySelectorAll('.child-file-name').forEach(
            (childFileName) => childFileName.addEventListener('click', (e) => {
                e.stopImmediatePropagation();

                //MilkdownEditor.createEditor();

                //need to deal with the state of active files
                //only allowing one file to be active at a time

                childFileName.classList.toggle('is-active-child');

                //console.log(e);

                for(let i = 0; i < this.getParentTags.length; i++) {
                    if(this.getParentTags[i].contains(childFileName)/* && !getParentNameTags[i].classList.contains('child-active-in-folder') */) {
                            //read file
                            readFileFolder(this.getParentNameTags[i].textContent, childFileName.textContent).then(
                                (fileContent) => {
                                    console.log(fileContent);
                                }
                            );

                        //childFileName.classList.add('is-active-child');
                        //getParentNameTags[i].classList.add("child-active-in-folder");
                    }
                }
        }));
    }
}