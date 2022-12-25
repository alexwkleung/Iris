import { EditorView } from '@codemirror/view'
import { CodeMirror_EditorState } from '../cm_editor_state/cm_editor_state'
import { ProseMirrorEditor } from '../../editor/editor_state/editor_state'

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
