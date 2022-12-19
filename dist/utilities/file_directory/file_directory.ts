/* 
* file: `file_directory.ts`
*
* this file creates the file directory that is beside the editor within the 
* main window in the front-end 
*
* TypeScript and/or Rust (Tauri/Native API) will be used for
* processing folders/files in the OS to be used within Iris
*
* for now, the file operations will be done on the TypeScript side and will move 
* to the Rust side later once the core structure is down
*
* at the moment, the file directory will only handle local files
*
* later on, a local/remote database implementation will be added in here in parallel 
* to the local file directory
*
*/

import { app } from '../../app'
import { dialog, fs, path } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { e } from '@tauri-apps/api/fs-4bb77382'
import { MarkdownParser } from '../markdown_parser/markdown_parser'
import { ProseMirrorView } from '../../editor/editor'

import '../../styles/file_directory.css'

//Local File Directory Div class
export class LocalFileDirectoryDiv {
    public LFDirectoryDiv() {
        //file directory div (parent)
        const fileDirectoryDivParent = document.createElement('div') as HTMLDivElement;
        fileDirectoryDivParent.setAttribute("id", "fileDirectoryParent");
        
        app.appendChild(fileDirectoryDivParent) as HTMLDivElement;

        //browse folder button (temporary)
        const browseFolderBtn = document.createElement('button') as HTMLButtonElement;
        browseFolderBtn.setAttribute("id", "browseFolder");
     
        //browse folder button text node (temporary)
        const FFTextNode1 = document.createTextNode("Browse Folder");
     
        browseFolderBtn.appendChild(FFTextNode1);
        fileDirectoryDivParent.appendChild(browseFolderBtn);

        //open file button (temporary)
        const openFileBtn = document.createElement('button') as HTMLButtonElement;
        openFileBtn.setAttribute("id", "openFile");

        const OFTextNode1 = document.createTextNode("Open File");
        openFileBtn.appendChild(OFTextNode1);
        fileDirectoryDivParent.appendChild(openFileBtn);

        //save file button (temporary)
        const saveFileBtn = document.createElement('button') as HTMLButtonElement;
        saveFileBtn.setAttribute("id", "saveFile");

        const SFTextNode1 = document.createTextNode("Save File");
        saveFileBtn.appendChild(SFTextNode1);
        fileDirectoryDivParent.appendChild(saveFileBtn);

        //file directory div (child)
        const fileDirectoryDiv = document.createElement('div');
        fileDirectoryDiv.setAttribute("id", "fileDirectory");
        
        app.appendChild(fileDirectoryDiv) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        return fileDirectoryParent.appendChild(fileDirectoryDiv) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory extends ProseMirrorView {
    //private PMState = new ProseMirrorState() as ProseMirrorState;
    //private PMView = new ProseMirrorView() as ProseMirrorView;

    //string to hold data from file to pass into ProseMirror editor
    static openFileString: string = "" as string;

    //local folder array
    static localFolderArr: e[][] = [] as e[][];

    //local file array
    static localFileArr: string[] = [] as string[];

    public openFile: string;

    public splitFileDirectory: string[];

    public splitFilePop1: string | null;

    public splitFilePop2: string | null;

    public splitFilePop3: string | null;

    public splitFileConcat1: string;

    public splitFileConcat2: string;

    //open folder dialog (need to work on this!)
    public async OpenLFFolder() {
        //const folderArr = [] as e[][];

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
        //open file dialog
        this.openFile = await dialog.open({
            filters: [{
                name: "Iris Accepted File Types",
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

        //temporary file list example
        //do not use innerHTML - instead create elements/nodes dynamically
        //folder name should be parent div that is collapsible
        //once you open the collapsible parent div, it will reveal the file names (child divs)
        fileDirectory.innerHTML = this.splitFileConcat1 as string + "<br><br>" + "\t" + this.splitFilePop1 as string;

        this.splitFileConcat2 = this.splitFilePop3 + "/" + this.splitFilePop2;

        //exception handle 
        if(this.openFile) {
            //log path to file
            console.log(this.openFile);
        
            //resolve promise from readTextFile to handle data
            //and push that data into fileArr array
            await Promise.resolve(readFileToArr).then((fileData) => {
                LocalFileDirectory.localFileArr.push(fileData);
            });
        
            //ensure data is passed and parsed
            //this logic must be tweaked in order to handle multiple files
            //
            for(let folderIndex of LocalFileDirectory.localFileArr) {
                //const tNode = document.createTextNode(this.openFileString);

                //resolve promise for markdown parser
                //and append parsed content from file to the DOM
                Promise.resolve(MarkdownParser.mdParse(folderIndex).then(() => {
                    //this is okay for now, as the content div is not visible and only used
                    //for ProseMirror's document parsing
                    (document.querySelector('#content') as HTMLDivElement).innerHTML = LocalFileDirectory.openFileString;
                    
                    console.log(LocalFileDirectory.openFileString);
                    //(document.querySelector('.ProseMirror') as HTMLDivElement).innerHTML = LocalFileDirectory.openFileString;
                }));
                //console.log(this.openFileString);
            }

            //set window title to path of currernt opened file
            await appWindow.setTitle("Iris-dev-build - " + this.splitFilePop1 + " @ " + this.splitFileConcat2);
        } else if(this.openFile === null) {
            console.error("Open Dialog (User Cancel): Promise Rejected!");
        }
    }

    public async saveLF() {
        console.log(this.openFile);

        /*
        await fs.writeTextFile({ 
            path: this.openFile, 
            contents: 
        }, { 
            dir: fs.BaseDirectory.Desktop | fs.BaseDirectory.Home
        });
        */
    }
} 
