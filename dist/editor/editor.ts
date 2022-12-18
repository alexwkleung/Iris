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
import { LocalFileDirectory } from '../utilities/filedirectory/file_directory'

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
    private LFDirectory = new LocalFileDirectory() as LocalFileDirectory;

    public editorState: EditorState;
    //public initialDoc: Node | undefined | any;

    public PMState(): EditorState {
        console.log(this.LFDirectory.openFileString);

        /*
        Promise.resolve(this.LFDirectory.OpenLF()).then(() => {
            console.log(typeof this.LFDirectory.openFileString);
            openFileStringTextNode = document.createTextNode(this.LFDirectory.openFileString);
            console.log(openFileStringTextNode);
            //(document.querySelector('#content') as HTMLDivElement).appendChild(openFileStringTextNode);
        });
        */

        //console.log(this.initialDoc);

        this.editorState = EditorState.create({
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
            ],
        });

        //console.log(openFileStringTextNode);

        return this.editorState;
    }
}

//ProseMirror View class
export class ProseMirrorView extends ProseMirrorState {
    public editorView: EditorView;

    public PMView(): EditorView { 
        this.editorView = new EditorView(document.querySelector('#editor'), {
            state: this.PMState(),
        });

        return this.editorView;
    }
}