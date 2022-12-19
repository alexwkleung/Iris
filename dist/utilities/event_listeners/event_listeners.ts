/* 
* file: `event_listeners.ts`
*
* this file holds all the event listeners necessary to make the elements 
* in the front-end side of things usable
*
*/

import { LocalFileDirectory } from '../file_directory/file_directory'
import { MainObjects } from '../objects/main_objects'

export class IrisEventListeners {
    private LFDirectory = new LocalFileDirectory() as LocalFileDirectory;

    //open folder listener
    public openFolderListener() {
        const browseFolder = document.querySelector('#browseFolder') as HTMLButtonElement;

        browseFolder.addEventListener('click', (): void => {
            this.LFDirectory.OpenLFFolder();
        });
    }

    //open file listener
    public openFileListener() {
        const openFile = document.querySelector('#openFile') as HTMLButtonElement;
        
        openFile.addEventListener('click', async () => {
            await Promise.resolve(this.LFDirectory.OpenLF()).then(() => {
                //MainObjects.PMEditorView.PMView();
                console.log("Open Local File: Promise Resolved.");
            });

            MainObjects.PMEditorView.PMView();
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