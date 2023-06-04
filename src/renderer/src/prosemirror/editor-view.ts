import { EditorView } from "prosemirror-view"
import { PMEditorState } from "./editor-state"

export class PMEditorView {
    /**
     * Reference variable for prosemirror editor view
     * 
     * @static
     */
    public static editorView: EditorView;

    /**
     * Create editor view 
     * 
     * @returns New editor view object
     * 
     * @static
     */
    public static createEditorView(): EditorView {
        PMEditorView.editorView = new EditorView(document.querySelector('#editor-container'), {
            state: PMEditorState.createEditorState()
        }) 

        return PMEditorView.editorView;
    }
}