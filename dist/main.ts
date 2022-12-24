/*
* file: `main.ts`
*
* this file will call imported functions necessary to run the appplication
*
*/

import { MainObjects } from './utilities/objects/main_objects'

//main function
function main() {
    //Local File Directory Node
    MainObjects.LFDirectoryNode.LFDirectoryDiv();
    //

    //ProseMirror Editor Node
    MainObjects.PMEditorNode.PMEditorNode();
    //

    //ProseMirror Editor State (Milkdown)
    MainObjects.PMEditor.PMState();

    //Local Event Listeners
    MainObjects.LocalEvt.openFolderListener();
    MainObjects.LocalEvt.openFileListener();
    MainObjects.LocalEvt.saveFileListener();
    //MainObjects.LocalEvt.switchToFileListener();
    //
}   
main();
