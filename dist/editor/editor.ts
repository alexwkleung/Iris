/*
* file: `editor.ts`
*
* this is the main file that holds the basic editor for Iris
* note that implementations may change over time
*
*/

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'
//import { keymap } from 'prosemirror-keymap'
//import { baseKeymap } from 'prosemirror-commands'
import { overrideDefaultSchema } from './schema/schema'

export class ProseMirrorEditorDiv {
    public editorDivFn() {
        const app = document.querySelector('#app') as HTMLElement;
        const editorDiv = document.createElement('div') as HTMLDivElement;
        editorDiv.setAttribute("id", "editor");

        const contentDiv = document.createElement('div') as HTMLDivElement;
        contentDiv.setAttribute("id", "content");
        contentDiv.style.display = "none";

        return app.appendChild(editorDiv) as HTMLDivElement && (document.querySelector('#editor') as HTMLDivElement).appendChild(contentDiv);
    }
}

//default schema
const defaultSchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
});

//class for prosemirror view
export class ProseMirrorView {
    public PMView() { 
        const editorState = EditorState.create({
            //schema: schema,
            doc: DOMParser.fromSchema(overrideDefaultSchema).parse(document.querySelector('#content') as HTMLDivElement),
            plugins: 
            /*[
                keymap(baseKeymap),
                inputRules({
                    rules: [],
                })
            ]
            */
            exampleSetup({
                schema: overrideDefaultSchema
            })
        });

        const editorView = new EditorView(document.querySelector('#editor'), {
            state: editorState
        });
    }
}