import { App } from '../../app'
import { fsMod } from '../utils/alias'
import { isFolderNode } from '../utils/is'
import { Settings } from '../settings/settings'

//eslint-disable-next-line @typescript-eslint/no-namespace
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
    }

    /**
     * File directory kebab options
     */
    public fileDirectoryKebabOptionsNode(): void {
        const fileDirectoryKebabOptionLabel: HTMLLabelElement = document.createElement('label');
        fileDirectoryKebabOptionLabel.setAttribute("for", "editor-mode-select");
        fileDirectoryKebabOptionLabel.setAttribute("class", "editor-mode-label");
        fileDirectoryKebabOptionLabel.textContent = "Mode";
        (document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement).appendChild(fileDirectoryKebabOptionLabel);
        
        const fileDirectoryKebabOptionSelect: HTMLSelectElement = document.createElement('select');
        fileDirectoryKebabOptionSelect.setAttribute("name", "editor-mode");
        fileDirectoryKebabOptionSelect.setAttribute("id", "editor-mode-select");
        (document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement).appendChild(fileDirectoryKebabOptionSelect);

        //basic mode option
        const basicModeOption: HTMLOptionElement = document.createElement('option');
        basicModeOption.setAttribute("value", "basic-mode");
        basicModeOption.setAttribute("class", "basic-mode-option");
        basicModeOption.textContent = "Basic";
        (document.getElementById("editor-mode-select") as HTMLElement).appendChild(basicModeOption);

        //advanced mode option
        const advancedModeOption: HTMLOptionElement = document.createElement('option');
        advancedModeOption.setAttribute("value", "advanced-mode");
        advancedModeOption.setAttribute("class", "advanced-mode-option");
        advancedModeOption.textContent = "Advanced";
        (document.getElementById("editor-mode-select") as HTMLElement).appendChild(advancedModeOption);

        //reading mode option
        const readingModeOption: HTMLOptionElement = document.createElement('option');
        readingModeOption.setAttribute("value", "reading-mode");
        readingModeOption.setAttribute("class", "reading-mode-option");
        readingModeOption.textContent = "Reading";
        (document.getElementById("editor-mode-select") as HTMLElement).appendChild(readingModeOption);

        //if basic mode is true
        if(/*Settings.parseDotSettings().basicMode*/ Settings.getSettings.basicMode) {
            basicModeOption.setAttribute("selected", "");
        //if advanced mode is true
        } else if(/*Settings.parseDotSettings().advancedMode*/ Settings.getSettings.advancedMode)  {
            advancedModeOption.setAttribute("selected", "");
        } else if(/*Settings.parseDotSettings().readingMode*/ Settings.getSettings.readingMode) {
            readingModeOption.setAttribute("selected", "");
        }
    }

    /**
     * File directory kebab
     */
    public fileDirectoryKebabNode(): void {
        //kebab dropdown menu container node
        const kebabDropdownMenuContainerNode: HTMLDivElement = document.createElement('div');
        kebabDropdownMenuContainerNode.setAttribute("id", "file-directory-kebab-dropdown-menu-container");
        (document.getElementById('file-directory-tree-container') as HTMLElement).appendChild(kebabDropdownMenuContainerNode);
        
        for(let i = 0; i < 3; i++) {
            const kebabDropdownMenuShapeContainerNode: HTMLDivElement = document.createElement('div');
            kebabDropdownMenuShapeContainerNode.setAttribute("id", "file-directory-kebab-dropdown-shape-container");
            kebabDropdownMenuContainerNode.appendChild(kebabDropdownMenuShapeContainerNode);
        
            //kebab dropdown menu shape node
            const kebabDropdownMenuShapeNode: HTMLDivElement = document.createElement('div');
            kebabDropdownMenuShapeNode.setAttribute("class", "file-directory-kebab-dropdown-shape-node num-" + i.toString());
            kebabDropdownMenuShapeContainerNode.appendChild(kebabDropdownMenuShapeNode);    
        }
        
        //hide kebab dropdown menu container node
        kebabDropdownMenuContainerNode.style.display = "none";

        //kebab after click menu container
        const kebabAfterClickMenuContainer: HTMLDivElement = document.createElement('div');
        kebabAfterClickMenuContainer.setAttribute("id", "file-directory-kebab-after-click-menu-container");
        (document.getElementById('file-directory-tree-container') as HTMLElement).appendChild(kebabAfterClickMenuContainer);
        
        //hide kebab after click menu container
        kebabAfterClickMenuContainer.style.display = "none";

        //create file directory kebab options node
        this.fileDirectoryKebabOptionsNode();
    }
}

export class DirectoryTree extends DirectoryTreeUIElements {
    /**
     * Get root names 
     * 
     * @returns Filtered names of folders from root
     */
    public getRootNames(): string[] | null {
        const nameVec: string[] = [];
        
        //get folder names from root
        fsMod.fs._getNameVec(fsMod.fs._baseDir("home") + "/Iris/" + "Notes").map((elem) => nameVec.push(elem));

        console.log(nameVec);
        
        const nameVecMac: string[] = [];
        for(let i = 0; i < nameVec.length; i++) {
            console.log(nameVec[i]);

            //filter .DS_Store for mac user
            if(nameVec[i] !== '.DS_Store') {
                nameVecMac.push(nameVec[i]);
            }
        }

        //check platform before returning nameVec
        return window.electron.process.platform === 'darwin' 
            ? nameVecMac
            : window.electron.process.platform === 'linux' || window.electron.process.platform === 'win32' 
            ? nameVec 
            : null
    }

    /**
     * Create directory tree parent nodes
     */
    public createDirTreeParentNodes(): void {  
            (this.getRootNames() as string[]).map((elem) => {
                if(isFolderNode("home", "/Iris/Notes" + "/" + elem)) {
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
                } else if(!isFolderNode("home", "/Iris/Notes" + "/" + elem)) {
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
        //platform check 
        if(window.electron.process.platform === 'darwin') {
                //walk directory recursively
                walkRef = fsMod.fs._walk(fsMod.fs._baseDir(base) + "/Iris/Notes" + "/" + parentNameTags);
        } else if(window.electron.process.platform === 'linux' || window.electron.process.platform === 'win32') {
            walkRef = fsMod.fs._walk(fsMod.fs._baseDir(base) + "/Iris/Notes" + "/" + parentNameTags);
        } else {
            throw console.error("Cannot walk directory files on unsupported platform");
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
