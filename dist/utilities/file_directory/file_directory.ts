/* 
* file: `file_directory.ts`
*
* this file creates the file directory that is beside the editor within the 
* main window in the front-end 
*
* TypeScript and/or Rust (Tauri/Native API) will be used for
* processing folders/files in the OS
*
* for now, the majority of file operations will be done through the TypeScript API and will move 
* to the Rust API later once the core structure is down
*
* at the moment, the file directory will only handle local files
*
* later on, a local/remote database implementation will be added in here in parallel 
* to the local file directory
*
* note that implementations may change over time
*
*/

import { App } from '../../app'
import { dialog, fs, path } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { e } from '@tauri-apps/api/fs-4bb77382'
import { ProseMirrorEditor } from '../../editor/editor_state/editor_state'
import { getMarkdown, replaceAll } from '@milkdown/utils'
import { FileSystemConstants } from '../constants/constants'
import { FileDirectoryBuilder } from '../dom_builder/dom_builder'
import { EvaDOMBuilderUtil } from 'eva-dom-builder-util'

//stylesheets
import '../../styles/file_directory.css'

//Local File Directory Node class
export class LocalFileDirectoryNode {
    //passable created DOM node variables to reference later
    static fileDirectoryNodeParent: HTMLDivElement;
    static browseFolderBtn: HTMLButtonElement;
    static openFileBtn: HTMLButtonElement;
    static saveFileBtn: HTMLButtonElement;
    static fileDirectoryNode: HTMLDivElement;
    static folderContainerNode: HTMLDivElement;

    public LFDirectoryDiv() {
        //file directory div (parent)
        LocalFileDirectoryNode.fileDirectoryNodeParent = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNodeParent.setAttribute("id", "fileDirectoryParent");
        
        App.appNode.appendChild(LocalFileDirectoryNode.fileDirectoryNodeParent) as HTMLDivElement;

        //browse folder button (temporary)
        LocalFileDirectoryNode.browseFolderBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.browseFolderBtn.setAttribute("id", "openFolder");
     
        //browse folder button text node (temporary)
        const FFTextNode1 = document.createTextNode("Open Folder");
     
        LocalFileDirectoryNode.browseFolderBtn.appendChild(FFTextNode1);
        LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.browseFolderBtn);

        //open file button (temporary)
        LocalFileDirectoryNode.openFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.openFileBtn.setAttribute("id", "openFile");

        const OFTextNode1 = document.createTextNode("Open File");
        LocalFileDirectoryNode.openFileBtn.appendChild(OFTextNode1);
        LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.openFileBtn);

        //save file button (temporary)
        LocalFileDirectoryNode.saveFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.saveFileBtn.setAttribute("id", "saveFile");

        const SFTextNode1 = document.createTextNode("Save File");
        LocalFileDirectoryNode.saveFileBtn.appendChild(SFTextNode1);
        LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.saveFileBtn);

        //file directory div (child)
        LocalFileDirectoryNode.fileDirectoryNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNode.setAttribute("id", "fileDirectory");
        
        App.appNode.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        //folder directory container
        LocalFileDirectoryNode.folderContainerNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.folderContainerNode.setAttribute("id", "folderContainer");
                
        LocalFileDirectoryNode.fileDirectoryNode.appendChild(LocalFileDirectoryNode.folderContainerNode) as HTMLDivElement;
                
        const folderContainer = document.querySelector('#fileDirectory') as HTMLDivElement;
        
        return fileDirectoryParent.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory extends ProseMirrorEditor {
    //FileDirectoryBuilder object
    private FileDirectoryBuilder = new FileDirectoryBuilder() as FileDirectoryBuilder;

    //string to hold data from file
    static openFileString: string = "";

    //string to hold data from file
    static saveFileString: string;

    //local folder array
    static localFolderArr: string[] = [];

    //local file array
    static localFileArr: string[] = [];

    //open folder variables
    public openFolder: string;
    public splitFolderDirectory: string[];
    public splitFolderPop1: string | null;
    public splitFolderPop2: string | null;
    public splitFolderConcat: string;

    public folderFileString: string;
    public splitFolderFile: string[];
    public splitFolderFilePop1: string | null;
    public splitFolderFilePop2: string | null;
    public splitFolderFileConcat1: string;
    public splitFolderFileConcat2: string;
    public splitFolderFileConcat3: string;

    //open file variables
    public openFile: string;
    public splitFileDirectory: string[];
    public splitFilePop1: string | null;
    public splitFilePop2: string | null;
    public splitFilePop3: string | null;
    public splitFileConcat1: string;
    public splitFileConcat2: string;

    //save file variables
    public saveFile: void;

    //private variables to assign constants
    private openFileConst: string;
    private saveFileConst: string;

    public fileArr: string[] = [];
    public fileStr: string = "";

    public listFilesRef: string = "";

    //recursively iterate over folder contents
    private OpenLFFolderRecursive(entries: e[]) {
        for(const entry of entries) {
            console.log(entry.path);
            //check type of path
            console.log(typeof entry.path);

            //push paths of folder to recArr
            LocalFileDirectory.localFolderArr.push(entry.path);

            //check if the children of opened folder path is a directory
            //...
            //return null if children of opened folder path isn't a directory
            if(entry.children) { 
                this.OpenLFFolderRecursive(entry.children);
            } else if(entry.children === false) {
                return null;
            } 
        }
    }
   
    //open folder dialog (need to work on this!!)
    public async OpenLFFolder() {
        //open folder dialog
        this.openFolder = await dialog.open({
            directory: true,
            defaultPath: await path.desktopDir() //await path.homeDir()
        }) as string;
        
        //exception handle
        if(this.openFolder) {
            const entries = await fs.readDir("Iris_Notes", {
                dir: fs.BaseDirectory.Desktop,
                recursive: true
            });

            //set recArr length to 0 to reset array
            LocalFileDirectory.localFolderArr.length = 0;

            //call recursive function
            this.OpenLFFolderRecursive(entries);

            console.log(LocalFileDirectory.localFolderArr);
            console.log(LocalFileDirectory.localFolderArr);
            console.log(this.openFolder + " ---> " + typeof this.openFolder);
        } else if(this.openFolder === null) {
            console.log("User canceled open dialog: Promise Rejected.")
        } 

        this.splitFolderDirectory = this.openFolder.split('/');
        this.splitFolderPop1 = this.splitFolderDirectory.pop() as string | null;
        this.splitFolderPop2 = this.splitFolderDirectory.pop()  as string | null;
        this.splitFolderConcat = this.splitFolderPop2 + "/" + this.splitFolderPop1 as string;

        //check if parentFolder is in the DOM
        if((document.querySelector('.parentFolder'))) {
            this.folderFileString = LocalFileDirectory.localFolderArr.toString();
            this.splitFolderFile = this.folderFileString.split(',');
            this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
            console.log(typeof this.folderFileString);
            
            //remove parentFolder from DOM if found
            (document.querySelector('.parentFolder') as ChildNode).remove();

            ProseMirrorEditor.readonly = false;

            ProseMirrorEditor.editor.destroy();
            ProseMirrorEditor.editor.create();

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder(this.splitFolderConcat, undefined)

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(LocalFileDirectory.localFolderArr);

            //logic for opening a file to the editor from an opened folder within 
            //the directory tree.
            const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByTagName('option');
            console.log(listFiles);

            for(let i = 0; i < listFiles.length; i++) {
                listFiles[i].addEventListener('click', () => {
                    ProseMirrorEditor.readonly = true;

                    ProseMirrorEditor.editor.destroy();
                    ProseMirrorEditor.editor.create();

                    this.listFilesRef = listFiles[i].textContent as string; 

                    console.log(this.listFilesRef);

                    const readText= fs.readTextFile(this.listFilesRef, {
                        dir: fs.BaseDirectory.Desktop
                    });

                    //reset
                    this.fileArr.length = 0;
                    this.fileStr = " ";

                    //resolve promise for fs readTextFile 
                    Promise.resolve(readText).then((fileData) => {
                        //resolved promise value 
                        //will be pushed into array
                        this.fileArr.push(fileData);
                        console.log(this.fileArr);

                        //iterate over array containing 
                        //file content
                        for(let fileIndex of this.fileArr) {
                            this.fileStr = fileIndex;
                        }

                        //console.log(fileStr);
                        //open file content in editor
                        ProseMirrorEditor.editor.action(replaceAll(this.fileStr, true));
                    });

                    console.log(this.fileStr);
                    console.log(this.listFilesRef);

                    //temp naming
                    const split1 = this.listFilesRef.split('/');
                    const pop1 = split1.pop() as string | null;
                    const pop2 = split1.pop() as string | null;
                    const pop3 = split1.pop() as string | null
                    const concat1 = pop3 + "/" + pop2;

                    console.log(pop1);
                    console.log(concat1);

                    appWindow.setTitle("Iris-dev-build - " + pop1 + " @ " + concat1);
                });

                await appWindow.setTitle("Iris-dev-build - " + this.splitFolderConcat);
            }  
        } else {
            this.folderFileString = LocalFileDirectory.localFolderArr.toString();
            this.splitFolderFile = this.folderFileString.split(',');
            this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
            console.log(typeof this.folderFileString);
            
            ProseMirrorEditor.readonly = false;

            ProseMirrorEditor.editor.destroy();
            ProseMirrorEditor.editor.create();

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder(this.splitFolderConcat, undefined)

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(LocalFileDirectory.localFolderArr);

            //logic for opening a file to the editor from an opened folder within 
            //the directory tree.
            const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByTagName('li');
            console.log(listFiles);

            for(let i = 0; i < listFiles.length; i++) {
                listFiles[i].addEventListener('click', () => {
                    ProseMirrorEditor.readonly = true;

                    ProseMirrorEditor.editor.destroy();
                    ProseMirrorEditor.editor.create();

                    this.listFilesRef = listFiles[i].textContent as string; 

                    console.log(this.listFilesRef);

                    const readText= fs.readTextFile(this.listFilesRef, {
                        dir: fs.BaseDirectory.Desktop
                    });

                    //reset
                    this.fileArr.length = 0;
                    this.fileStr = " "; 

                    //resolve promise for fs readTextFile 
                    Promise.resolve(readText).then((fileData) => {
                        //resolved promise value 
                        //will be pushed into array
                        this.fileArr.push(fileData);
                        console.log(this.fileArr);

                        //iterate over array containing 
                        //file content
                        for(let fileIndex of this.fileArr) {
                            this.fileStr = fileIndex;
                        }

                        //console.log(fileStr);
                        //open file content in editor
                        ProseMirrorEditor.editor.action(replaceAll(this.fileStr, true));
                    });

                    console.log(this.fileStr);
                    console.log(this.listFilesRef);

                    //temp naming
                    const split1 = this.listFilesRef.split('/');
                    const pop1 = split1.pop() as string | null;
                    const pop2 = split1.pop() as string | null;
                    const pop3 = split1.pop() as string | null
                    const concat1 = pop3 + "/" + pop2;

                    console.log(pop1);
                    console.log(concat1);

                    appWindow.setTitle("Iris-dev-build - " + pop1 + " @ " + concat1);
                });

                await appWindow.setTitle("Iris-dev-build - " + this.splitFolderConcat);
            }  
        }
    }

    //open file dialog
    public async OpenLF(): Promise<void> {
        //reset local file array
        LocalFileDirectory.localFileArr.length = 0;

        LocalFileDirectory.openFileString = " ";

        //open file dialog
        this.openFile = await dialog.open({
            filters: [{
                name: "Accepted File Types",
                extensions: ["md"],
            }], 
            recursive: true,
        }) as string;

        const readFileToArr = fs.readTextFile(this.openFile, {
            dir: fs.BaseDirectory.Desktop //|| fs.BaseDirectory.Home
        })

        //const fileDirectory = document.querySelector('#fileDirectory') as HTMLElement;
        
        //temporary directory folder title
        this.splitFileDirectory = this.openFile.split('/');
        this.splitFilePop1 = this.splitFileDirectory.pop() as string | null;
        this.splitFilePop2 = this.splitFileDirectory.pop() as string | null;
        this.splitFilePop3 = this.splitFileDirectory.pop() as string | null;
        this.splitFileConcat1 = this.splitFilePop3 + "/" + this.splitFilePop2 as string;

        this.splitFileConcat2 = this.splitFilePop3 + "/" + this.splitFilePop2;

        //check if parentFolder is in DOM
        if((document.querySelector('.parentFolder'))) {
            //remove parentFolder from DOM if found
            (document.querySelector('.parentFolder') as ChildNode).remove();

            //then

            //re-build file directory tree based on opened file
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder(this.splitFileConcat2, this.splitFilePop1);
        } else {
            //build file directory based on opened file
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder(this.splitFileConcat2, this.splitFilePop1);
        }

        console.log(EvaDOMBuilderUtil.prevParentNode);

        Promise.resolve(this.openFile).then((): void => {
            Promise.resolve(readFileToArr).then((fileData): void => {
                LocalFileDirectory.localFileArr.push(fileData);

                console.log(LocalFileDirectory.localFileArr);
            });
        });

        //exception handle 
        if(this.openFile) {
            //set openFileConst to OpenFile constant ("File Opened")
            this.openFileConst = FileSystemConstants.OpenFile;

            console.log(this.openFileConst);

            //log path to file
            console.log(this.openFile);

            //resolve promise from readTextFile to handle data
            //and push that data into fileArr array
            await Promise.resolve(readFileToArr).then((fileData) => {
                LocalFileDirectory.localFileArr.push(fileData);
            }); 

            //ensure data is passed 
            //
            //this logic must be tweaked in order to handle multiple files
            //
            for(let folderIndex of LocalFileDirectory.localFileArr) {
                LocalFileDirectory.openFileString = folderIndex;

                //console.log("INSIDE LOOP:");
                //console.log(LocalFileDirectory.openFileString);
                //break;
            }

            //console.log("OUTSIDE LOOP:")
            //console.log(LocalFileDirectory.openFileString);

            //check if editor node is present in the DOM before inserting file content
            if(document.querySelector('.milkdown')) {
                //await ProseMirrorEditor.editor.destroy();
                ProseMirrorEditor.readonly = true;
                //await ProseMirrorEditor.editor.create();

                //insert raw markdown string into editor state by replacing 
                //all its contents with the opened file string
                ProseMirrorEditor.editor.action(replaceAll(LocalFileDirectory.openFileString, true));
            } else {
                ProseMirrorEditor.readonly = true;

                await ProseMirrorEditor.editor.create();

                //insert raw markdown string into editor state by replacing 
                //all its contents with the opened file string
                ProseMirrorEditor.editor.action(replaceAll(LocalFileDirectory.openFileString, true));
            }

            //set window title to path of currernt opened file
            await appWindow.setTitle("Iris-dev-build - " + this.splitFilePop1 + " @ " + this.splitFileConcat2);
        } else if(this.openFile === null) {
            //set openFileConst to CloseDialog constant ("Dialog Closed") 
            //when a file is not opened from dialog (user cancels it)
            this.openFileConst = FileSystemConstants.CloseDialog;

            console.log(this.openFileConst);

            console.error("Open Dialog (User Cancel): Promise Rejected!");
        }
    }

    //save file
    public async saveLF(): Promise<void> {
        this.saveFileConst = FileSystemConstants.SaveFile;

        console.log(this.saveFileConst);

        //write to file
        this.saveFile = await fs.writeTextFile({ 
            path: this.listFilesRef, 
            contents: ProseMirrorEditor.editor.action(getMarkdown())
        }, { 
            dir: fs.BaseDirectory.Desktop //|| fs.BaseDirectory.Home
        });
    }
} 
