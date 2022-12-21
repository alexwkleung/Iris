/* 
* file: `main-objects.ts`
*
* this file is used to create any objects that are utilized in the `main.ts` file
*
*/

import { ProseMirrorEditorNode } from '../../editor/editor'
import { LocalFileDirectoryDiv } from '../file_directory/file_directory'
import { IrisEventListeners } from '../event_listeners/event_listeners'
import { ProseMirrorEditor } from '../../editor/editor_state/editor_state';

//MainObjects class
export class MainObjects {
    //ProseMirror Editor Node object
    static PMEditorNode = new ProseMirrorEditorNode() as ProseMirrorEditorNode;
    //

    //ProseMirror Editor object
    static PMEditor = new ProseMirrorEditor() as ProseMirrorEditor;
    //

    //Local File Directory object
    static LFDirectoryNode = new LocalFileDirectoryDiv() as LocalFileDirectoryDiv;
    //

    //Iris Event Listeners object
    static IrisEvt = new IrisEventListeners() as IrisEventListeners;
    //
}
