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
import { e } from '@tauri-apps/api/fs-4bb77382'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

import '../../styles/file_directory.css'
//import { read, readFile } from 'fs';

//Local File Directory Div class
export class LocalFileDirectoryDiv {
    public LFDirectoryDiv() {
        //parent div
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

        const fileDirectoryDiv = document.createElement('div');
        fileDirectoryDiv.setAttribute("id", "fileDirectory");
        
        app.appendChild(fileDirectoryDiv) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        return fileDirectoryParent.appendChild(fileDirectoryDiv) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory {
    //string to hold data from file to pass into ProseMirror editor
    public openFileString: string = "";

    //open folder dialog
    public async OpenLFFolder() {
        const folderArr = [] as e[][];

        const openFolder = await dialog.open({
            directory: true,
            defaultPath: await path.homeDir()
        }) as string;

        if(openFolder) {
            console.log(openFolder + " ---> " + typeof openFolder);
        } else if(openFolder === null) {
            console.log("User canceled open dialog.")
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
        /*
        .then(
            (folderData) => {
                folderArr.push(folderData) && console.log(folderArr)
            }
        );
        */

        await Promise.resolve(readDirToArr).then((folderData) => {
            folderArr.push(folderData) //&& console.log(folderArr)
        })
    }

    //open file dialog
    public async OpenLF() {
        //file array
        const fileArr: string[] = [] as string[];

        //open file dialog
        const openFile: string = await dialog.open({
            filters: [{
                name: "Iris Accepted File Types",
                extensions: ["md"],
            }], 
            recursive: true,
        }) as string;

        const readFileToArr = fs.readTextFile(openFile, {
            dir: fs.BaseDirectory.Desktop || fs.BaseDirectory.Home
        })

        //exception handle 
        if(openFile) {
            //log path to file
            console.log(openFile);

            //resolve promise from readTextFile to handle data
            //and push that data into fileArr array
            await Promise.resolve(readFileToArr).then((fileData) => {
                fileArr.push(fileData);
            });
        } else if(openFile === null) {
            console.error("User canceled open dialog. Promise rejected.")
        }

        //testing to make sure data is passed and parsed (via console check)
        for(let folderIndex of fileArr) {
            /*
            //temporary (testing out JSON string for holding/parsing data from file)
            const folderIndexStringify = JSON.stringify(folderIndex, null, 2);
            
            this.openFileString = JSON.parse(folderIndexStringify);
            */

            //parse open file using unified
            const mdParse = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(rehypeSanitize)
                .use(rehypeStringify)
                .process(folderIndex)
            
            this.openFileString = String(mdParse)

            //const tNode = document.createTextNode(this.openFileString);

            console.log(this.openFileString);
            //(document.querySelector('.ProseMirror') as HTMLDivElement).textContent = this.openFileString;
            (document.querySelector('#content') as HTMLDivElement).innerHTML = this.openFileString;

            //this should be dealt with in a transaction in the EditorState, and
            //not directly manipulating the DOM tree
            (document.querySelector('.ProseMirror') as HTMLDivElement).innerHTML = this.openFileString;
        }

        const fileDirectory = document.querySelector('#fileDirectory') as HTMLElement;
        
        //temporary directory folder title
        const splitFileDirectory = openFile.split('/');
        const splitFilePop1 = splitFileDirectory.pop() as string | null;
        const splitFilePop2 = splitFileDirectory.pop() as string | null;
        const splitFilePop3 = splitFileDirectory.pop() as string | null;
        const splitFileConcat1 = splitFilePop3 + "/" + splitFilePop2 as string;
        fileDirectory.textContent = splitFilePop2 as string | null;

        //temporary file list example
        //do not use innerHTML - instead create elements/nodes dynamically
        //folder name should be parent div that is collapsible
        //once you open the collapsible parent div, it will reveal the file names (child divs)
        fileDirectory.innerHTML = splitFileConcat1 as string + "<br><br>" + "\t" +  splitFilePop1 as string;
    }
} 
