import { App } from "../../app"

export class CodeMirror_EditorNode {
    static editorNode: HTMLDivElement;
    
    public CodeMirrorEditorNode() {
        CodeMirror_EditorNode.editorNode = document.createElement('div');
        CodeMirror_EditorNode.editorNode.setAttribute("id", "cm_editor");

        App.appNode.appendChild(CodeMirror_EditorNode.editorNode);
    }
}