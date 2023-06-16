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
    }
}

export class DirectoryTreeUIModals extends DirectoryTreeUIElements {
    /**
     * Create file modal container reference variable
     * 
     * @static
     */
    public static createModalContainer: HTMLDivElement;

    /**
     * Create file modal inner window reference variable 
     * 
     * @static
     */
    public static createModalInnerWindow: HTMLDivElement;

    /**
     * Create file modal inner window text container
     * 
     * @static
     */
    public static createFileModalInnerWindowTextContainer: HTMLDivElement;

    /**
     * Create file modal exit button reference variable
     * 
     * @static 
     */
    public static createModalExitButton: HTMLDivElement;

    /**
     * Create file modal continue button 
     * 
     * @static
     */
    public static createModalContinueButton: HTMLDivElement;

    /**
     * Create file modal exit node 
     * 
     * @private
     */
    private createModalExitNode(): void {
        //create file modal exit node
        DirectoryTreeUIModals.createModalExitButton = document.createElement('div');
        DirectoryTreeUIModals.createModalExitButton.setAttribute("id", "create-modal-exit");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(DirectoryTreeUIModals.createModalExitButton);
       
        //create file modal exit text node
        const createFileModalExitTextNode: Text = document.createTextNode("Cancel");
        DirectoryTreeUIModals.createModalExitButton.appendChild(createFileModalExitTextNode);
    }

    /**
     * Create file modal continue node
     * 
     * @private
     */
    private createModalContinueNode(): void {
        DirectoryTreeUIModals.createModalContinueButton = document.createElement('div');
        DirectoryTreeUIModals.createModalContinueButton.setAttribute("id", "create-modal-continue");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(DirectoryTreeUIModals.createModalContinueButton);

        const createFileModalContinueTextNode: Text = document.createTextNode("Continue");
        DirectoryTreeUIModals.createModalContinueButton.appendChild(createFileModalContinueTextNode);
    }

    /**
     * Create file modal current folder node
     * 
     * @param folderName Name of the current folder to create a file in
     */
    protected createFileModalCurrentFolderNode(folderName: string): void {
        //folder name node
        const folderNameNode: HTMLDivElement = document.createElement('div');
        folderNameNode.setAttribute("id", "create-file-modal-current-folder-node");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(folderNameNode);

        //folder text node
        const folderTextNode: Text = document.createTextNode("Folder: ");
        folderNameNode.appendChild(folderTextNode);

        //folder name input container node
        const folderNameInputContainerNode: HTMLDivElement = document.createElement('div');
        folderNameInputContainerNode.setAttribute("id", "create-file-modal-folder-name-input-container-node");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(folderNameInputContainerNode);

        //folder name input node
        const folderNameInputNode: HTMLInputElement = document.createElement('input');
        folderNameInputNode.setAttribute("id", "create-file-modal-folder-name-input-node");
        folderNameInputNode.setAttribute("type", "text");
        folderNameInputNode.setAttribute("readonly", "true");
        folderNameInputContainerNode.appendChild(folderNameInputNode);

        (folderNameInputNode as HTMLInputElement).value = folderName;
        (folderNameInputNode as HTMLInputElement).textContent = folderName;
    }

    protected createFileModalNewFileNameNode(): void {
        //new file name node
        const newFileNameNode: HTMLDivElement = document.createElement('div');
        newFileNameNode.setAttribute("id", "create-file-modal-new-file-name-node");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(newFileNameNode);

        //new file name text node
        const newFileNameTextNode: Text = document.createTextNode("Name: ");
        newFileNameNode.appendChild(newFileNameTextNode);

        //new file name input node container
        const newFileNameInputNodeContainer: HTMLDivElement = document.createElement('div');
        newFileNameInputNodeContainer.setAttribute("id", "create-file-modal-new-file-name-input-node-container");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(newFileNameInputNodeContainer);

        //new file name input node
        const newFileNameInputNode: HTMLInputElement = document.createElement('input');
        newFileNameInputNode.setAttribute("id", "create-file-modal-new-file-name-input-node");
        newFileNameInputNode.setAttribute("type", "text");
        newFileNameInputNode.setAttribute("placeholder", "Enter a note name");
        newFileNameInputNode.setAttribute("spellcheck", "false");
        newFileNameInputNodeContainer.appendChild(newFileNameInputNode);

        //focus the new file name input node
        newFileNameInputNode.focus();
    }

    /**
     * Create file modal
     * 
     * @protected
     */
    protected createFileModal(): void {
        //create file modal container node
        DirectoryTreeUIModals.createModalContainer = document.createElement('div');
        DirectoryTreeUIModals.createModalContainer.setAttribute("id", "create-modal-container");
        App.appNode.insertBefore(DirectoryTreeUIModals.createModalContainer, App.appNode.firstChild);

        //create file modal inner window node
        DirectoryTreeUIModals.createModalInnerWindow = document.createElement('div');
        DirectoryTreeUIModals.createModalInnerWindow.setAttribute("id", "create-modal-inner-window");
        DirectoryTreeUIModals.createModalContainer.appendChild(DirectoryTreeUIModals.createModalInnerWindow);

        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer = document.createElement('div');
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.setAttribute("id", "create-file-modal-inner-window-text-container");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(DirectoryTreeUIModals.createFileModalInnerWindowTextContainer);

        //invoke createFileModalExitNode
        this.createModalExitNode();

        //invoke createFileModalContinueNode
        this.createModalContinueNode();
    }

    protected createFolderModal(): void {
        //create modal container
        DirectoryTreeUIModals.createModalContainer = document.createElement('div');
        DirectoryTreeUIModals.createModalContainer.setAttribute("id", "create-modal-container");
        App.appNode.insertBefore(DirectoryTreeUIModals.createModalContainer, App.appNode.firstChild);

        //create modal inner window
        DirectoryTreeUIModals.createModalInnerWindow = document.createElement('div');
        DirectoryTreeUIModals.createModalInnerWindow.setAttribute("id", "create-modal-inner-window");
        DirectoryTreeUIModals.createModalContainer.appendChild(DirectoryTreeUIModals.createModalInnerWindow);

        //create folder modal inner window text container
        const createFolderModalInnerWindowTextContainer: HTMLDivElement = document.createElement('div');
        createFolderModalInnerWindowTextContainer.setAttribute("id", "create-folder-modal-inner-window-text-container");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(createFolderModalInnerWindowTextContainer);

        //create folder modal inner window text node
        const createFolderModalInnerWindowTextNode: Text = document.createTextNode("Name: ");
        createFolderModalInnerWindowTextContainer.appendChild(createFolderModalInnerWindowTextNode);

        //create folder input node container
        const createFolderInputNodeContainer: HTMLDivElement = document.createElement('div');
        createFolderInputNodeContainer.setAttribute("id", "create-folder-input-node-container");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(createFolderInputNodeContainer);

        //create folder input node
        const createFolderInputNode: HTMLInputElement = document.createElement('input');
        createFolderInputNode.setAttribute("id", "create-folder-input-node");
        createFolderInputNode.setAttribute("type", "text");
        createFolderInputNode.setAttribute("placeholder", "Enter a folder name");
        createFolderInputNode.setAttribute("spellcheck", "false");
        createFolderInputNodeContainer.appendChild(createFolderInputNode);

        //focus create folder input node
        createFolderInputNode.focus();

        //create modal exit node
        this.createModalExitNode();

        //create modal continue node
        this.createModalContinueNode();
    }
}

export class DirectoryTree extends DirectoryTreeUIElements {
    /**
     * Contains value of `getRootNames` function (basic)
     * 
     * @protected 
     * @readonly
     */
    protected readonly folderNamesBasic: string[] | null = this.getRootNames("Basic");

    /**
     * Get root names 
     * 
     * @param type The mode type
     * 
     * @returns Filtered names of folders from root
     */
    public getRootNames(type: string): string[] | null {
        const nameVec: string[] = [];
        
        if(type === "Basic" && isModeBasic()) {
            //get folder names from root
            fsMod.fs._getNameVec(fsMod.fs._baseDir("home") + "/Iris/" + type).map((elem) => nameVec.push(elem));

            //assign basic ref 
            DirectoryRefNs.basicRef = type;
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
     * 
     * @param type The mode type
     */
    protected createDirTreeParentNodes(type: string): void {  
        if(type === "Basic" && isModeBasic()) {
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
     * @param parentTags The parent tag to append to
     * @param parentNameTags The parent name tag
     * @param type The mode type
     */
    protected createDirTreeChildNodes(
        parentTags: Element, 
        parentNameTags: string,
        base: string,
        type: string
    ): void {
        let walkRef: string[] = [];

        if(type === "Basic" && isModeBasic()) {
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
     * @protected
     * @returns An array of strings with parent name tag nodes
     */
        public  parentNameTagsArr(): string[] {    
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
