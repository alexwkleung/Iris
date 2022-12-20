/* 
* file: `main-objects.ts`
*
* this file is used to create any objects that are utilized in the `main.ts` file
*
*/

import { ProseMirrorEditorDiv } from '../../editor/editor'
import { ProseMirrorView } from '../../editor/editorview/editor_view'
import { LocalFileDirectoryDiv } from '../file_directory/file_directory'
import { IrisEventListeners } from '../event_listeners/event_listeners'

//MainObjects class
export class MainObjects {
    //ProseMirror Editor Div object
    static PMEditorDiv = new ProseMirrorEditorDiv() as ProseMirrorEditorDiv;
    //

    //ProseMirror Editor View object
    static PMEditorView = new ProseMirrorView() as ProseMirrorView;
    //

    //Local File Directory object
    static LFDirectoryDiv = new LocalFileDirectoryDiv() as LocalFileDirectoryDiv;
    //

    //Iris Event Listeners object
    static IrisEvt = new IrisEventListeners() as IrisEventListeners;
    //
}
