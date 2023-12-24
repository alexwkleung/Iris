//initial base taken from: https://github.com/craftzdog/cm6-themes/blob/main/packages/nord/src/index.ts

import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

function irisEVTheme(dark: boolean): Extension {
    return EditorView.theme({
        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
            outline: "1px solid #8fbcbb",
        },

        "&.cm-focused .cm-matchingBracket": {
            backgroundColor: "#eceff4",
            color: "#434c5e",
        },

        ".cm-gutters": {
            backgroundColor: "#2e3440",
            color: "#4c566a",
            border: "none",
        },

        ".cm-activeLineGutter": {
            backgroundColor: "#4c566a",
            color: "#d8dee9",
        },
    });
}

/**
 * @param dark Pass `true` to enable dark styles, `false` for light/default styles
 * @returns HighlightStyle
 */
function irisHighlightStyle(dark: boolean): HighlightStyle {
    return HighlightStyle.define([
        {
            tag: t.keyword,
            color: "#5e81ac",
        },
        {
            tag: [/*t.name,*/ t.deleted, t.character, /*t.propertyName,*/ t.macroName],
            color: !dark ? "#000000" : "#ffffff",
        },
        {
            tag: t.variableName,
            color: "#8fbcbb",
        },
        {
            tag: [t.function(t.variableName)],
            color: "#8fbcbb",
        },
        {
            tag: t.labelName,
            color: "#81a1c1",
        },
        {
            tag: [t.color, t.constant(t.name), t.standard(t.name)],
            color: "#5e81ac",
        },
        {
            tag: [t.definition(t.name), t.separator],
            color: "#a3be8c",
        },
        {
            tag: t.brace,
            color: "#8fbcbb",
        },
        {
            tag: t.annotation,
            color: "#d30102",
        },
        {
            tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
            color: "#b48ead",
        },
        {
            tag: [t.typeName, t.className],
            color: "#ebcb8b",
        },
        {
            tag: [t.operator, t.operatorKeyword],
            color: "#a3be8c",
        },
        {
            tag: t.tagName,
            color: "#b48ead",
        },
        {
            tag: t.squareBracket,
            color: "#bf616a",
        },
        {
            tag: t.angleBracket,
            color: "#d08770",
        },
        {
            tag: t.attributeName,
            color: "#ebcb8b",
        },
        {
            tag: t.regexp,
            color: "#5e81ac",
        },
        {
            tag: t.quote,
            color: "#b48ead",
        },
        {
            tag: t.string,
            color: "#a3be8c",
        },
        {
            tag: t.link,
            color: "#a3be8c",
            textDecoration: "underline",
            textUnderlinePosition: "under",
        },
        {
            tag: t.escape,
            color: !dark ? "#000000" : "#ffffff",
        },
        {
            tag: t.special(t.string),
            color: "#8fbcbb",
        },
        {
            tag: t.url,
            color: "#5e5ed2",
        },
        {
            tag: t.meta,
            color: "#88c0d0",
        },
        {
            tag: t.monospace,
            color: "#6d706e",
            fontStyle: "italic",
        },
        {
            tag: t.comment,
            color: "#4c566a",
            fontStyle: "italic",
        },
        {
            tag: t.strong,
            fontWeight: "bold",
            color: "#5e81ac",
        },
        {
            tag: t.emphasis,
            fontStyle: "italic",
            color: "#5e81ac",
        },
        {
            tag: t.strikethrough,
            textDecoration: "line-through",
        },
        {
            tag: t.heading,
            fontWeight: "bold",
            color: "#5e81ac",
        },
        {
            tag: t.special(t.heading1),
            fontWeight: "bold",
            color: "#5e81ac",
        },
        {
            tag: t.heading1,
            fontWeight: "bold",
            color: !dark ? "#000000" : "#ffffff",
            fontSize: "35px",
            fontFamily: "Inter-Bold",
        },
        {
            tag: t.heading2,
            fontWeight: "bold",
            color: !dark ? "#000000" : "#ffffff",
            fontSize: "32px",
            fontFamily: "Inter-Bold",
        },
        {
            tag: t.heading3,
            fontWeight: "bold",
            color: !dark ? "#000000" : "#ffffff",
            fontSize: "29px",
            fontFamily: "Inter-Bold",
        },
        {
            tag: t.heading4,
            fontWeight: "bold",
            color: !dark ? "#000000" : "#ffffff",
            fontSize: "26px",
            fontFamily: "Inter-Bold",
        },
        {
            tag: t.heading5,
            color: !dark ? "#000000" : "#ffffff",
            fontSize: "23px",
            fontFamily: "Inter-Bold",
        },
        {
            tag: t.heading6,
            color: !dark ? "#000000" : "#ffffff",
            fontSize: "20px",
            fontFamily: "Inter-Bold",
        },
        {
            tag: [t.atom, t.bool, t.special(t.variableName)],
            color: "#d08770",
        },
        {
            tag: [t.processingInstruction, t.inserted],
            color: "grey",
        },
        {
            tag: [t.contentSeparator],
            color: !dark ? "#000000" : "#ffffff",
        },
        {
            tag: t.invalid,
            color: "#434c5e",
            borderBottom: "1px dotted #d30102",
        },
    ]);
}

/**
 * Iris editor style
 *
 * @param dark Pass `true` to enable dark styles, `false` for light/default styles
 * @returns Extension
 */
export const irisEditorStyle = (dark: boolean): Extension => {
    return [irisEVTheme(dark), syntaxHighlighting(irisHighlightStyle(dark))];
};
