/*
* file: `editor_state.ts`
*
* this is the file that holds the prosemirror (milkdown) editorstate
*
*/

import { Editor, rootCtx, editorViewOptionsCtx, prosePluginsCtx } from '@milkdown/core'
//import { EditorState } from '@milkdown/prose/state'
//import { EditorView } from '@milkdown/prose/view'
import { commonmark } from '@milkdown/preset-commonmark'
import { nord } from '@milkdown/theme-nord'
import { clipboard } from '@milkdown/plugin-clipboard'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
//import { block } from '@milkdown/plugin-block'
import { tooltip } from '@milkdown/plugin-tooltip'
import { slash } from '@milkdown/plugin-slash'
import { prism } from '@milkdown/plugin-prism'
//import { upload } from '@milkdown/plugin-upload'
import { trailing } from '@milkdown/plugin-trailing'
//import { listener, listenerCtx } from '@milkdown/plugin-listener'

//ProseMirrorState class
export class ProseMirrorEditor {
    //refs
    static editor: Editor;
    static readonly: boolean;
    
    public async PM_State(): Promise<Editor> {
        ProseMirrorEditor.readonly = false;

        console.log(ProseMirrorEditor.readonly);
        
        const editable = (): boolean => ProseMirrorEditor.readonly;

        ProseMirrorEditor.editor = await Editor.make()
            .use(commonmark)
            .use(gfm)
            .use(clipboard)
            .use(history)
            .use(indent)
            //.use(block)
            .use(tooltip)
            //use nord theme as the base theme to modify the stylesheet from
            //however, note that this will use material icons in order to display properly
            .use(nord)
            //need to configure slash commands
            //use https://milkdown.dev/plugin-slash 
            //for example
            .use(slash)
            .use(prism)
            //bug with images crashing app
            //may decide to remove image functionality later
            //.use(upload)
            //.use(trailing)
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('#editor'))
                ctx.set(editorViewOptionsCtx, { editable })
            })
            .create();

        return ProseMirrorEditor.editor;
    }
}