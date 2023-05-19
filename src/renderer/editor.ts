import { MilkdownEditorNode, MilkdownEditor } from "./src/milkdown/milkdown-editor"

function editor(): void {
    //milkdown
    MilkdownEditorNode.createMilkdownEditorNode();

    //for testing purposes, spawn editors in here initially
    //all editor node containers will be created in the dom regardless if they're used or not (for now)

    MilkdownEditor.createEditor();
}
editor();
