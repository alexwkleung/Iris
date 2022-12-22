/* 
* file: `event_listeners.ts`
*
* this file holds all the event listeners necessary to make 
* the front-end side of things usable
*
*/

import { LocalFileDirectory } from '../file_directory/file_directory'

//Local Event Listeners class
export class LocalEventListeners extends LocalFileDirectory {
    private LFDirectory = new LocalFileDirectory() as LocalFileDirectory;

    //open folder listener
    public openFolderListener() {
        const browseFolder = document.querySelector('#openFolder') as HTMLButtonElement;

        browseFolder.addEventListener('click', async () => {
            console.log("Open Local Folder: Promise Resolved.");
            await Promise.resolve(this.LFDirectory.OpenLFFolder()).then(() => {
                console.log("Open Local Folder: Promise Resolved.");
            });
        });
    }

    //open file listener
    public openFileListener() {
        const openFile = document.querySelector('#openFile') as HTMLButtonElement;
        
        openFile.addEventListener('click', async () => {
            console.log("Clicked open file button");

            await Promise.resolve(this.LFDirectory.OpenLF()).then(() => {
                console.log("Open Local File: Promise Resolved.");
            });
        });
    }   

    //save file listener
    public saveFileListener() {
        const saveFile = document.querySelector('#saveFile') as HTMLButtonElement;

        saveFile.addEventListener('click' , async () => {
            await Promise.resolve(this.LFDirectory.saveLF()).then(() => {
                console.log("Save Local File: Promise Resolved.");
            });
        });
    }
}