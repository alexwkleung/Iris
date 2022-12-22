/*
* file: `main.ts`
*
* this file will call imported functions necessary to run the appplication
*
* most of the functions will be contained within classes, so they will be 
* accessed via dot operators
*/

import { MainObjects } from './utilities/objects/main_objects'

//irisMainFn function
function irisMain(): void {
    //Local File Directory Node
    MainObjects.LFDirectoryNode.LFDirectoryDiv();
    //

    //ProseMirror Editor Node
    MainObjects.PMEditorNode.PMEditorNode();
    //

    //ProseMirror Editor State 
    MainObjects.PMEditor.PMState();

    //Iris Event Listeners
    MainObjects.LocalEvt.openFolderListener();
    MainObjects.LocalEvt.openFileListener();
    MainObjects.LocalEvt.saveFileListener();
    //
}   
irisMain();
