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

import '../../styles/file_directory.css'

//Local File Directory Div class
export class LocalFileDirectoryDiv {
    public LFDirectoryDiv() {
        //parent div
        const fileDirectoryDivParent = document.createElement('div') as HTMLDivElement;
        fileDirectoryDivParent.setAttribute("id", "fileDirectoryParent");
     
        //button (temporary)
        const fileFolderPickerBtn = document.createElement('button') as HTMLButtonElement;
        fileFolderPickerBtn.setAttribute("id", "filefolderpicker");
     
        //button text node (temporary)
        const FFTextNode1 = document.createTextNode("Browse File/Folder");
     
        fileFolderPickerBtn.appendChild(FFTextNode1);
        fileDirectoryDivParent.appendChild(fileFolderPickerBtn);
        app.appendChild(fileDirectoryDivParent) as HTMLDivElement;

        const fileDirectoryDiv = document.createElement('div');
        fileDirectoryDiv.setAttribute("id", "fileDirectory");
        
        app.appendChild(fileDirectoryDiv) as HTMLDivElement;
        
        const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        return fileDirectoryParent.appendChild(fileDirectoryDiv) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory {
    
} 
