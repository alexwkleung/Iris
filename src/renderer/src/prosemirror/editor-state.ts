import { EditorState } from "prosemirror-state"
import { DOMParser } from "prosemirror-model"
import { exampleSetup } from "prosemirror-example-setup"
import { schema } from "prosemirror-markdown"

export class PMEditorState {
    /**
     * Reference variable for prosemirror editor state
     * 
     * @static 
     */
    public static editorState: EditorState;

    /**
     * Create editor state
     * 
     * @returns Created editor state
     * 
     * @static
     */
    public static createEditorState(): EditorState {
        PMEditorState.editorState = EditorState.create({
            doc: DOMParser.fromSchema(schema).parse(document.querySelector("#editor-container") as HTMLElement),
            plugins: exampleSetup({ schema })
        });

        return PMEditorState.editorState;
    }
}