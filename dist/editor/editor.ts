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
//import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
//import { buildKeymap } from '../editor/keymap/keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { EditorObjects } from '../utils/editor-objects'

import '../styles/prosemirror.css'

//ProseMirror Editor Div class
export class ProseMirrorEditorDiv {
    public editorDivFn() {
        const app = document.querySelector('#app') as HTMLElement;
        const editorDiv = document.createElement('div') as HTMLDivElement;
        editorDiv.setAttribute("id", "editor");

        const contentDiv = document.createElement('div') as HTMLDivElement;
        contentDiv.setAttribute("id", "content");
        contentDiv.style.display = "none";

        return (app.appendChild(editorDiv) as HTMLDivElement) && (document.querySelector('#editor') as HTMLDivElement).appendChild(contentDiv);
    }
}

//ProseMirror View class
//includes EditorState within the class for now
export class ProseMirrorView {
    public PMView() { 
        const editorState = EditorState.create({
            doc: DOMParser.fromSchema(EditorObjects.OvrDefSchema.defaultSchema).parse(document.querySelector('#content') as HTMLDivElement),
            plugins: [
                //inputRules
                EditorObjects.DefInputRules.buildInputRules(EditorObjects.OvrDefSchema.defaultSchema),
                keymap(baseKeymap),
                //keymap(buildKeymap(OverrideDefaultSchema.defaultSchema)),
                dropCursor(),
                gapCursor()
            ]
            //exampleSetup({
                //schema: OverrideDefaultSchema.defaultSchema
            //})
        });

        const editorView = new EditorView(document.querySelector('#editor'), {
            state: editorState
        });
    }
}