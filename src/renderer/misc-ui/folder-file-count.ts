import { fsMod } from "../utils/alias";

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
    public folderFileCount(parentNameTags: Element, parentNameTagsArr: string): void {
        //check existing
        if ((document.querySelector(".folder-file-count-container") as HTMLElement) !== null) {
            (document.querySelector(".folder-file-count-container") as HTMLElement).remove();
        }

        let fileCount: number = 0;
        console.log("reset");

        //reset count to 0
        fileCount = 0;

        //folder file count container
        const folderFileCountContainer: HTMLDivElement = document.createElement("div");
        folderFileCountContainer.setAttribute("class", "folder-file-count-container");
        parentNameTags.insertBefore(folderFileCountContainer, parentNameTags.firstChild);

        if (window.electron.process.platform === "darwin") {
            fileCount = fsMod.fs
                ._walk(fsMod.fs._baseDir("home") + "/Iris/Notes" + "/" + parentNameTagsArr)
                .slice(1).length;
        } else {
            fileCount = fsMod.fs._walk(fsMod.fs._baseDir("home") + "/Iris/Notes" + "/" + parentNameTagsArr).length;
        }

        //folder file count text node
        const folderFileCountTextNode: Text = document.createTextNode(fileCount.toString());
        folderFileCountContainer.appendChild(folderFileCountTextNode);
    }
}
