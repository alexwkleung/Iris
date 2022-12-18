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

import '../../styles/file_directory.css'
import { read, readFile } from 'fs';

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
                extensions: ["md", "txt"],
            }], 
            recursive: true,
        }) as string;

        //exception handle 
        if(openFile) {
            console.log(openFile);
        } else if(openFile === null) {
            console.error("User canceled open dialog.")
        }

        /*
        const splitFileSplit = openFile.split('/');
        console.log(splitFileSplit);
        const splitFilePop1: string | undefined = splitFileSplit.pop() as string | undefined;
        console.log(splitFilePop1);
        */

        const readFileToArr = fs.readTextFile(openFile, {
            dir: fs.BaseDirectory.Desktop || fs.BaseDirectory.Home
        })

        /*
        .then(
            (fileData) => {
                fileArr.push(fileData)
                for(let i = 0; i < fileArr.length; i++) {
                    test = fileArr[i];
                }
        });
        */

        //resolve promise from readTextFile to handle data
        await Promise.resolve(readFileToArr).then((fileData) => {
            fileArr.push(fileData);
            //console.log(fileArr[0]);
        });

        for(let folderIndex of fileArr) {
            //temporary (testing out JSON string for holding/parsing data from file)
            const folderIndexStringify = JSON.stringify(folderIndex);
            //console.log(JSON.parse(folderIndexStringify));

            this.openFileString = JSON.parse(folderIndexStringify);
            console.log(this.openFileString);
        }
    }
} 
