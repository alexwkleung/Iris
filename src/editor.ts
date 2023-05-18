import { MilkdownEditorNode/*, MilkdownEditor*/ } from "./milkdown/milkdown-editor"

function editor() {
    //milkdown
    MilkdownEditorNode.createMilkdownEditorNode();

    //for testing purposes, spawn editors in here initially
    //all editor node containers will be created in the dom regardless if they're used or not (for now)

    //MilkdownEditor.createEditor();
}
editor();
