/* 
* file: `file_directory.ts`
*
* this file creates the file directory that is beside the editor within the 
* main window in the front-end 
*
* TypeScript and/or Rust (Tauri/Native API) will be used for
* processing folders/files in the OS to be used within Iris
*
* at the moment, the file directory will only handle local files
*
* later on, a local/remote database implementation will be added in here in parallel 
* to the local file directory
*
*/

import { app } from '../../app'
import { dialog } from '@tauri-apps/api'
import { fs } from '@tauri-apps/api'
import { path } from '@tauri-apps/api'

import '../../styles/file_directory.css'

//Local File Directory Div class
export class LocalFileDirectoryDiv {
    public LFDirectoryDiv() {
        //parent div
        const fileDirectoryDivParent = document.createElement('div') as HTMLDivElement;
        fileDirectoryDivParent.setAttribute("id", "fileDirectoryParent");
        
        app.appendChild(fileDirectoryDivParent) as HTMLDivElement;

        //button (temporary)
        const fileFolderPickerBtn = document.createElement('button') as HTMLButtonElement;
        fileFolderPickerBtn.setAttribute("id", "filefolderpicker");
     
        //button text node (temporary)
        const FFTextNode1 = document.createTextNode("Browse Folder");
     
        fileFolderPickerBtn.appendChild(FFTextNode1);
        fileDirectoryDivParent.appendChild(fileFolderPickerBtn);

        const fileDirectoryDiv = document.createElement('div');
        fileDirectoryDiv.setAttribute("id", "fileDirectory");
        
        app.appendChild(fileDirectoryDiv) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        return fileDirectoryParent.appendChild(fileDirectoryDiv) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory {
    //open folder dialog
    public async OpenLFFolderDialog() {
        const arr = [];

        const openFolder = await dialog.open({
            directory: true,
            defaultPath: await path.homeDir()
        }) as string;

        if(openFolder) {
            console.log(openFolder + " ---> " + typeof openFolder);
        } else if(openFolder === null) {
            console.log("User canceled open dialog.")
        } 

        console.log(fs.readDir(
            openFolder, {
            recursive: true
        }));
    }
} 
