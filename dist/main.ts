/*
* file: `main.ts`
*
* this file will call imported functions necessary to run Iris. 
*
* most of the functions will be contained within classes, so they will be 
* accessed via dot operators
*/

import { MainObjects } from './utils/main-objects'

//objectFns function
function irisMainFn(): void {
    MainObjects.PMEditorDiv.editorDivFn();

    MainObjects.PMEditorView.PMView();
}   
irisMainFn();
