import { App } from '../../app'
import { fsMod } from '../utils/alias'
import { isModeBasic } from '../utils/is'
import { isFolderNode } from '../utils/is'

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DirectoryRefNs {
    //eslint-disable-next-line prefer-const
    export let basicRef: string = "";

    //eslint-disable-next-line prefer-const
    export let advancedRef: string = "";
}

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

export class DirectoryTreeUIElements {
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

        const createFileTextNodeContainer: HTMLDivElement = document.createElement('div');
        createFileTextNodeContainer.setAttribute("class", "create-new-file-text-node-inner-container");
        createFileNode.appendChild(createFileTextNodeContainer);

        //create file text node
        const createFileTextNode: Text = document.createTextNode("+");
        createFileTextNodeContainer.appendChild(createFileTextNode);
    }
    
    /**
     * Create folder node 
     */
    public createFolderNode(): void { 
        //create folder node
        const createFolderNode: HTMLDivElement = document.createElement('div');
        createFolderNode.setAttribute("id", "create-folder");
        (document.getElementById('file-directory-tree-container') as HTMLDivElement).appendChild(createFolderNode);

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
        (document.getElementById('file-directory-tree-container') as HTMLDivElement).appendChild(settingsNode);

        const settingsTextNode: Text = document.createTextNode("Settings");
        settingsNode.appendChild(settingsTextNode);

        //const svg: string = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></g></svg>';

        //const rangeContextFragement = new Range().createContextualFragment(svg);

        //settingsNode.appendChild(rangeContextFragement);
    }
}

export class DirectoryTree extends DirectoryTreeUIElements {
    /**
     * Contains value of `getRootNames` function (basic)
     * 
     * @protected 
     * @readonly
     */
    protected readonly folderNamesBasic: string[] | null = this.getRootNames();

    /**
     * Get root names 
     * 
     * @returns Filtered names of folders from root
     */
    public getRootNames(): string[] | null {
        const nameVec: string[] = [];
        
        //mode check
        if(isModeBasic()) {
            //get folder names from root
            fsMod.fs._getNameVec(fsMod.fs._baseDir("home") + "/Iris/" + "Basic").map((elem) => nameVec.push(elem));

            //assign basic ref 
            DirectoryRefNs.basicRef = "Basic";
        }

        //check platform before returning nameVec
        return window.electron.process.platform === 'darwin' 
            ? nameVec.slice(1) 
            : window.electron.process.platform === 'linux' || window.electron.process.platform === 'win32' 
            ? nameVec 
            : null
    }

    /**
     * Create directory tree parent nodes
     */
    public createDirTreeParentNodes(): void {  
        if(isModeBasic()) {
            (this.folderNamesBasic as string[]).map((elem) => {
                if(isFolderNode("home", "/Iris/" + DirectoryRefNs.basicRef + "/" + elem)) {
                    //create parent folder node
                    const parentFolder: HTMLDivElement = document.createElement('div');
                    parentFolder.setAttribute("class", "parent-of-root-folder is-not-active-parent");
                    FileDirectoryTreeNode.fileDirectoryNodeInner.appendChild(parentFolder);
    
                    const parentFolderName: HTMLDivElement = document.createElement('div');
                    parentFolderName.setAttribute("class", "parent-folder-name");
                    parentFolder.appendChild(parentFolderName);
    
                    //create text node based on directory name
                    const parentFolderTextNode: Text = document.createTextNode(elem);
                    parentFolderName.appendChild(parentFolderTextNode);
    
                    const parentFolderCaret: HTMLDivElement = document.createElement('div');
                    parentFolderCaret.setAttribute("class", "parent-folder-caret");
    
                    //create text node with caret (use ascii value)
                    const parentFolderCaretTextNode: Text = document.createTextNode(String.fromCharCode(94));
                    parentFolderCaret.appendChild(parentFolderCaretTextNode);
                    parentFolder.appendChild(parentFolderCaret);
    
                    //temp
                    this.createFileNode(parentFolder);
                } else if(!isFolderNode("home", "/Iris/" + DirectoryRefNs.basicRef + "/" + elem)) {
                      //create parent folder node
                      const childFileRoot: HTMLDivElement = document.createElement('div');
        
                      childFileRoot.setAttribute("class", "child-file-name");
                      FileDirectoryTreeNode.fileDirectoryNode.appendChild(childFileRoot);
    
                      //create text node based on directory name
                      const parentFolderTextNode: Text = document.createTextNode(elem);
                      childFileRoot.appendChild(parentFolderTextNode);
                }
            });
        }
    }

    /**
     * Create directory tree child nodes
     * 
     * @protected
     * @param parentTags The parent tag to append to
     * @param parentNameTags The parent name tag
     */
    protected createDirTreeChildNodes(
        parentTags: Element, 
        parentNameTags: string,
        base: string
    ): void {
        let walkRef: string[] = [];

        //mode check
        if(isModeBasic()) {
            //platform check 
            if(window.electron.process.platform === 'darwin') {
                //walk directory recursively
                walkRef = fsMod.fs._walk(fsMod.fs._baseDir(base) + "/Iris/" + DirectoryRefNs.basicRef + "/" + parentNameTags);

                //temp check length 
                //console.log(walkRef.slice(1).length);
            } else if(window.electron.process.platform === 'linux' || window.electron.process.platform === 'win32') {
                walkRef = fsMod.fs._walk(fsMod.fs._baseDir(base) + "/Iris/" + DirectoryRefNs.basicRef + "/" + parentNameTags);
            } else {
                throw console.error("Cannot walk directory files on unsupported platform");
            }
        }

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
                
                //create text node with only file names 
                const childFileTextNode: Text = document.createTextNode(namesArr[i].split('.md')[0]);
                childFile.appendChild(childFileTextNode);
                
                //append to passed parent node
                parentTags.appendChild(childFile);
            }
        }
    }

    /**
     * Parent name tags array
     * 
     * @returns An array of strings with parent name tag nodes
     */
        public parentNameTagsArr(): string[] {    
            const parentNameTagsArr: string[] = [];
    
            document.querySelectorAll('.parent-folder-name').forEach(
                (elem) => {
                    if(elem !== null) {
                        parentNameTagsArr.push(elem.textContent as string);
                    }
                }
            );
    
            return parentNameTagsArr;
        }
}
