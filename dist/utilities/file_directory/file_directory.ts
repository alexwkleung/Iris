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
import { insert, getHTML, getMarkdown, replaceAll } from '@milkdown/utils'
import { FileSystemConstants } from '../constants/constants'

//stylesheets
import '../../styles/file_directory.css'
import { s } from '@tauri-apps/api/event-2a9960e7'

//Local File Directory Div class
export class LocalFileDirectoryNode {
    //passable created DOM node variables to reference later
    static fileDirectoryDivParent: HTMLDivElement;
    static browseFolderBtn: HTMLButtonElement;
    static openFileBtn: HTMLButtonElement;
    static saveFileBtn: HTMLButtonElement;
    static fileDirectoryNode: HTMLDivElement;

    public LFDirectoryDiv() {
        //file directory div (parent)
        LocalFileDirectoryNode.fileDirectoryDivParent = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryDivParent.setAttribute("id", "fileDirectoryParent");
        
        App.appNode.appendChild(LocalFileDirectoryNode.fileDirectoryDivParent) as HTMLDivElement;

        //browse folder button (temporary)
        LocalFileDirectoryNode.browseFolderBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.browseFolderBtn.setAttribute("id", "browseFolder");
     
        //browse folder button text node (temporary)
        const FFTextNode1 = document.createTextNode("Browse Folder");
     
        LocalFileDirectoryNode.browseFolderBtn.appendChild(FFTextNode1);
        LocalFileDirectoryNode.fileDirectoryDivParent.appendChild(LocalFileDirectoryNode.browseFolderBtn);

        //open file button (temporary)
        LocalFileDirectoryNode.openFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.openFileBtn.setAttribute("id", "openFile");

        const OFTextNode1 = document.createTextNode("Open File");
        LocalFileDirectoryNode.openFileBtn.appendChild(OFTextNode1);
        LocalFileDirectoryNode.fileDirectoryDivParent.appendChild(LocalFileDirectoryNode.openFileBtn);

        //save file button (temporary)
        LocalFileDirectoryNode.saveFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.saveFileBtn.setAttribute("id", "saveFile");

        const SFTextNode1 = document.createTextNode("Save File");
        LocalFileDirectoryNode.saveFileBtn.appendChild(SFTextNode1);
        LocalFileDirectoryNode.fileDirectoryDivParent.appendChild(LocalFileDirectoryNode.saveFileBtn);

        //file directory div (child)
        LocalFileDirectoryNode.fileDirectoryNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNode.setAttribute("id", "fileDirectory");
        
        App.appNode.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        return fileDirectoryParent.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory extends ProseMirrorEditor {
    //string to hold data from file
    static openFileString: string = "";

    //string to hold data from file
    static saveFileString: string;

    //local folder array
    static localFolderArr: e[][] = [];

    //local file array
    static localFileArr: string[] = [];

    //open file variables
    public openFile: string;
    public splitFileDirectory: string[];
    public splitFilePop1: string | null;
    public splitFilePop2: string | null;
    public splitFilePop3: string | null;
    public splitFileConcat1: string;
    public splitFileConcat2: string;

    //private variables to assign constants
    private openFileConst: string;
    private saveFileConst: string;

    //open folder dialog (need to work on this!!)
    public async OpenLFFolder() {
        const openFolder = await dialog.open({
            directory: true,
            defaultPath: await path.homeDir()
        }) as string;

        if(openFolder) {
            console.log(openFolder + " ---> " + typeof openFolder);
        } else if(openFolder === null) {
            console.log("User canceled open dialog: Promise Rejected.")
        } 

        const fileDirectory = document.querySelector('#fileDirectory') as HTMLDivElement;

        //temporary directory title
        //later: need to contain this in a child container div within fileDirectoryParent div
        const splitFolderDirectory = openFolder.split('/');
        const splitFolderPop1 = splitFolderDirectory.pop() as string | null;
        const splitFolderPop2 = splitFolderDirectory.pop()  as string | null;
        const splitFolderConcat = splitFolderPop2 + "/" + splitFolderPop1 as string;
        fileDirectory.textContent = splitFolderConcat as string | null;

        const readDirToArr = fs.readDir(
            openFolder, {
            recursive: true
        })

        await Promise.resolve(readDirToArr).then((folderData) => {
            LocalFileDirectory.localFolderArr.push(folderData)
        })
    }

    //open file dialog
    public async OpenLF() {
        //reset local file array
        LocalFileDirectory.localFileArr.length = 0

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
            dir: fs.BaseDirectory.Desktop || fs.BaseDirectory.Home
        })

        const fileDirectory = document.querySelector('#fileDirectory') as HTMLElement;
        
        //temporary directory folder title
        this.splitFileDirectory = this.openFile.split('/');
        this.splitFilePop1 = this.splitFileDirectory.pop() as string | null;
        this.splitFilePop2 = this.splitFileDirectory.pop() as string | null;
        this.splitFilePop3 = this.splitFileDirectory.pop() as string | null;
        this.splitFileConcat1 = this.splitFilePop3 + "/" + this.splitFilePop2 as string;
        fileDirectory.textContent = this.splitFilePop2 as string | null;

        //temporary file tree example
        //when doing actual implementation of the file tree, 
        //make sure to create elements/nodes dynamically.
        //
        //folder name should be parent div that is collapsible
        //once you open the collapsible parent div, it will reveal the file names (child divs)
        fileDirectory.innerHTML = this.splitFileConcat1 as string + "<br><br>" + "\t" + this.splitFilePop1 as string;

        this.splitFileConcat2 = this.splitFilePop3 + "/" + this.splitFilePop2;

        Promise.resolve(this.openFile).then(() => {
            Promise.resolve(readFileToArr).then((fileData) => {
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

            console.log("OUTSIDE LOOP:")
            console.log(LocalFileDirectory.openFileString);

            //insert raw markdown string into editor state by replacing 
            //all its contents with the opened file string
            ProseMirrorEditor.editor.action(replaceAll(LocalFileDirectory.openFileString));

            //set window title to path of currernt opened file
            appWindow.setTitle("Eva-dev-build - " + this.splitFilePop1 + " @ " + this.splitFileConcat2);
        } else if(this.openFile === null) {
            //set openFileConst to CloseDialog constant ("Dialog Closed") 
            //when a file is not opened from dialog (user cancels it)
            this.openFileConst = FileSystemConstants.CloseDialog;

            console.log(this.openFileConst);

            console.error("Open Dialog (User Cancel): Promise Rejected!");
        }
    }

    //save file dialog
    public async saveLF() {
        console.log(this.openFile);

        console.log(LocalFileDirectory.saveFileString);

        await fs.writeTextFile({ 
            path: this.openFile, 
            contents: ProseMirrorEditor.editor.action(getMarkdown())
        }, { 
            dir: fs.BaseDirectory.Desktop //| fs.BaseDirectory.Home
        });
    }
} 
