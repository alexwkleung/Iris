import { App } from '../app'
import { /*isFile,*/ isDirectory, /*isDirectoryCanonical,*/ /*isFileCanonical*/ } from '../utils/file-system/is.js'
import { walk } from '../utils/file-system/walkdir.js'
import { getName, getDirectoryName, getNameVec } from '../utils/file-system/file.js'
//import { getCanonicalPath } from './get-canonical-path.js'
import { baseDir } from '../utils/file-system/base-dir.js'


export class FileDirectoryTreeNode {
    /**
     * File directory tree node 
     * 
     * Reference variable for file directory node
     */
    public static fileDirectoryNode: HTMLDivElement;

    public static createFileDirectoryInit() {        
        FileDirectoryTreeNode.fileDirectoryNode = document.createElement('div');
        FileDirectoryTreeNode.fileDirectoryNode.setAttribute("id", "file-directory-tree-container");
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
    protected readonly folderNames: Promise<string[]> = this.getRootNames();

    public async getRootNames(): Promise<string[]> {
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        let walkRef: string[] = [];

        //walk directory recursively
        await walk(await baseDir("home").then((v) => v) + "/Iris/Notes").then((elem) => {
            walkRef = (elem as string[]).slice(1);
            }
        ).catch((v) => { throw console.error(v) });
    
        const nameVecTemp: string[] = [];
    
        await getNameVec(await baseDir("home").then((v) => v) + "/Iris/Notes").then((vec) => {
            (vec as string[]).map((elem) => {
                nameVecTemp.push(elem);
            }
        )}).catch((e) => { throw console.error(e) });
    
        const filteredRootFolderNamesVec: string[] = nameVecTemp.filter((filter: string): boolean => {
            return [".DS_Store"].some((end) => {
                return !filter.endsWith(end);
            });
        });

        return filteredRootFolderNamesVec;
    }

    public async isFolderNode(baseDir: string, dirPropName: string): Promise<unknown> {
        return await isDirectory(baseDir, dirPropName).then(
            (v) => v
        ).catch((e) => { throw console.error(e) });
    }

    /**
     * Create directory tree parent nodes
     * 
     * @async
     */
    public async createDirTreeParentNodes(): Promise<void> {  
        this.folderNames.then((names) => {
            names.map(async (elem) => {
                await this.isFolderNode("home", "/Iris/Notes/" + elem).then(
                    async (isFolder) => {
                      if(isFolder) {
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
                        } else if(!isFolder) {
                            //create parent folder node
                            const childFileRoot: HTMLDivElement = document.createElement('div');
    
                            childFileRoot.setAttribute("class", "child-file-name");
                            FileDirectoryTreeNode.fileDirectoryNode.appendChild(childFileRoot);
    
                            //create text node based on directory name
                            const pfTextNode: Text = document.createTextNode(elem);
                            childFileRoot.appendChild(pfTextNode);
                        }
                    }
                ).catch((e) => {
                    throw console.error(e);
                });
            });
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
        await walk(
            await baseDir(base).then((v) => v) + "/Iris/Notes/" + parentNameTags
        ).catch((e) => { throw console.error(e) }).then(
            (elem) => {
                walkRef = (elem as string[]).slice(1);
            }
        ).catch((v) => { throw console.error(v) });

        const dirNamesArr: string[] = [];
        //get directory name (canonical)
        for(let i = 0; i < walkRef.length; i++) {
            await getDirectoryName(walkRef[i]).then((elem) => {
                dirNamesArr.push(elem as string);
            }).catch((e) => { throw console.error(e) });
        }
        const namesArr: string[] = [];

        //get file name (includes parent dir name) 
        for(let i = 0; i < walkRef.length; i++) {
            await getName(walkRef[i]).then((elem) => {
                namesArr.push(elem as string);
            }).catch((e) => { throw console.error(e) });
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
