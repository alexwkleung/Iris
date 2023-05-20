import { App } from '../../app'
import { EditorContainerNode } from '../../editor'
import { Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { defaultValueCtx } from '@milkdown/core'

export class MilkdownEditorNode {
    /**
     * Editor node
     * 
     * Reference variable for editor node
     */
    public static editorNode: HTMLDivElement;

    public static createMilkdownEditorNode(): void {
        MilkdownEditorNode.editorNode = document.createElement('div');
        MilkdownEditorNode.editorNode.setAttribute("class", "milkdown-editor-container");
        MilkdownEditorNode.editorNode.setAttribute("spellcheck", "false");

        EditorContainerNode.editorContainer.appendChild(MilkdownEditorNode.editorNode);
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
            .use(gfm)
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('.milkdown-editor-container'));
                ctx.set(defaultValueCtx, ""); //explicitly set default value for new editor
            })
            .create()
            .catch((e) => { throw console.error(e) })
            
        return MilkdownEditor.editor;
    }
}