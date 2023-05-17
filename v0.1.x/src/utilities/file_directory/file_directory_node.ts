import { App } from '../../app'

/**
 * @class LocalFileDirectoryNode
 * 
 * @file `file_directory_node.ts`
 */
export class LocalFileDirectoryNode {
    //passable created DOM node variables to reference later
    static fileDirectoryNodeParent: HTMLDivElement;
    static browseFolderBtn: HTMLButtonElement;
    static openFileBtn: HTMLButtonElement;
    static saveFileBtn: HTMLButtonElement;
    static fileDirectoryNode: HTMLDivElement;
    static folderContainerNode: HTMLDivElement;
    static deleteFileBtn: HTMLButtonElement;

    public LFDirectoryDiv() {
        //file directory div (parent)
        LocalFileDirectoryNode.fileDirectoryNodeParent = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNodeParent.setAttribute("id", "fileDirectoryParent");
        
        App.appNodeContainer.appendChild(LocalFileDirectoryNode.fileDirectoryNodeParent) as HTMLDivElement;

        const fileDirectoryInteractionContainer = document.createElement('div') as HTMLDivElement;
        fileDirectoryInteractionContainer.setAttribute("id", "fileDirectoryInteractionContainer");

        App.appNodeContainer.appendChild(fileDirectoryInteractionContainer);

        //browse folder button (temporary)
        LocalFileDirectoryNode.browseFolderBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.browseFolderBtn.setAttribute("id", "openFolder");
     
        //browse folder button text node (temporary)
        const FFTextNode1 = document.createTextNode("Open/Sync Folder");
        LocalFileDirectoryNode.browseFolderBtn.appendChild(FFTextNode1);

        fileDirectoryInteractionContainer.appendChild(LocalFileDirectoryNode.browseFolderBtn);

        //file directory div (child)
        LocalFileDirectoryNode.fileDirectoryNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNode.setAttribute("id", "fileDirectory");
        
        App.appNodeContainer.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;

        //folder directory container
        LocalFileDirectoryNode.folderContainerNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.folderContainerNode.setAttribute("id", "folderContainer");
                
        LocalFileDirectoryNode.fileDirectoryNode.appendChild(LocalFileDirectoryNode.folderContainerNode) as HTMLDivElement;
        
        //create file node
        const createFile = document.createElement('input') as HTMLDivElement;
        createFile.setAttribute("id", "createFileInput");
        createFile.setAttribute("type", "text");
        createFile.setAttribute("placeholder", "Create File...");
        createFile.style.display = "none";

        //create file text node
        const createFileTextNode = document.createTextNode("Create File") as Text;
        createFile.appendChild(createFileTextNode);

        fileDirectoryInteractionContainer.appendChild(createFile);

        //delete file button
        LocalFileDirectoryNode.deleteFileBtn = document.createElement('button');
        LocalFileDirectoryNode.deleteFileBtn.setAttribute("id", "deleteFileButton");

        //delete file button text node
        const deleteFileBtnTextNode = document.createTextNode("Delete File");
        LocalFileDirectoryNode.deleteFileBtn.appendChild(deleteFileBtnTextNode);
        LocalFileDirectoryNode.deleteFileBtn.style.display = "none";

        fileDirectoryInteractionContainer.appendChild(LocalFileDirectoryNode.deleteFileBtn);

        return LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
    }
}