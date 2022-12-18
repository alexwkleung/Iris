/* 
* file: `event_listeners.ts`
*
* this file holds all the event listeners necessary to make the elements 
* in the front-end side of things usable
*
*/

import { LocalFileDirectory } from '../filedirectory/file_directory'

export class IrisEventListeners {
    private LFDirectory = new LocalFileDirectory() as LocalFileDirectory;

    public FileFolderPickerListener() {
        const fileFolderPicker = document.querySelector('#filefolderpicker') as HTMLButtonElement;
        fileFolderPicker.addEventListener('click', (): void => {
            this.LFDirectory.OpenLFFolderDialog();
        });
    }
}