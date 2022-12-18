/*
* file: `editor.ts`
*
* this is the main file that holds the basic editor for Iris
* note that implementations may change over time
*
*/

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
//import { buildKeymap } from '../editor/keymap/keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { EditorObjects } from '../utilities/objects/editor_objects'
import { app } from '../app'

import '../styles/prosemirror.css'

//ProseMirror Editor Div class
export class ProseMirrorEditorDiv {
    public PMEditorDiv(): HTMLDivElement {
        const editorDiv = document.createElement('div') as HTMLDivElement;
        editorDiv.setAttribute("id", "editor");

        const contentDiv = document.createElement('div') as HTMLDivElement;
        contentDiv.setAttribute("id", "content");
        contentDiv.style.display = "none";

        return (app.appendChild(editorDiv) as HTMLDivElement) && (document.querySelector('#editor') as HTMLDivElement).appendChild(contentDiv);
    }
}

//ProseMirrorState class
class ProseMirrorState {
    public PMState(): EditorState {
        const editorState: EditorState = EditorState.create({
            doc: DOMParser.fromSchema(
                EditorObjects.OvrDefSchema.defaultSchema
            ).parse(document.querySelector('#content') as HTMLDivElement),
            plugins: [
                //inputRules
                EditorObjects.DefInputRules.buildInputRules(
                    EditorObjects.OvrDefSchema.defaultSchema
                ),
                keymap(baseKeymap),
                //keymap(buildKeymap(OverrideDefaultSchema.defaultSchema)),
                dropCursor(),
                gapCursor()
            ]
        });

        return editorState;
    }
}

//ProseMirror View class
export class ProseMirrorView extends ProseMirrorState {
    public PMView(): EditorView { 
        const editorView: EditorView = new EditorView(document.querySelector('#editor'), {
            state: this.PMState()
        });

        return editorView;
    }
}