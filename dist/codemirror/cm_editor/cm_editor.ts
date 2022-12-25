import { App } from "../../app"

//CodeMirror Editor Node
export class CodeMirror_EditorNode {
    //ref
    static editorNode: HTMLDivElement;

    //CodeMirror Editor Node function
    public CodeMirrorEditorNode() {
        CodeMirror_EditorNode.editorNode = document.createElement('div');
        CodeMirror_EditorNode.editorNode.setAttribute("id", "cm_editor");

        CodeMirror_EditorNode.editorNode.style.display = "none";

        App.appNode.appendChild(CodeMirror_EditorNode.editorNode);
    }
}