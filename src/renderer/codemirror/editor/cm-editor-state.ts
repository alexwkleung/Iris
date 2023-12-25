import { EditorState } from "@codemirror/state";
import { keymap, rectangularSelection, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, standardKeymap, indentWithTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { Compartment } from "@codemirror/state";
import { cursors } from "../extensions/cursor-extension/cursors";
import { closeBrackets } from "@codemirror/autocomplete";
import { irisEditorStyle } from "../extensions/editor-extension/editor-style";

export class CMEditorState {
    /**
     * Editor state reference variable
     *
     * @static
     */
    public static editorState: EditorState;

    public static cursorCompartment: Compartment = new Compartment();

    public static editorCompartment: Compartment = new Compartment();

    /**
     * Create editor state
     *
     * @static
     *
     * @returns EditorState
     */
    public static createEditorState(): EditorState {
        CMEditorState.editorState = EditorState.create({
            extensions: [
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                }),
                rectangularSelection(),
                drawSelection(),
                history(),
                keymap.of([...standardKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
                closeBrackets(),
                EditorView.lineWrapping, //in case global fails
                this.cursorCompartment.of(cursors[0]),
                this.editorCompartment.of(irisEditorStyle(false)),
            ],
        });

        console.log("cm state");

        return CMEditorState.editorState;
    }
}
