import { EditorState } from '@codemirror/state'
import { 
    keymap, 
    rectangularSelection, 
    drawSelection
} from '@codemirror/view'
import { 
    defaultKeymap, 
    indentWithTab, 
    history, 
    historyKeymap
} from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
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
                keymap.of([
                    ...defaultKeymap,
                    ...[indentWithTab],
                    ...historyKeymap
                ]),
                //move this theme into a separate file
                EditorView.theme({
                    '.cm-cursor, .cm-dropCursor': { 
                        borderLeftColor: '#DDDDDD' 
                    },
                    '&': {
                        fontSize: "20px",
                      },
                })
            ]
        });

        return CodeMirror_EditorState.editorState;
    }   
}
