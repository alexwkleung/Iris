/*
* file: `editor_state.ts`
*
* this is the file that holds the prosemirror (milkdown) editorstate
*
* note that implementations may change over time
*
*/

import { Editor, rootCtx, editorViewOptionsCtx } from '@milkdown/core'
//import { EditorState } from '@milkdown/prose/state'
//import { EditorView } from '@milkdown/prose/view'
import { commonmark } from '@milkdown/preset-commonmark'
import { tokyo } from '@milkdown/theme-tokyo'
import { clipboard } from '@milkdown/plugin-clipboard'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { block } from '@milkdown/plugin-block'
import { tooltip } from '@milkdown/plugin-tooltip'
import { math } from '@milkdown/plugin-math'
import { slash } from '@milkdown/plugin-slash'
import { prism } from '@milkdown/plugin-prism'
import { upload } from '@milkdown/plugin-upload'
//import { listener, listenerCtx } from '@milkdown/plugin-listener'

//ProseMirrorState class
export class ProseMirrorEditor {
    static editor: Editor;

    public async PMState(): Promise<Editor> {
        ProseMirrorEditor.editor = await Editor.make()
            .use(commonmark)
            .use(gfm)
            .use(clipboard)
            .use(history)
            .use(indent)
            .use(block)
            .use(tooltip)
            .use(math)
            //use tokyo theme as the base theme to modify the stylesheet from
            //however, note that this will use material icons in order to display properly
            .use(tokyo)
            //configure slash commands
            //taken/referenced from example usage: https://milkdown.dev/plugin-slash
            .use(slash)
            .use(prism)
            .use(upload) //bug with images crashing
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('#editor'))
            })
            .create();

        return ProseMirrorEditor.editor;
    }
}