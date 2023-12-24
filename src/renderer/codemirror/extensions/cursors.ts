//base taken from: https://github.com/alexwkleung/CM6-Demo/blob/main/src/themes/cursors.ts

import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

//cursor colour
const light = "#000000";
const dark = "#FFFFFF";

const defaultCursorLightTheme = EditorView.theme({
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: light },
});

const defaultCursorDarkTheme = EditorView.theme({
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: dark },
});

//block cursor
const blockCursor = EditorView.theme({
    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: dark,
        borderLeft: "2px solid",
        borderRight: "0.75em solid",
        opacity: "0.5",
    },
});

//default cursor extension
const defaultCursorLight: Extension = [defaultCursorLightTheme];

const defaultCursorDark: Extension = [defaultCursorDarkTheme];

//block cursor extension
const blockCursorMod: Extension = [blockCursor];

//export cursors
export const cursors = [
    {
        extension: defaultCursorLight,
        cursor: "Default Cursor Light",
    },
    {
        extension: defaultCursorDark,
        cursor: "Default Cursor Dark",
    },
    {
        extension: blockCursorMod,
        cursor: "Block Cursor",
    },
];
