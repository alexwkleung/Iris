import { EditorState, Compartment } from '@codemirror/state'
import { 
    keymap, 
    rectangularSelection, 
    drawSelection, 
    highlightActiveLine 
} from '@codemirror/view'
import { 
    defaultKeymap, 
    indentWithTab, 
    history, 
    historyKeymap
} from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { bracketMatching } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
//CodeMirror EditorState class
export class CodeMirror_EditorState {
    //ref
    static editorState: EditorState;

    //CodeMirror Editor State function
    static CodeMirror_EditorState(): EditorState {
        CodeMirror_EditorState.editorState = EditorState.create({
            extensions: [
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages
                }),
                history(),
                rectangularSelection(),
                drawSelection(),
                highlightActiveLine(),
                bracketMatching(),
                keymap.of([
                    ...defaultKeymap,
                    ...[indentWithTab],
                    ...historyKeymap
                ])
            ]
        });

        return CodeMirror_EditorState.editorState;
    }   
}
