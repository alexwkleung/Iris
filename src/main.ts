/*
* file: `main.ts`
*
* this file will call imported functions necessary to run the appplication
*
*/

import { MainObjects } from './utilities/objects/main_objects'

export class Main {
    public static main() {
        //Local File Directory Node
        MainObjects.LFDirectoryNode.LFDirectoryDiv();
    
        //ProseMirror Editor Node
        MainObjects.PMEditorNode.PMEditorNode();
    
        //ProseMirror Editor State (Milkdown)
        MainObjects.PMEditor.PM_State();

        //CodeMirror Editor Nodes
        MainObjects.CMEditorNode.CodeMirrorEditorNode();

        //CodeMirror Editor View
        MainObjects.CMEditorView.CodeMirror_EditorView();

        //Local Event Listeners
        MainObjects.LocalEvt.openFolderListener();
        MainObjects.LocalEvt.saveFileListener();
        MainObjects.LocalEvt.editorModeListener();

        //Reading Mode
        MainObjects.ReadingMode.readingModeNode();

        //create file
        MainObjects.LocalEvt.createFileListener();

        //rename file
        MainObjects.LocalEvt.renameFileListener();

        //delete file 
        MainObjects.LocalEvt.deleteFileListener();
    }    
}

//invoke main
const _mainFn = (): void => {
    Main.main();
}
_mainFn();
