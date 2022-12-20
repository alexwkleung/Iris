/*
* file: `editor_view.ts`
*
* this is the file that holds the prosemirror
* editorview for Iris
*
* note that implementations may change over time
*
*/

import { EditorView } from 'prosemirror-view'
import { ProseMirrorState } from '../../editor/editorstate/editor_state'

//ProseMirror View class
export class ProseMirrorView extends ProseMirrorState {
    static editorView: EditorView;

    public PMView(): EditorView { 
        ProseMirrorView.editorView = new EditorView(document.querySelector('#editor'), {
            state: this.PMState(),
        });

        return ProseMirrorView.editorView;
    }
}