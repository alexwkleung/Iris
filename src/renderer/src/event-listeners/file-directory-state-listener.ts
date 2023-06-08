import { RefsNs } from "./directory-tree-listeners"

export class DirectoryTreeStateListeners {
    /**
     * Apply active child file listener
     */
    public activeChildFileStateListener(): void {
        document.querySelectorAll('.parent-folder-name').forEach((el) => {
            el.addEventListener('click', () => {
                //doc title folder name
                //trim any whitespace from the split if necessary
                const docTitleFolderName: string = document.title.split('-')[1].trim();

                //doc title file name
                const docTitleFileName: string = document.title.split('-')[2].trim();

                //check if docTitleFolderName and docTitleFileName match the respective refs
                if(docTitleFolderName === RefsNs.currentParentChildData[0].parentFolderName && docTitleFileName === RefsNs.currentParentChildData[0].childFileName) {                        
                    const childFileName: Element[] = Array.from(document.getElementsByClassName('child-file-name'));

                    for(let i = 0; i < childFileName.length; i++) {
                        //compare text content to make sure it's identical
                        if(childFileName[i].textContent === RefsNs.currentParentChildData[0].childFileNode.textContent) {
                            //add is-active-child class to the child file 
                            childFileName[i].classList.add('is-active-child');
                        } else {
                            continue;
                        }
                    }
                }
            });
        });
    }
}