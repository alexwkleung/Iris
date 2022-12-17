/*
* file: `main.ts`
*
* this file will call imported functions necessary to run Iris. 
*
* most of the functions will be contained within classes, so they will be 
* accessed via dot operators
*/

import { MainObjects } from './utilities/objects/main_objects'

//irisMainFn function
function irisMainFn(): void {
    //ProseMirror Editor Div 
    MainObjects.PMEditorDiv.editorDivFn();

    //ProseMirror EditorView
    MainObjects.PMEditorView.PMView();
}   
irisMainFn();
