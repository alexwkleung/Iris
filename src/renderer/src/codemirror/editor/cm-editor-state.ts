import { EditorState } from '@codemirror/state'
import { keymap, rectangularSelection, drawSelection } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'

export class CMEditorState {
    /**
     * Editor state reference variable
     * 
     * @static
     */
    public static editorState: EditorState;

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
                    ...defaultKeymap,
                    ...historyKeymap
                ]),
                EditorView.lineWrapping
            ]
        })
        
        return CMEditorState.editorState;
    }
}