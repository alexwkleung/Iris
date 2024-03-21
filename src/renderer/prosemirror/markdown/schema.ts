//base taken from: https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/schema.ts
import { Schema, MarkSpec } from "prosemirror-model";

/// Document schema for the data model used by CommonMark.
export const schema = new Schema({
    nodes: {
        doc: {
            content: "block+",
        },

        paragraph: {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "p" }],
            //eslint-disable-next-line
            toDOM() {
                return ["p", 0];
            },
        },

        blockquote: {
            content: "block+",
            group: "block",
            parseDOM: [{ tag: "blockquote" }],
            //eslint-disable-next-line
            toDOM() {
                return ["blockquote", 0];
            },
        },

        horizontal_rule: {
            group: "block",
            parseDOM: [{ tag: "hr" }],
            //eslint-disable-next-line
            toDOM() {
                return ["div", ["hr"]];
            },
        },

        heading: {
            attrs: { level: { default: 1 } },
            content: "(text | image)*",
            group: "block",
            defining: true,
            parseDOM: [
                { tag: "h1", attrs: { level: 1 } },
                { tag: "h2", attrs: { level: 2 } },
                { tag: "h3", attrs: { level: 3 } },
                { tag: "h4", attrs: { level: 4 } },
                { tag: "h5", attrs: { level: 5 } },
                { tag: "h6", attrs: { level: 6 } },
            ],
            //eslint-disable-next-line
            toDOM(node) {
                return ["h" + node.attrs.level, 0];
            },
        },

        code_block: {
            content: "text*",
            group: "block",
            code: true,
            defining: true,
            marks: "",
            attrs: { params: { default: "" } },
            //eslint-disable-next-line
            parseDOM: [
                {
                    tag: "pre",
                    preserveWhitespace: "full",
                    getAttrs: (node) => ({ params: (node as HTMLElement).getAttribute("data-params") || "" }),
                },
            ],
            //eslint-disable-next-line
            toDOM(node) {
                return [
                    "pre",
                    node.attrs.params ? { "data-params": node.attrs.params } : {},
                    ["code", { class: "hljs" }, 0],
                ];
            },
        },
        ordered_list: {
            content: "list_item+",
            group: "block",
            attrs: { order: { default: 1 }, tight: { default: false } },
            //eslint-disable-next-line
            parseDOM: [
                {
                    tag: "ol",
                    getAttrs(dom) {
                        return {
                            order: (dom as HTMLElement).hasAttribute("start")
                                ? +(dom as HTMLElement).getAttribute("start")!
                                : 1,
                            tight: (dom as HTMLElement).hasAttribute("data-tight"),
                        };
                    },
                },
            ],
            //eslint-disable-next-line
            toDOM(node) {
                return [
                    "ol",
                    {
                        start: node.attrs.order == 1 ? null : node.attrs.order,
                        "data-tight": node.attrs.tight ? "true" : null,
                    },
                    0,
                ];
            },
        },

        bullet_list: {
            content: "list_item+",
            group: "block",
            attrs: { tight: { default: false } },
            //eslint-disable-next-line
            parseDOM: [{ tag: "ul", getAttrs: (dom) => ({ tight: (dom as HTMLElement).hasAttribute("data-tight") }) }],
            //eslint-disable-next-line
            toDOM(node) {
                return ["ul", { "data-tight": node.attrs.tight ? "true" : null }, 0];
            },
        },

        list_item: {
            content: "block+",
            defining: true,
            parseDOM: [{ tag: "li" }],
            //eslint-disable-next-line
            toDOM() {
                return ["li", 0];
            },
        },

        text: {
            group: "inline",
        },

        image: {
            inline: true,
            attrs: {
                src: {},
                alt: { default: null },
                title: { default: null },
            },
            group: "inline",
            draggable: true,
            //eslint-disable-next-line
            parseDOM: [
                {
                    tag: "img[src]",
                    getAttrs(dom) {
                        return {
                            src: (dom as HTMLElement).getAttribute("src"),
                            title: (dom as HTMLElement).getAttribute("title"),
                            alt: (dom as HTMLElement).getAttribute("alt"),
                        };
                    },
                },
            ],
            //eslint-disable-next-line
            toDOM(node) {
                return ["img", node.attrs];
            },
        },

        hard_break: {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{ tag: "br" }],
            //eslint-disable-next-line
            toDOM() {
                return ["br"];
            },
        },
    },

    marks: {
        em: {
            parseDOM: [
                { tag: "i" },
                { tag: "em" },
                { style: "font-style=italic" },
                //eslint-disable-next-line
                { style: "font-style=normal", clearMark: (m) => m.type.name == "em" },
            ],
            //eslint-disable-next-line
            toDOM() {
                return ["em"];
            },
        },

        strong: {
            parseDOM: [
                { tag: "strong" },
                //eslint-disable-next-line
                { tag: "b", getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null },
                //eslint-disable-next-line
                { style: "font-weight=400", clearMark: (m) => m.type.name == "strong" },
                //eslint-disable-next-line
                { style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
            ],
            toDOM() {
                return ["strong"];
            },
        } as MarkSpec,

        link: {
            attrs: {
                href: {},
                title: { default: null },
            },
            inclusive: false,
            //eslint-disable-next-line
            parseDOM: [
                {
                    tag: "a[href]",
                    getAttrs(dom) {
                        return {
                            href: (dom as HTMLElement).getAttribute("href"),
                            title: (dom as HTMLElement).getAttribute("title"),
                        };
                    },
                },
            ],
            //eslint-disable-next-line
            toDOM(node) {
                return ["a", node.attrs];
            },
        },

        code: {
            parseDOM: [{ tag: "code" }],
            //eslint-disable-next-line
            toDOM() {
                return ["code"];
            },
        },
    },
});
