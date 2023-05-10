/*
* file: `cm_theme.ts`
*
* this file holds the theme for the codemirror editor
*
*/

import { EditorView } from "@codemirror/view"
import { Extension } from "@codemirror/state"

/**
 * CM_Theme variable
 * 
 * Theme for the CodeMirror editor
 * 
 * @returns Extension
 */
export const CM_Theme: Extension = EditorView.theme({
    '.cm-cursor, .cm-dropCursor': { 
        borderLeftColor: '#DDDDDD' 
    },
    '&': {
        fontSize: "20px",
      },
});