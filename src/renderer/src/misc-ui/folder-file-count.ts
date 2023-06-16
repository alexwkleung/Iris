import { fsMod } from "../utils/alias"
import { DirectoryRefNs } from "../file-directory-tree/file-directory"

export class FolderFileCount {
    /**
     * Folder file count
     * 
     * You must pass the elements of `parentNameTagsArr` from the `DirectoryTree` class, 
     * which needs to be inherited in order to access 
     * 
     * @param parentNameTagsArr Elements of `parentNameTagsArr()`
     */
    public folderFileCount(parentNameTags: Element, parentNameTagsArr: string, reset: boolean): void {
        let fileCount: number = 0;

        //need to properly handle duplication inside DOM
        //even though visually it works fine, the duplication in the DOM tree can cause issues
        if(reset) {
            document.querySelectorAll('.folder-file-count-container').forEach((el) => {
                el.remove();
            });

            //reset count to 0
            fileCount = 0;  
        } else if(!reset) {
            //folder file count container
            const folderFileCountContainer: HTMLDivElement = document.createElement('div');
            folderFileCountContainer.setAttribute("class", "folder-file-count-container");
            parentNameTags.insertBefore(folderFileCountContainer, parentNameTags.firstChild);
    
            //assign length of walked folder (excluding itself) to fileCount
            fileCount = fsMod.fs._walk(fsMod.fs._baseDir("home") + "/Iris/" + DirectoryRefNs.basicRef + "/" + parentNameTagsArr).slice(1).length;
    
            //folder file count text node
            const folderFileCountTextNode: Text = document.createTextNode(fileCount.toString()); 
            folderFileCountContainer.appendChild(folderFileCountTextNode);
        }
    }
}