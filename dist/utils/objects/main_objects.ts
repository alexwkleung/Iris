/* 
* file: `main-objects.ts`
*
* this file is used to create any objects that are utilized in the `main.ts` file
*
*/

import { ProseMirrorEditorDiv } from '../../editor/editor'
import { ProseMirrorView } from '../../editor/editor'

//MainObjects class
export class MainObjects {
    //ProseMirror Editor Div object
    static PMEditorDiv = new ProseMirrorEditorDiv() as ProseMirrorEditorDiv;

    //ProseMirror Editor View object
    static PMEditorView = new ProseMirrorView() as ProseMirrorView;
}
