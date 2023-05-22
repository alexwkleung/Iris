import { App } from '../../app'

//fsMod API alias 
const fsMod = window.fsMod;

export class FileDirectoryTreeNode {
    /**
     * File directory tree node 
     * 
     * Reference variable for file directory node
     */
    public static fileDirectoryNode: HTMLDivElement;

    public static createFileDirectoryInit(): void {        
        FileDirectoryTreeNode.fileDirectoryNode = document.createElement('div');
        FileDirectoryTreeNode.fileDirectoryNode.setAttribute("id", "file-directory-tree-container");
        //same as editor
        FileDirectoryTreeNode.fileDirectoryNode.setAttribute("aria-hidden", "true");
        App.appNode.appendChild(FileDirectoryTreeNode.fileDirectoryNode);
    }
}

export class DirectoryTree {
    /**
     * folder names
     * 
     * Calls `getRootNames` function
     * 
     * @access protected 
     * @readonly
     */
    protected readonly folderNames: string[]  = this.getRootNames();

    public getRootNames(): string[] {
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        let walkRef: string[] = [];

        //walk directory recursively
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        walkRef = fsMod._walk(fsMod._baseDir("home") + "/Iris/Notes").slice(1);

        const nameVecTemp: string[] = [];
    
        fsMod._getNameVec(fsMod._baseDir("home") + "/Iris/Notes").map((elem) => nameVecTemp.push(elem));
    
        const filteredRootFolderNamesVec: string[] = nameVecTemp.filter((filter: string): boolean => {
            return [".DS_Store"].some((end) => {
                return !filter.endsWith(end);
            });
        });

        return filteredRootFolderNamesVec;
    }

    public isFolderNode(baseDir: string, dirPropName: string): boolean {
        return fsMod._isDirectory(baseDir, dirPropName);
    }

    /**
     * Create directory tree parent nodes
     * 
     * @async
     */
    public createDirTreeParentNodes(): void {  

        this.folderNames.map((elem) => {
            if(this.isFolderNode("home", "/Iris/Notes/" + elem)) {
                //create parent folder node
                const parentFolder: HTMLDivElement = document.createElement('div');
                parentFolder.setAttribute("class", "parent-of-root-folder");
                FileDirectoryTreeNode.fileDirectoryNode.appendChild(parentFolder);

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
        base: string): Promise<void> {

        let walkRef: string[] = [];
        
        //walk directory recursively
        walkRef = fsMod._walk(fsMod._baseDir(base) + "/Iris/Notes/" + parentNameTags).slice(1);

        const dirNamesArr: string[] = [];
        //get directory name (canonical)
        for(let i = 0; i < walkRef.length; i++) {
            dirNamesArr.push(fsMod._getDirectoryName(walkRef[i]));
        }
        const namesArr: string[] = [];

        //get file name (includes parent dir name) 
        for(let i = 0; i < walkRef.length; i++) {
            namesArr.push(fsMod._getName(walkRef[i]));
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
