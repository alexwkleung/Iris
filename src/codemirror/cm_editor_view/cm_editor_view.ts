/*
* file: `cm_editor_view.ts`
*
* this file holds the editorview for the codemirrror editor
*
*/

import { EditorView } from '@codemirror/view'
import { CodeMirror_EditorState } from '../cm_editor_state/cm_editor_state'

export class CodeMirror_EditorView {
    //ref
    static editorView: EditorView;

    //CodeMirror Editor View
    public CodeMirror_EditorView() {
        CodeMirror_EditorView.editorView = new EditorView({
            state: CodeMirror_EditorState.CodeMirror_EditorState(),
            doc: "",
            parent: document.querySelector('#cm_editor') as HTMLElement
        });
    }
}
