import { EditorContainerNode } from '../../editor'
import { Editor, rootCtx, editorViewOptionsCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { defaultValueCtx } from '@milkdown/core'
import { prism } from '@milkdown/plugin-prism'
import { indent } from '@milkdown/plugin-indent'
import { clipboard } from '@milkdown/plugin-clipboard'
import { history } from '@milkdown/plugin-history'

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
        //disabling spellcheck (somewhat) helps performance for contenteditable divs
        MilkdownEditorNode.editorNode.setAttribute("spellcheck", "false");
        //setting aria-hidden to true removes unnecessary hidden nodes in the accessibility tree
        //correlates to content-visibility in css for performance
        MilkdownEditorNode.editorNode.setAttribute("aria-hidden", "true");
        EditorContainerNode.editorContainer.appendChild(MilkdownEditorNode.editorNode);
    }
}

export class MilkdownEditor {
    /**
     * Milkdown editor readonly variable
     * 
     * `false` enables readonly 
     * 
     * `true` disables readonly
     */
    public static readonly: boolean;

    /**
     * Editor
     * 
     * Reference variable for Milkdown editor
     */
    public static editor: Editor;

    public static async createEditor(): Promise<Editor> {
        //set readonly to false (enables readonly)
        MilkdownEditor.readonly = false;

        const editable = (): boolean => {
            return MilkdownEditor.readonly;
        }

        MilkdownEditor.editor = await Editor.make()
            .use(commonmark)
            .use(gfm)
            .use(prism)
            .use(indent)
            .use(clipboard)
            .use(history)
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('.milkdown-editor-container'));
                ctx.set(defaultValueCtx, ""); //explicitly set default value for new editor
                ctx.update(editorViewOptionsCtx, () => ({
                    editable,
                }))
            })
            .create()
            .catch((e) => { throw console.error(e) })
            
        return MilkdownEditor.editor;
    }
}