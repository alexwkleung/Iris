/* 
* file: `main-objects.ts`
*
* this file is used to create any objects that are utilized in the `main.ts` file
*
*/

import { ProseMirrorEditorNode } from '../../editor/editor'
import { LocalFileDirectoryNode } from '../file_directory/file_directory'
import { LocalEventListeners } from '../event_listeners/event_listeners'
import { ProseMirrorEditor } from '../../editor/editor_state/editor_state';
import { FileDirectoryBuilder } from '../dom_builder/dom_builder'

//MainObjects class
export class MainObjects {
    //ProseMirror Editor Node object
    static PMEditorNode = new ProseMirrorEditorNode() as ProseMirrorEditorNode;
    //

    //ProseMirror Editor object
    static PMEditor = new ProseMirrorEditor() as ProseMirrorEditor;
    //

    //Local File Directory object
    static LFDirectoryNode = new LocalFileDirectoryNode() as LocalFileDirectoryNode;
    //

    //Local Event Listeners object
    static LocalEvt = new LocalEventListeners() as LocalEventListeners;
    //

    //DOM Builders
    static FileDirectoryBuilder = new FileDirectoryBuilder() as FileDirectoryBuilder;
}
