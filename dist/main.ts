/*
* file: `main.ts`
*
* this file will call imported functions necessary to run the appplication
*
*/

import { MainObjects } from './utilities/objects/main_objects'

//main function
function main(): void {
    //Local File Directory Node
    MainObjects.LFDirectoryNode.LFDirectoryDiv();
    //

    //ProseMirror Editor Node
    MainObjects.PMEditorNode.PMEditorNode();
    //

    //ProseMirror Editor State (Milkdown)
    MainObjects.PMEditor.PM_State();

    //CodeMirror Editor Nodes
    MainObjects.CMEditorNode.CodeMirrorEditorNode();

    //CodeMirror Editor View
    MainObjects.CMEditorView.CodeMirror_EditorView();

    //Local Event Listeners
    MainObjects.LocalEvt.openFolderListener();
    MainObjects.LocalEvt.openFileListener();
    MainObjects.LocalEvt.saveFileListener();
    MainObjects.LocalEvt.editorMode();
    //
}   
main();
