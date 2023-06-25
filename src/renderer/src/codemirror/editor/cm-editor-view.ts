import { EditorView } from "@codemirror/view"
import { CMEditorState } from "./cm-editor-state"

export class CMEditorView {
    /**
     * Editor view reference variable
     * 
     * @static
     */
    public static editorView: EditorView;

    public static setContenteditable(enable: boolean): void {
        let contenteditable: void;

        const codeMirrorNode: HTMLElement = document.querySelector('.cm-editor') as HTMLElement;

        if(enable) {
            contenteditable = codeMirrorNode.setAttribute("contenteditable", "");
        } else if(!enable) {
            contenteditable = codeMirrorNode.setAttribute("contenteditable", "none");
        }

        return contenteditable;
    }

    /**
     * Create editor view
     * 
     * @static 
     * 
     * @returns EditorView
     */
    public static createEditorView(): EditorView {
        CMEditorView.editorView = new EditorView({
            state: CMEditorState.editorState,
            doc: '',
            parent: document.getElementById("editor-container") as HTMLElement
        })

        return CMEditorView.editorView;
    }
}