import { Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { App } from '../app'

export class MilkdownEditorNode {
    /**
     * Editor node
     * 
     * Reference variable for editor node
     */
    public static editorNode: HTMLDivElement;

    public static createMilkdownEditorNode() {
        MilkdownEditorNode.editorNode = document.createElement('div');
        MilkdownEditorNode.editorNode.setAttribute("id", "milkdown-editor-container");
        MilkdownEditorNode.editorNode.setAttribute("spellcheck", "false");

        App.appNode.appendChild(MilkdownEditorNode.editorNode);
    }
}

export class MilkdownEditor {
    /**
     * Editor
     * 
     * Reference variable for Milkdown editor
     */
    public static editor: Editor;

    public static async createEditor(): Promise<Editor> {
        MilkdownEditor.editor = await Editor.make()
            .use(commonmark)
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('#milkdown-editor-container'))
            })
            .create()
            .catch((e) => { throw console.error(e) })
    
        return MilkdownEditor.editor;
    }
}