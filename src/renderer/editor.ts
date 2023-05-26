import { App } from "./app"
import { MilkdownEditorNode, MilkdownEditor } from "./src/milkdown/milkdown-editor"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EditorNs {
    export class EditorContainerNode {
        public static editorContainer: HTMLDivElement;

        public static createEditorContainer(): void {
            EditorContainerNode.editorContainer = document.createElement('div');
            EditorContainerNode.editorContainer.setAttribute("id", "editor-container");
            App.appNode.insertBefore(EditorContainerNode.editorContainer, App.appNode.firstChild);
        }
    }

    export async function editor(): Promise<void> {
        //create editor container
        EditorContainerNode.createEditorContainer();
    
        //milkdown editor node
        MilkdownEditorNode.createMilkdownEditorNode();

        //for testing purposes, spawn editors in here initially
        //all editor node containers will be created in the dom regardless if they're used or not (for now)

        //create milkdown editor
        await MilkdownEditor.createEditor();
    }
}