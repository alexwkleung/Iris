/*
* file: `main.ts`
*
* this file will call imported functions necessary to run the appplication
*
*/

import { MainObjects } from './utilities/objects/main_objects'

class Main {
    public main() {
        //Local File Directory Node
        MainObjects.LFDirectoryNode.LFDirectoryDiv();
        //
    
        //ProseMirror Editor Node
        MainObjects.PMEditorNode.PMEditorNode();
        //
    
        //ProseMirror Editor State (Milkdown)
        MainObjects.PMEditor.PM_State();
        //

        //CodeMirror Editor Nodes
        MainObjects.CMEditorNode.CodeMirrorEditorNode();
        //

        //CodeMirror Editor View
        MainObjects.CMEditorView.CodeMirror_EditorView();
        //

        //Local Event Listeners
        MainObjects.LocalEvt.openFolderListener();
        MainObjects.LocalEvt.openFileListener();
        MainObjects.LocalEvt.saveFileListener();
        MainObjects.LocalEvt.editorMode();
        //

        //Reading Mode
        MainObjects.ReadingMode.readingModeNode();
        //

        MainObjects.LocalEvt.createFileTest();
    }    
}

//invoke main
const _main = new Main() as Main;

const _mainFn = (): void => {
    _main.main(); 
}
_mainFn();
