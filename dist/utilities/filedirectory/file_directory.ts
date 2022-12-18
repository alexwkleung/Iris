/* 
* file: `file_directory.ts`
*
* this file creates the file directory that is beside the editor within the 
* main window in the front-end 
*
* TypeScript and Rust (Tauri/Native API) will be used for
* processing folders/files at the OS level
*
* at the moment, the file directory will only handle local files
*
* later on, a local/remote database implementation will be added in here in parallel 
* to the local file directory
*
*/

import '../../styles/file_directory.css'

//Local File Directory Div class
export class LocalFileDirectoryDiv {
    public LFDirectoryDiv() {
        const app = document.querySelector('#app') as HTMLElement;
        const fileDirectoryDiv = document.createElement('div');
        fileDirectoryDiv.setAttribute("id", "filedirectory");

        return (app.appendChild(fileDirectoryDiv) as HTMLDivElement);
    }
}

//Local File Directory class
export class LocalFileDirectory {
    
} 

export{};