import { App } from "./app"
import { PMEditorView } from "./src/prosemirror/editor-view"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EditorNs {
    export class EditorContainerNode {
        public static editorContainer: HTMLDivElement;

        public static createEditorContainer(): void {
            EditorContainerNode.editorContainer = document.createElement('div');
            EditorContainerNode.editorContainer.setAttribute("id", "editor-container");
            EditorContainerNode.editorContainer.setAttribute("spellcheck", "false");
            EditorContainerNode.editorContainer.setAttribute("aria-hidden", "true");

            App.appNode.insertBefore(EditorContainerNode.editorContainer, App.appNode.firstChild);
        }
    }

    export async function editor(): Promise<void> {
        //create editor container
        EditorContainerNode.createEditorContainer();

        //all editor node containers will be created in the dom regardless if they're used or not (for now)

        //create prosemirror editorview 
        PMEditorView.createEditorView();

        //set contenteditable
        PMEditorView.setContenteditable(false);
    }
}