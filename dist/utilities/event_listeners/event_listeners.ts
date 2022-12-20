/* 
* file: `event_listeners.ts`
*
* this file holds all the event listeners necessary to make the elements 
* in the front-end side of things usable
*
*/

import { LocalFileDirectory } from '../file_directory/file_directory'
import { MainObjects } from '../objects/main_objects'

//Iris Event Listeners class
export class IrisEventListeners extends LocalFileDirectory {
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
            MainObjects.PMEditorView.PMView();
            
            console.log("Created Editor View");

            await Promise.resolve(this.LFDirectory.OpenLF()).then(() => {
                const selectContent = document.querySelector('#content') as HTMLDivElement;
                const selectPM = document.querySelector('.ProseMirror') as HTMLDivElement;
                
                //MainObjects.PMEditorView.PMView();
                console.log("Activated content listener on opened file");

                //extract nodes from prosemirror div to content div
                //to sync the dom trees.
                //content div will be used as the template for the current written document
                //so that the prosemirror div does not get touched
                //
                selectPM.addEventListener('keyup', () => {
                    selectContent.innerHTML = selectPM.innerHTML; 
                });
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