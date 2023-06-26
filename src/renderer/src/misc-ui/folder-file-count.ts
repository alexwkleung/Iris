import { fsMod } from "../utils/alias"

export class FolderFileCount {
    /**
     * Folder file count
     * 
     * You must pass the elements of `parentNameTagsArr` from the `DirectoryTree` class, 
     * which needs to be inherited in order to access 
     * 
     * @param parentNameTags Parent name tag nodes
     * @param parentNameTagsArr Elements of `parentNameTagsArr()`
     * @param reset Option to reset file count
     */
    public folderFileCount(parentNameTags: Element, parentNameTagsArr: string, reset: boolean): void {
        let fileCount: number = 0;

        if(reset) {
            console.log("reset");

            //reset count to 0
            fileCount = 0;

            //folder file count container
            const folderFileCountContainer: HTMLDivElement = document.createElement('div');
            folderFileCountContainer.setAttribute("class", "folder-file-count-container");
            parentNameTags.insertBefore(folderFileCountContainer, parentNameTags.firstChild);
    
            //assign length of walked folder (excluding itself) to fileCount
            fileCount = fsMod.fs._walk(fsMod.fs._baseDir("home") + "/Iris/Notes" + "/" + parentNameTagsArr).slice(1).length;
    
            //folder file count text node
            const folderFileCountTextNode: Text = document.createTextNode(fileCount.toString()); 
            folderFileCountContainer.appendChild(folderFileCountTextNode);
        } else if(!reset) {
            console.log("not reset");

            //folder file count container
            const folderFileCountContainer: HTMLDivElement = document.createElement('div');
            folderFileCountContainer.setAttribute("class", "folder-file-count-container");
            parentNameTags.insertBefore(folderFileCountContainer, parentNameTags.firstChild);
    
            //assign length of walked folder (excluding itself) to fileCount
            fileCount = fsMod.fs._walk(fsMod.fs._baseDir("home") + "/Iris/Notes" + "/" + parentNameTagsArr).slice(1).length;
    
            //folder file count text node
            const folderFileCountTextNode: Text = document.createTextNode(fileCount.toString()); 
            folderFileCountContainer.appendChild(folderFileCountTextNode);
        }
    }
}