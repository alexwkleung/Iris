import { App } from '../app'
import { /*isFile,*/ isDirectory, /*isDirectoryCanonical,*/ /*isFileCanonical*/ } from '../utils/file-system/is.js'
import { walk } from '../utils/file-system/walkdir.js'
import { getName, getDirectoryName, getNameVec } from '../utils/file-system/file.js'
//import { getCanonicalPath } from './get-canonical-path.js'
import { baseDir } from '../utils/file-system/base-dir.js'
import { /* bgNode, fileDirectoryNode,*/ FileDirectoryTreeNode } from './file-directory-nodes'

import '../styles/style.css'

//file directory tree background node
//FileDirectoryTreeNode.bgNode.setAttribute("id", "file-directory-bg");
//App.appNode.appendChild(FileDirectoryTreeNode.bgNode);

//file directory tree node
FileDirectoryTreeNode.fileDirectoryNode.setAttribute("id", "file-directory-tree");
App.appNode.appendChild(FileDirectoryTreeNode.fileDirectoryNode);

export class DirectoryTree {
    private readonly folderNames: Promise<string[]> = this.getFolderNames();

    public async getFolderNames() {
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
     * createDirTreeParentNodes
     * 
     * @async
     */
    public async createDirTreeParentNodes() {  
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
     * createDirTreeChildNodes
     * 
     * @async 
     * @param parentTags The parent tag to append to (based on clicked parent)
     * @param parentNameTags The parent name tag
     */
    public async createDirTreeChildNodes(
        parentTags: Element, 
        parentNameTags: string,
        base: string) {

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
