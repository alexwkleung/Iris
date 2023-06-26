import { EditorState } from '@codemirror/state'
import { keymap, rectangularSelection, drawSelection } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, standardKeymap, indentWithTab } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'
import { Compartment } from '@codemirror/state'
import { cursors } from '../extensions/cursors'

export class CMEditorState {
    /**
     * Editor state reference variable
     * 
     * @static
     */
    public static editorState: EditorState;
    
    public static cursorCompartment: Compartment = new Compartment();

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
                    codeLanguages: languages
                }),
                rectangularSelection(),
                drawSelection(),
                history(),
                keymap.of([
                    ...standardKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                    indentWithTab
                ]),
                EditorView.lineWrapping,
                this.cursorCompartment.of(cursors[0])
            ]
        });
        
        //dispatch
        //CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) })

        console.log("cm state");

        return CMEditorState.editorState;
    }
}