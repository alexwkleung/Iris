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
import { DOMParser } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
//import { buildKeymap } from '../editor/keymap/keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { OverrideDefaultSchema } from '../schema/schema'

//ProseMirrorState class
export class ProseMirrorState extends OverrideDefaultSchema {
    static editorState: EditorState;

    public PMState(): EditorState {
        const selectContent = document.querySelector('#content') as HTMLDivElement;

        ProseMirrorState.editorState = EditorState.create({
            doc: DOMParser.fromSchema(this.defaultSchema).parse(selectContent),
            plugins: [
                this.buildInputRules(this.defaultSchema),
                keymap(baseKeymap),
                //keymap(buildKeymap(OverrideDefaultSchema.defaultSchema)),
                dropCursor(),
                gapCursor()
            ],
        });

        //editorArr.push(this.editorState.doc.toJSON());

        //console.log(this.editorState.doc.toJSON());

        //console.log(editorArr.pop());

        return ProseMirrorState.editorState;
    }
}