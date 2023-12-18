import { EditorState } from "prosemirror-state"
import { DOMParser } from "prosemirror-model"
import { pmSetup } from "./prosemirror-setup"
import { schema } from "../markdown/export"

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
            plugins: pmSetup({
                schema,
                floatingMenu: false
            })
        });

        return PMEditorState.editorState;
    }
}