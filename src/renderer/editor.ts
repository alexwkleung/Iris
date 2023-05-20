import { App } from "./app"
import { MilkdownEditorNode, MilkdownEditor } from "./src/milkdown/milkdown-editor"

export class EditorContainerNode {
    public static editorContainer: HTMLDivElement;

    public static createEditorContainer(): void {
        EditorContainerNode.editorContainer = document.createElement('div');
        EditorContainerNode.editorContainer.setAttribute("id", "editor-container");
        App.appNode.insertBefore(EditorContainerNode.editorContainer, App.appNode.firstChild);
    }
}

async function editor(): Promise<void> {
    EditorContainerNode.createEditorContainer();
    
    //milkdown
    MilkdownEditorNode.createMilkdownEditorNode();

    //for testing purposes, spawn editors in here initially
    //all editor node containers will be created in the dom regardless if they're used or not (for now)

    await MilkdownEditor.createEditor();
}
editor();
