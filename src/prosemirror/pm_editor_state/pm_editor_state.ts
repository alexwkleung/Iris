/*
* file: `pm_editor_state.ts`
*
* this file that holds the prosemirror (milkdown) editorstate
*
*/

import { Editor, rootCtx, editorViewOptionsCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { nord } from '@milkdown/theme-nord'
import { clipboard } from '@milkdown/plugin-clipboard'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { tooltip } from '@milkdown/plugin-tooltip'
import { slash } from '@milkdown/plugin-slash'
import { prism } from '@milkdown/plugin-prism'
import { upload } from '@milkdown/plugin-upload'

//ProseMirrorState class
export class ProseMirrorEditor {
    //refs
    static editor: Editor;
    static readonly: boolean;
    
    public async PM_State(): Promise<Editor> {
        //set initial readonly
        ProseMirrorEditor.readonly = false;
        
        //editable bool
        const editable = (): boolean => ProseMirrorEditor.readonly;

        //create editor
        ProseMirrorEditor.editor = await Editor.make()
            .use(commonmark)
            .use(gfm)
            .use(clipboard)
            .use(history)
            .use(indent)
            .use(tooltip)
            .use(nord)
            .use(slash)
            .use(prism)
            .use(upload)
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('#editor'))
                ctx.set(editorViewOptionsCtx, { editable })
            })
            .create();

        return ProseMirrorEditor.editor;
    }
}