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
* note that implementations may change over time
*
*/

import { app } from '../../app'
import { dialog, fs, path } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { e } from '@tauri-apps/api/fs-4bb77382'
import { MarkdownParser } from '../markdown_parser/markdown_parser'
import { ProseMirrorView } from '../../editor/editorview/editor_view'

import {fromHtml} from 'hast-util-from-html'
import {toMdast} from 'hast-util-to-mdast'
import {toMarkdown} from 'mdast-util-to-markdown'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { fromMarkdown } from 'mdast-util-from-markdown'

import '../../styles/file_directory.css'

//Local File Directory Div class
export class LocalFileDirectoryDiv {
    //passable created DOM node variables to reference later
    static fileDirectoryDivParent: HTMLDivElement;
    static browseFolderBtn: HTMLButtonElement;
    static openFileBtn: HTMLButtonElement;
    static saveFileBtn: HTMLButtonElement;
    static fileDirectoryDiv: HTMLDivElement;

    public LFDirectoryDiv() {
        //file directory div (parent)
        LocalFileDirectoryDiv.fileDirectoryDivParent = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryDiv.fileDirectoryDivParent.setAttribute("id", "fileDirectoryParent");
        
        app.appendChild(LocalFileDirectoryDiv.fileDirectoryDivParent) as HTMLDivElement;

        //browse folder button (temporary)
        LocalFileDirectoryDiv.browseFolderBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryDiv.browseFolderBtn.setAttribute("id", "browseFolder");
     
        //browse folder button text node (temporary)
        const FFTextNode1 = document.createTextNode("Browse Folder");
     
        LocalFileDirectoryDiv.browseFolderBtn.appendChild(FFTextNode1);
        LocalFileDirectoryDiv.fileDirectoryDivParent.appendChild(LocalFileDirectoryDiv.browseFolderBtn);

        //open file button (temporary)
        LocalFileDirectoryDiv.openFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryDiv.openFileBtn.setAttribute("id", "openFile");

        const OFTextNode1 = document.createTextNode("Open File");
        LocalFileDirectoryDiv.openFileBtn.appendChild(OFTextNode1);
        LocalFileDirectoryDiv.fileDirectoryDivParent.appendChild(LocalFileDirectoryDiv.openFileBtn);

        //save file button (temporary)
        LocalFileDirectoryDiv.saveFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryDiv.saveFileBtn.setAttribute("id", "saveFile");

        const SFTextNode1 = document.createTextNode("Save File");
        LocalFileDirectoryDiv.saveFileBtn.appendChild(SFTextNode1);
        LocalFileDirectoryDiv.fileDirectoryDivParent.appendChild(LocalFileDirectoryDiv.saveFileBtn);

        //file directory div (child)
        LocalFileDirectoryDiv.fileDirectoryDiv = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryDiv.fileDirectoryDiv.setAttribute("id", "fileDirectory");
        
        app.appendChild(LocalFileDirectoryDiv.fileDirectoryDiv) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        return fileDirectoryParent.appendChild(LocalFileDirectoryDiv.fileDirectoryDiv) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory extends ProseMirrorView {
    //string to hold data from file
    static openFileString: string = "" as string;

    //string to hold data from file
    static saveFileString: string;

    //local folder array
    static localFolderArr: e[][] = [] as e[][];

    //local file array
    static localFileArr: string[] = [] as string[];

    //open file variables
    public openFile: string;
    public splitFileDirectory: string[];
    public splitFilePop1: string | null;
    public splitFilePop2: string | null;
    public splitFilePop3: string | null;
    public splitFileConcat1: string;
    public splitFileConcat2: string;

    //open folder dialog (need to work on this!!)
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

        //temporary file tree example
        //when doing actual implementation of the file tree, 
        //make sure to create elements/nodes dynamically.
        //
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
        
            //ensure data is passed and converted to correct syntax tree
            //
            //this logic must be tweaked in order to handle multiple files
            //
            for(let folderIndex of LocalFileDirectory.localFileArr) {
                const selectContent = document.querySelector('#content') as HTMLDivElement;
                const selectPM = document.querySelector('.ProseMirror') as HTMLDivElement;

                //use hast utils to convert mdast to hast and hast (html)
                //to markdown for saving.
                //
                //although this somewhat works, you need to make sure 
                //that the prosemirror side of things are working 
                //the way the library handles certain operations
                //
                const mdast = fromMarkdown(folderIndex);
                const hast: any = toHast(mdast);
                const html = toHtml(hast);

                LocalFileDirectory.openFileString = html;

                console.log(LocalFileDirectory.openFileString);

                selectContent.innerHTML = LocalFileDirectory.openFileString;
                selectPM.innerHTML = selectContent.innerHTML;
            }
            //set window title to path of currernt opened file
            await appWindow.setTitle("Iris-dev-build - " + this.splitFilePop1 + " @ " + this.splitFileConcat2);
        } else if(this.openFile === null) {
            console.error("Open Dialog (User Cancel): Promise Rejected!");
        }
    }

    public async saveLF() {
        console.log(this.openFile);

        //use hast utils to convert html to mdast and mdast to markdown for saving
        //
        //although this somewhat works, you need to make sure 
        //that the prosemirror side of things are working 
        //the way the library handles certain operations
        //
        const hast = fromHtml(String((document.querySelector('#content') as HTMLDivElement).innerHTML), { fragment: true })
        const mdast = toMdast(hast);
        const md = toMarkdown(mdast);

        LocalFileDirectory.saveFileString = md;

        console.log(LocalFileDirectory.saveFileString);

        await fs.writeTextFile({ 
            path: this.openFile, 
            contents: LocalFileDirectory.saveFileString
        }, { 
            dir: fs.BaseDirectory.Desktop //| fs.BaseDirectory.Home
        });
    }
} 
