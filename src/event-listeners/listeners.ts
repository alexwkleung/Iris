import { DirectoryTree } from "../file-directory-tree/file-directory"
import { readFile, readFileRoot, readFileFolder } from "../utils/file-system/fs"

export class DirectoryTreeListeners extends DirectoryTree {
    public parentRootListener() {
        (document.querySelector('#file-directory-tree') as HTMLDivElement).addEventListener("click", (e) => {
            //must use event delegation to handle events on dynamically created nodes or else it gets executed too early!
            const target = (e.target as Element).closest("#file-directory-tree");
          
            if(target) {
                const getParentTags: HTMLCollectionOf<Element> = target.getElementsByClassName('parent-of-root-folder');
                const getParentNameTags: HTMLCollectionOf<Element> = target.getElementsByClassName('parent-folder-name');

                const parentTagsArr: string[] = [];
                Array.from(getParentTags).forEach(
                    (v) => parentTagsArr.push((v.textContent))
                );
        
                const parentNameTagsArr: string[] = [];
                Array.from(getParentNameTags).forEach(
                    (v) => parentNameTagsArr.push(v.textContent)
                );

                for(let i = 0; i < getParentTags.length; i++) {
                    //console.log(getParentTags[i]);
                    getParentNameTags[i].addEventListener('click', (e) => { 
                        //need to use stopImmediatePropagation on event handler so child nodes can be removed from the dom
                        e.stopImmediatePropagation();

                        //console.log(e);
                        
                        getParentTags[i].classList.toggle('is-active-parent');

                        if(getParentTags[i].classList.contains('is-active-parent')) {
                            this.createDirTreeChildNodes(getParentTags[i], parentNameTagsArr[i], "home");
                        } else if(!getParentTags[i].classList.contains('is-active-parent')) {
                            getParentTags[i].querySelectorAll('.child-file-name').forEach((v) => v.remove());
                        }
                    });
                }
            }

            //call child node listener once parent listener finishes execution
            this.childNodeListener();
          });
    }

    public childNodeListener() {
        document.querySelectorAll('.child-file-name').forEach(
            (v) => v.addEventListener('click', async (e) => {
                e.stopImmediatePropagation();

                //console.log(e);
                
                v.classList.toggle('is-active-child');

                //console.log("child file");
                
                console.log(v.textContent);

                //readFileFolder(v.parentElement, v.textContent).then((content) => console.log(content));
        }));
    }
}