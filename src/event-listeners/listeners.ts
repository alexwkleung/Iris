import { DirectoryTree } from "../file-directory-tree/file-directory"
import { readFile, readFileRoot, readFileFolder } from "../utils/file-system/fs"

export class DirectoryTreeListeners extends DirectoryTree {
    private getParentTags: HTMLCollectionOf<Element> = document.querySelector('#file-directory-tree').getElementsByClassName('parent-of-root-folder');
    private getParentNameTags: HTMLCollectionOf<Element> = document.querySelector('#file-directory-tree').getElementsByClassName('parent-folder-name');

    /*
    private parentTagsArr(): string[] {
        const parentTagsArr: string[] = [];

        Array.from(this.getParentTags).forEach(
            (v) => parentTagsArr.push((v.textContent))
        );

        return parentTagsArr;
    }
    */

    private parentNameTagsArr(): string[] {    
        const parentNameTagsArr: string[] = [];

        Array.from(this.getParentNameTags).forEach(
            (v) => parentNameTagsArr.push(v.textContent)
        );

        return parentNameTagsArr;
    }

    public parentRootListener(): void {
        (document.querySelector('#file-directory-tree') as HTMLDivElement).addEventListener("click", (e) => {
            //must use event delegation to handle events on dynamically created nodes or else it gets executed too early!
            const target = (e.target as Element).closest("#file-directory-tree");
          
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

    public childNodeListener(): void {
        document.querySelectorAll('.child-file-name').forEach(
            (childFileName) => childFileName.addEventListener('click', async (e) => {
                e.stopImmediatePropagation();

                childFileName.classList.toggle('is-active-child');

                //console.log(e);

                for(let i = 0; i < this.getParentTags.length; i++) {
                    if(this.getParentTags[i].contains(childFileName) /* && !getParentNameTags[i].classList.contains('child-active-in-folder') */) {
                        childFileName.classList.add('is-active-child');
                        //getParentNameTags[i].classList.add("child-active-in-folder");

                        //read file
                        readFileFolder(this.getParentNameTags[i].textContent, childFileName.textContent).then(
                            (fileContent) => console.log(fileContent)
                        );
                    } 
                    /*else {
                        getParentNameTags[i].classList.remove("child-active-in-folder");
                    }
                    */
                }
        }));
    }
}