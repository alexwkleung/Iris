import { RefsNs } from "./directory-tree-listeners"

export class DirectoryTreeStateListeners {
    /**
     * Active child file state listener
     */
    public activeChildFileStateListener(): void {
        document.querySelectorAll('.parent-folder-name').forEach((el) => {
            //null check
            if(el !== null) {
                el.addEventListener('click', () => {
                    //doc title folder name
                    //trim any whitespace from the split if necessary
                    const docTitleFolderName: string = document.title.split('-')[1].trim();
    
                    const childFileName: Element[] | null = Array.from(document.getElementsByClassName('child-file-name'));
                    
                    //null check
                    if(childFileName !== null) {
                        for(let i = 0; i < childFileName.length; i++) {
                            //check if docTitleFolderName and docTitleFileName match the respective refs
                            if(docTitleFolderName === RefsNs.currentParentChildData[0].parentFolderName && childFileName[i].textContent === RefsNs.currentParentChildData[0].childFileName) {                        
                                //compare text content to make sure it's identical
                                if(childFileName[i].textContent === RefsNs.currentParentChildData[0].childFileName) {
                                    //add is-active-child class to the child file 
                                    childFileName[i].classList.add('is-active-child');
                                } else {
                                    continue;
                                }
                            }
                        }
                    }
                });
            }
        });
    }
}