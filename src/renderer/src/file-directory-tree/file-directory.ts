import { App } from '../../app'
import { fsMod } from '../utils/alias'

export class FileDirectoryTreeNode {
    /**
     * File directory tree node 
     * 
     * Reference variable for file directory node
     * 
     * @static
     */
    public static fileDirectoryNode: HTMLDivElement;
    
    /**
     * File directory node inner 
     * 
     * @static
     */
    public static fileDirectoryNodeInner: HTMLDivElement;

    /**
     * Create file directory init 
     * 
     * @static
     */
    public static createFileDirectoryInit(): void {        
        FileDirectoryTreeNode.fileDirectoryNode = document.createElement('div');
        FileDirectoryTreeNode.fileDirectoryNode.setAttribute("id", "file-directory-tree-container");
        //same as editor
        FileDirectoryTreeNode.fileDirectoryNode.setAttribute("aria-hidden", "true");
        App.appNode.appendChild(FileDirectoryTreeNode.fileDirectoryNode);

        FileDirectoryTreeNode.fileDirectoryNodeInner = document.createElement('div');
        FileDirectoryTreeNode.fileDirectoryNodeInner.setAttribute("id", "file-directory-tree-container-inner");
        FileDirectoryTreeNode.fileDirectoryNode.appendChild(FileDirectoryTreeNode.fileDirectoryNodeInner);
    }
}

class DirectoryTreeUIElements {
    /**
     * Create file node 
     * 
     * @param parentFolder Parent folder node to append to
     */
    public createFileNode(parentFolder: HTMLElement): void {
        //create file node
        const createFileNode: HTMLDivElement = document.createElement('div');
        createFileNode.setAttribute("class", "create-new-file");
        parentFolder.appendChild(createFileNode);

        //create file text node
        const createFileTextNode: Text = document.createTextNode("+");
        createFileNode.appendChild(createFileTextNode);
    }
    
    /**
     * Create folder node 
     */
    public createFolderNode(): void { 
        //create folder node
        const createFolderNode: HTMLDivElement = document.createElement('div');
        createFolderNode.setAttribute("id", "create-folder");
        (document.querySelector('#file-directory-tree-container') as HTMLDivElement).appendChild(createFolderNode);

        //create folder text node
        const createFolderTextNode: Text = document.createTextNode("Create Folder");
        createFolderNode.appendChild(createFolderTextNode);
    }

    /**
     * Settings node
     */
    public settingsNode(): void {
        const settingsNode: HTMLDivElement = document.createElement('div');
        settingsNode.setAttribute("id", "settings-node");
        (document.querySelector('#file-directory-tree-container') as HTMLDivElement).appendChild(settingsNode);

        const settingsTextNode: Text = document.createTextNode("Settings");
        settingsNode.appendChild(settingsTextNode);
    }
}

export class DirectoryTreeUIModals extends DirectoryTreeUIElements {
    /**
     * Create file modal container reference variable
     * 
     * @static
     */
    public static createFileModalContainer: HTMLDivElement;

    /**
     * Create file modal inner window reference variable 
     * 
     * @static
     */
    public static createFileModalInnerWindow: HTMLDivElement;

    /**
     * Create file modal exit reference variable
     * 
     * @static 
     */
    public static createFileModalExit: HTMLDivElement;

    /**
     * Create file modal
     * 
     * @protected
     */
    protected createFileModal(): void {
        //create file modal container node
        DirectoryTreeUIModals.createFileModalContainer = document.createElement('div');
        DirectoryTreeUIModals.createFileModalContainer.setAttribute("id", "create-file-modal-container");
        App.appNode.insertBefore(DirectoryTreeUIModals.createFileModalContainer, App.appNode.firstChild);

        //create file modal inner window node
        DirectoryTreeUIModals.createFileModalInnerWindow = document.createElement('div');
        DirectoryTreeUIModals.createFileModalInnerWindow.setAttribute("id", "create-file-modal-inner-window");
        DirectoryTreeUIModals.createFileModalContainer.appendChild(DirectoryTreeUIModals.createFileModalInnerWindow);

        //create file modal exit node
        DirectoryTreeUIModals.createFileModalExit = document.createElement('div');
        DirectoryTreeUIModals.createFileModalExit.setAttribute("id", "create-file-modal-exit");
        DirectoryTreeUIModals.createFileModalInnerWindow.appendChild(DirectoryTreeUIModals.createFileModalExit);

        //create file modal exit text node
        const createFileModalExitTextNode: Text = document.createTextNode("Cancel");
        DirectoryTreeUIModals.createFileModalExit.appendChild(createFileModalExitTextNode);
    }
}

export class DirectoryTree extends DirectoryTreeUIElements {
    /**
     * Contains value of `getRootNames` function
     * 
     * @protected 
     * @readonly
     */
    protected readonly folderNames: string[]  = this.getRootNames();

    /**
     * Get root names 
     * 
     * @returns Filtered names of folders from root
     */
    public getRootNames(): string[] {
        //walk directory recursively
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const walkRef: string[] = fsMod.fs._walk(fsMod.fs._baseDir("home") + "/Iris/Notes").slice(1);

        const nameVecTemp: string[] = [];
    
        fsMod.fs._getNameVec(fsMod.fs._baseDir("home") + "/Iris/Notes").map((elem) => nameVecTemp.push(elem));
    
        const filteredRootFolderNamesVec: string[] = nameVecTemp.filter((filter: string): boolean => {
            return [".DS_Store"].some((end) => {
                return !filter.endsWith(end);
            });
        });

        return filteredRootFolderNamesVec;
    }

    public isFolderNode(baseDir: string, dirPropName: string): boolean {
        return fsMod.fs._isDirectory(baseDir, dirPropName);
    }

    /**
     * Create directory tree parent nodes
     */
    public createDirTreeParentNodes(): void {  
        this.folderNames.map((elem) => {
            if(this.isFolderNode("home", "/Iris/Notes/" + elem)) {
                //create parent folder node
                const parentFolder: HTMLDivElement = document.createElement('div');
                parentFolder.setAttribute("class", "parent-of-root-folder");
                FileDirectoryTreeNode.fileDirectoryNodeInner.appendChild(parentFolder);

                const parentFolderName: HTMLDivElement = document.createElement('div');
                parentFolderName.setAttribute("class", "parent-folder-name");
                parentFolder.appendChild(parentFolderName);

                //create text node based on directory name
                const pfTextNode: Text = document.createTextNode(elem);
                parentFolderName.appendChild(pfTextNode);

                const parentFolderCaret: HTMLDivElement = document.createElement('div');
                parentFolderCaret.setAttribute("class", "parent-folder-caret");

                //create text node with caret (use ascii value)
                const parentFolderCaretTextNode: Text = document.createTextNode(String.fromCharCode(94));
                parentFolderCaret.appendChild(parentFolderCaretTextNode);
                parentFolder.appendChild(parentFolderCaret);

                //temp
                this.createFileNode(parentFolder);
            } else if(!this.isFolderNode("home", "/Iris/Notes/" + elem)) {
                  //create parent folder node
                  const childFileRoot: HTMLDivElement = document.createElement('div');
    
                  childFileRoot.setAttribute("class", "child-file-name");
                  FileDirectoryTreeNode.fileDirectoryNode.appendChild(childFileRoot);

                  //create text node based on directory name
                  const pfTextNode: Text = document.createTextNode(elem);
                  childFileRoot.appendChild(pfTextNode);
            }
        });
    }

    /**
     * Create directory tree child nodes
     * 
     * @async 
     * @param parentTags The parent tag to append to
     * @param parentNameTags The parent name tag
     */
    public async createDirTreeChildNodes(
        parentTags: Element, 
        parentNameTags: string,
        base: string
    ): Promise<void> {
        //walk directory recursively
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const walkRef: string[] = fsMod.fs._walk(fsMod.fs._baseDir(base) + "/Iris/Notes/" + parentNameTags).slice(1);

        const dirNamesArr: string[] = [];
        
        //get directory name (canonical)
        for(let i = 0; i < walkRef.length; i++) {
            dirNamesArr.push(fsMod.fs._getDirectoryName(walkRef[i]));
        }
        const namesArr: string[] = [];

        //get file name (includes parent dir name) 
        for(let i = 0; i < walkRef.length; i++) {
            namesArr.push(fsMod.fs._getName(walkRef[i]));
        }

        for(let i = 0; i < namesArr.length; i++) {
            if(namesArr[i] !== parentNameTags) {
                const childFile: HTMLDivElement = document.createElement('div');
                childFile.setAttribute("class", "child-file-name");
    
                const ctTextNode: Text = document.createTextNode(namesArr[i]);
                childFile.appendChild(ctTextNode);
                
                //append to passed parent node
                parentTags.appendChild(childFile);
            }
        }
    }
}
