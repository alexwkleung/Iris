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
    public OpenFolderListener() {
        const browseFolder = document.querySelector('#browseFolder') as HTMLButtonElement;
        browseFolder.addEventListener('click', (): void => {
            this.LFDirectory.OpenLFFolder();
        });
    }

    //open file listener
    public openFileListener() {
        const openFile = document.querySelector('#openFile') as HTMLButtonElement;
        
        openFile.addEventListener('click', async () => {
            MainObjects.PMEditorView.PMView();
            await Promise.resolve(this.LFDirectory.OpenLF()).then(() => {
                console.log("RESOLVED.");
            });
        });
    }
}