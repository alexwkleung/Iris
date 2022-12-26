import { EvaSTUtil } from "eva-st-util"
import { App } from "../app"
import { ProseMirrorEditor } from "../prosemirror/pm_editor_state/pm_editor_state"
import { CodeMirror_EditorView } from "../codemirror/cm_editor_view/cm_editor_view"
import { getMarkdown, getHTML } from "@milkdown/utils"

export class ReadingMode {
    //reading mode node container ref
    static readingModeNodeContainer: HTMLDivElement;

    //converter refs
    private MDtoHTML_ProseMirror: string;
    private MDtoHTML_CodeMirror: string;

    //reading mode node
    public readingModeNode() {
        ReadingMode.readingModeNodeContainer = document.createElement('div');
        ReadingMode.readingModeNodeContainer.setAttribute("id", "readingModeNodeContainer");
        
        ReadingMode.readingModeNodeContainer.style.display = "none";

        App.appNodeContainer.appendChild(ReadingMode.readingModeNodeContainer);
    }

    //reading mode from prosemirror instance
    public readingMode_ProseMirror() {
        this.MDtoHTML_ProseMirror = EvaSTUtil.MDtoHTML_ST(ProseMirrorEditor.editor.action(getMarkdown()));

        ReadingMode.readingModeNodeContainer.innerHTML = this.MDtoHTML_ProseMirror;
    }

    //reading mode from codemirror instance
    public readingMode_CodeMirror() {
        this.MDtoHTML_CodeMirror = EvaSTUtil.MDtoHTML_ST(CodeMirror_EditorView.editorView.state.doc.toString());

        ReadingMode.readingModeNodeContainer.innerHTML = this.MDtoHTML_CodeMirror;
    }
}