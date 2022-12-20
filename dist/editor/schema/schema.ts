/*
* file: `schema.ts`
*
* this file contains the schema for the EditorView
*
* base schema is taken directly from https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.ts
* and will be modified later on with specific customizations
*
*/

import { Schema, NodeSpec, MarkSpec, DOMOutputSpec } from 'prosemirror-model'
//import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { DefaultInputRules } from '../inputrules/inputrules'

const pDOM: DOMOutputSpec = ["p", 0], blockquoteDOM: DOMOutputSpec = ["blockquote", 0],
      hrDOM: DOMOutputSpec = ["hr"], preDOM: DOMOutputSpec = ["pre", ["code", 0]],
      brDOM: DOMOutputSpec = ["br"]

/// [Specs](#model.NodeSpec) for the nodes defined in this schema.
const nodes = {
  /// NodeSpec The top level document node.
  doc: {
    content: "block+"
  } as NodeSpec,

  /// A plain paragraph textblock. Represented in the DOM
  /// as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{tag: "p"}],
    toDOM() { return pDOM }
  } as NodeSpec,

  /// A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{tag: "blockquote"}],
    toDOM() { return blockquoteDOM }
  } as NodeSpec,

  /// A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: "block",
    parseDOM: [{tag: "hr"}],
    toDOM() { return hrDOM }
  } as NodeSpec,

  /// A heading textblock, with a `level` attribute that
  /// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  /// `<h6>` elements.
  heading: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h1", attrs: {level: 1}},
               {tag: "h2", attrs: {level: 2}},
               {tag: "h3", attrs: {level: 3}},
               {tag: "h4", attrs: {level: 4}},
               {tag: "h5", attrs: {level: 5}},
               {tag: "h6", attrs: {level: 6}}],
    toDOM(node) { return ["h" + node.attrs.level, 0] }
  } as NodeSpec,

  /// A code listing. Disallows marks or non-text inline
  /// nodes by default. Represented as a `<pre>` element with a
  /// `<code>` element inside of it.
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
    toDOM() { return preDOM }
  } as NodeSpec,

  /// The text node.
  text: {
    group: "inline"
  } as NodeSpec,

  /// An inline image (`<img>`) node. Supports `src`,
  /// `alt`, and `href` attributes. The latter two default to the empty
  /// string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: {default: null},
      title: {default: null}
    },
    group: "inline",
    draggable: true,
    parseDOM: [{tag: "img[src]", getAttrs(dom: HTMLElement) {
      return {
        src: dom.getAttribute("src"),
        title: dom.getAttribute("title"),
        alt: dom.getAttribute("alt")
      }
    }}],
    toDOM(node) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
  } as NodeSpec,

  /// A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM() { return brDOM }
  } as NodeSpec
}

const emDOM: DOMOutputSpec = ["em", 0], strongDOM: DOMOutputSpec = ["strong", 0], codeDOM: DOMOutputSpec = ["code", 0]

/// [Specs](#model.MarkSpec) for the marks in the schema.
const marks = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  link: {
    attrs: {
      href: {},
      title: {default: null}
    },
    inclusive: false,
    parseDOM: [{tag: "a[href]", getAttrs(dom: HTMLElement) {
      return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
    }}],
    toDOM(node) { let {href, title} = node.attrs; return ["a", {href, title}, 0] }
  } as MarkSpec,

  /// An emphasis mark. Rendered as an `<em>` element. Has parse rules
  /// that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
    toDOM() { return emDOM }
  } as MarkSpec,

  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [{tag: "strong"},
               // This works around a Google Docs misbehavior where
               // pasted content will be inexplicably wrapped in `<b>`
               // tags with a font-weight normal.
               {tag: "b", getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null},
               {style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
    toDOM() { return strongDOM }
  } as MarkSpec,

  /// Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{tag: "code"}],
    toDOM() { return codeDOM }
  } as MarkSpec
}

/// This schema roughly corresponds to the document schema used by
/// [CommonMark](http://commonmark.org/), minus the list elements,
/// which are defined in the [`prosemirror-schema-list`](#schema-list)
/// module.
///
/// To reuse elements from this schema, extend or read from its
/// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
const schema = new Schema({
    nodes, 
    marks
});

//interface to define Schema 
interface DefineSchema {
    defaultSchema: Schema;
}

//override default schema
//inherit DefaultInputRules so it can be passed to the editor state later
//
export class OverrideDefaultSchema extends DefaultInputRules implements DefineSchema {
    public defaultSchema: Schema =  new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: schema.spec.marks
    });
    /*new Schema({
      nodes: {
        doc: {
          content: "block+"
        },
    
        paragraph: {
          content: "inline*",
          group: "block",
          parseDOM: [{tag: "p"}],
          toDOM() { return ["p", 0] }
        },
    
        blockquote: {
          content: "block+",
          group: "block",
          parseDOM: [{tag: "blockquote"}],
          toDOM() { return ["blockquote", 0] }
        },
    
        horizontal_rule: {
          group: "block",
          parseDOM: [{tag: "hr"}],
          toDOM() { return ["div", ["hr"]] }
        },
    
        heading: {
          attrs: {level: {default: 1}},
          content: "(text | image)*",
          group: "block",
          defining: true,
          parseDOM: [{tag: "h1", attrs: {level: 1}},
                     {tag: "h2", attrs: {level: 2}},
                     {tag: "h3", attrs: {level: 3}},
                     {tag: "h4", attrs: {level: 4}},
                     {tag: "h5", attrs: {level: 5}},
                     {tag: "h6", attrs: {level: 6}}],
          toDOM(node) { return ["h" + node.attrs.level, 0] }
        },
    
        code_block: {
          content: "text*",
          group: "block",
          code: true,
          defining: true,
          marks: "",
          attrs: {params: {default: ""}},
          parseDOM: [{tag: "pre", preserveWhitespace: "full", getAttrs: node => (
            {params: (node as HTMLElement).getAttribute("data-params") || ""}
          )}],
          toDOM(node) { return ["pre", node.attrs.params ? {"data-params": node.attrs.params} : {}, ["code", 0]] }
        },
    
        ordered_list: {
          content: "list_item+",
          group: "block",
          attrs: {order: {default: 1}, tight: {default: false}},
          parseDOM: [{tag: "ol", getAttrs(dom) {
            return {order: (dom as HTMLElement).hasAttribute("start") ? +(dom as HTMLElement).getAttribute("start")! : 1,
                    tight: (dom as HTMLElement).hasAttribute("data-tight")}
          }}],
          toDOM(node) {
            return ["ol", {start: node.attrs.order == 1 ? null : node.attrs.order,
                           "data-tight": node.attrs.tight ? "true" : null}, 0]
          }
        },
    
        bullet_list: {
          content: "list_item+",
          group: "block",
          attrs: {tight: {default: false}},
          parseDOM: [{tag: "ul", getAttrs: dom => ({tight: (dom as HTMLElement).hasAttribute("data-tight")})}],
          toDOM(node) { return ["ul", {"data-tight": node.attrs.tight ? "true" : null}, 0] }
        },
    
        list_item: {
          content: "paragraph block*",
          defining: true,
          parseDOM: [{tag: "li"}],
          toDOM() { return ["li", 0] }
        },
    
        text: {
          group: "inline"
        },
    
        image: {
          inline: true,
          attrs: {
            src: {},
            alt: {default: null},
            title: {default: null}
          },
          group: "inline",
          draggable: true,
          parseDOM: [{tag: "img[src]", getAttrs(dom) {
            return {
              src: (dom as HTMLElement).getAttribute("src"),
              title: (dom as HTMLElement).getAttribute("title"),
              alt: (dom as HTMLElement).getAttribute("alt")
            }
          }}],
          toDOM(node) { return ["img", node.attrs] }
        },
    
        hard_break: {
          inline: true,
          group: "inline",
          selectable: false,
          parseDOM: [{tag: "br"}],
          toDOM() { return ["br"] }
        }
      },
    
      marks: {
        em: {
          parseDOM: [{tag: "i"}, {tag: "em"},
                     {style: "font-style", getAttrs: value => value == "italic" && null}],
          toDOM() { return ["em"] }
        },
    
        strong: {
          parseDOM: [{tag: "b"}, {tag: "strong"},
                     {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null}],
          toDOM() { return ["strong"] }
        },
    
        link: {
          attrs: {
            href: {},
            title: {default: null}
          },
          inclusive: false,
          parseDOM: [{tag: "a[href]", getAttrs(dom) {
            return {href: (dom as HTMLElement).getAttribute("href"), title: (dom as HTMLElement).getAttribute("title")}
          }}],
          toDOM(node) { return ["a", node.attrs] }
        },
    
        code: {
          parseDOM: [{tag: "code"}],
          toDOM() { return ["code"] }
        }
      }
    })
    */
}
