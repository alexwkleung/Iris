/*
* file: `cm_editor_state.ts`
*
* this file holds the editor state for the codemirror editor
*
*/

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
import { CM_Theme } from '../cm_theme/cm_theme'
import { EditorView } from '@codemirror/view'

//CodeMirror EditorState class
/**
 * @class CodeMirror_EditorState
 * 
 * @file `cm_editor_state.ts`
 */
export class CodeMirror_EditorState {
    /**
     * editorState variable
     * 
     * @member static
     * @returns EditorState
     */
    static editorState: EditorState;
    
    /**
     * @function CodeMirror EditorState
     * @returns EditorState
     */
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
                CM_Theme,
                EditorView.lineWrapping
            ]
        });

        return CodeMirror_EditorState.editorState;
    }   
}
