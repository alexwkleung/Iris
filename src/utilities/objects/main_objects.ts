/* 
* file: `main_objects.ts`
*
* this file is used to create any objects that are utilized in the `main.ts` file
*
*/

import { ProseMirrorEditorNode } from '../../prosemirror/pm_editor_node'
import { LocalFileDirectoryNode } from '../file_directory/file_directory_node'
import { LocalEventListeners } from '../event_listeners/event_listeners'
import { ProseMirrorEditor } from '../../prosemirror/pm_editor_state/pm_editor_state'
import { FileDirectoryBuilder } from '../dom_builder/dom_builder'
import { CodeMirror_EditorNode } from '../../codemirror/cm_editor/cm_editor'
import { CodeMirror_EditorView } from '../../codemirror/cm_editor_view/cm_editor_view'
import { ReadingMode } from '../../reading_mode/reading_mode'

/**
 * @class MainObjects
 * 
 * @file `main_objects.ts`
 */
export class MainObjects {
    /**
     * ProseMirror Editor node object
     * 
     * @member static
     * @access readonly
     */
    static readonly PMEditorNode = new ProseMirrorEditorNode() as ProseMirrorEditorNode;

    /**
     * ProseMirror Editor object
     * 
     * @member static
     * @access readonly
     */
    static readonly PMEditor = new ProseMirrorEditor() as ProseMirrorEditor;

    /**
     * Local File Directory Node object
     * 
     * @member static
     * @access readonly
     */
    static readonly LFDirectoryNode = new LocalFileDirectoryNode() as LocalFileDirectoryNode;

    /**
     * Local Event Listeners object
     * 
     * @member static
     * @access readonly
     */
    static readonly LocalEvt = new LocalEventListeners() as LocalEventListeners;

    /**
     * File Directory Builder object
     * 
     * @member static
     * @access readonly
     */
    static readonly FileDirectoryBuilder = new FileDirectoryBuilder() as FileDirectoryBuilder;

    /**
     * CodeMirror Editor Node object
     * 
     * @member static
     * @access readonly
     */
    static readonly CMEditorNode = new CodeMirror_EditorNode() as CodeMirror_EditorNode;

    /**
     * CodeMirror EditorView object
     * 
     * @member static
     * @access readonly
     */
    static readonly CMEditorView = new CodeMirror_EditorView() as CodeMirror_EditorView;

    /**
     * Reading Mode object
     * 
     * @member static
     * @access readonly
     */
    static readonly ReadingMode = new ReadingMode() as ReadingMode;
}
