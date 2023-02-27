/*
* file: `cm_editor_view.ts`
*
* this file holds the editorview for the codemirrror editor
*
*/

import { EditorView } from '@codemirror/view'
import { CodeMirror_EditorState } from '../cm_editor_state/cm_editor_state'

/**
 * @class CodeMirror_EditorView
 * 
 * @file `cm_editor_view.ts`
 */
export class CodeMirror_EditorView {
    /**
     * editorView variable
     * 
     * Used as a reference variable when creating the CodeMirror EditorView
     * @member static
     * @returns EditorView
     */
    static editorView: EditorView;

    /**
     * CodeMirror EditorView function
     * 
     * @returns EditorView
     */
    public CodeMirror_EditorView(): EditorView {
        CodeMirror_EditorView.editorView = new EditorView({
            state: CodeMirror_EditorState.CodeMirror_EditorState(),
            doc: "",
            parent: document.querySelector('#cm_editor') as HTMLElement
        });

        return CodeMirror_EditorView.editorView;
    }
}
