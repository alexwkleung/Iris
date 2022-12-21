/*
* file: `editor_state.ts`
*
* this is the file that holds the prosemirror
* editorstate for Iris
*
* note that implementations may change over time
*
*/

import { EditorState } from 'prosemirror-state'
import { Editor, rootCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { tokyo } from '@milkdown/theme-tokyo'
import { listener, listenerCtx } from '@milkdown/plugin-listener'

//ProseMirrorState class
export class ProseMirrorEditor {
    //static editorState: EditorState;

    static editor: Editor;

    public async PMState() {
        ProseMirrorEditor.editor = await Editor.make()
            .use(commonmark)
            .use(tokyo)
            .config((ctx) => {
                ctx.set(rootCtx, document.querySelector('#editor'))
            })
            .create();

        return ProseMirrorEditor.editor;
    }
}