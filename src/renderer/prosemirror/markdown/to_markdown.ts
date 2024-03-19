//base taken from: https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts

import { Node, Mark } from "prosemirror-model";

type MarkSerializerSpec = {
    /// The string that should appear before a piece of content marked
    /// by this mark, either directly or as a function that returns an
    /// appropriate string.
    open: string | ((state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string);
    /// The string that should appear after a piece of content marked by
    /// this mark.
    close: string | ((state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string);
    /// When `true`, this indicates that the order in which the mark's
    /// opening and closing syntax appears relative to other mixable
    /// marks can be varied. (For example, you can say `**a *b***` and
    /// `*a **b***`, but not `` `a *b*` ``.)
    mixable?: boolean;
    /// When enabled, causes the serializer to move enclosing whitespace
    /// from inside the marks to outside the marks. This is necessary
    /// for emphasis marks as CommonMark does not permit enclosing
    /// whitespace inside emphasis marks, see:
    /// http:///spec.commonmark.org/0.26/#example-330
    expelEnclosingWhitespace?: boolean;
    /// Can be set to `false` to disable character escaping in a mark. A
    /// non-escaping mark has to have the highest precedence (must
    /// always be the innermost mark).
    escape?: boolean;
};

/// A specification for serializing a ProseMirror document as
/// Markdown/CommonMark text.
export class MarkdownSerializer {
    /// Construct a serializer with the given configuration. The `nodes`
    /// object should map node names in a given schema to function that
    /// take a serializer state and such a node, and serialize the node.
    constructor(
        /// The node serializer functions for this serializer.
        readonly nodes: {
            [node: string]: (state: MarkdownSerializerState, node: Node, parent: Node, index: number) => void;
        },
        /// The mark serializer info.
        readonly marks: { [mark: string]: MarkSerializerSpec },
        readonly options: {
            /// Extra characters can be added for escaping. This is passed
            /// directly to String.replace(), and the matching characters are
            /// preceded by a backslash.
            escapeExtraCharacters?: RegExp;
            /// Specify the node name of hard breaks.
            /// Defaults to "hard_break"
            hardBreakNodeName?: string;
        } = {}
    ) {}

    /// Serialize the content of the given node to
    /// [CommonMark](http://commonmark.org/).
    //eslint-disable-next-line
    serialize(
        content: Node,
        options: {
            /// Whether to render lists in a tight style. This can be overridden
            /// on a node level by specifying a tight attribute on the node.
            /// Defaults to false.
            tightLists?: boolean;
        } = {}
    ) {
        options = Object.assign({}, this.options, options);
        const state = new MarkdownSerializerState(this.nodes, this.marks, options);
        state.renderContent(content);
        return state.out;
    }
}

/// A serializer for the [basic schema](#schema).
export const defaultMarkdownSerializer = new MarkdownSerializer(
    {
        //eslint-disable-next-line
        blockquote(state, node) {
            state.wrapBlock("> ", null, node, () => state.renderContent(node));
        },
        //eslint-disable-next-line
        code_block(state, node) {
            // Make sure the front matter fences are longer than any dash sequence within it
            const backticks = node.textContent.match(/`{3,}/gm);
            const fence = backticks ? backticks.sort().slice(-1)[0] + "`" : "```";

            state.write(fence + (node.attrs.params || "") + "\n");
            state.text(node.textContent, false);
            // Add a newline to the current content before adding closing marker
            state.write("\n");
            state.write(fence);
            state.closeBlock(node);
        },
        //eslint-disable-next-line
        heading(state, node) {
            state.write(state.repeat("#", node.attrs.level) + " ");
            state.renderInline(node);
            state.closeBlock(node);
        },
        //eslint-disable-next-line
        horizontal_rule(state, node) {
            state.write(node.attrs.markup || "---");
            state.closeBlock(node);
        },
        //eslint-disable-next-line
        bullet_list(state, node) {
            state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
        },
        //eslint-disable-next-line
        ordered_list(state, node) {
            const start = node.attrs.order || 1;
            const maxW = String(start + node.childCount - 1).length;
            const space = state.repeat(" ", maxW + 2);
            state.renderList(node, space, (i) => {
                const nStr = String(start + i);
                return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
            });
        },
        //eslint-disable-next-line
        list_item(state, node) {
            state.renderContent(node);
        },
        //eslint-disable-next-line
        paragraph(state, node) {
            state.renderInline(node);
            state.closeBlock(node);
        },
        //eslint-disable-next-line
        image(state, node) {
            //eslint-disable-next-line
            state.write(
                "![" +
                    state.esc(node.attrs.alt || "") +
                    "](" +
                    node.attrs.src.replace(/[\(\)]/g, "\\$&") +
                    (node.attrs.title ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"' : "") +
                    ")"
            );
        },
        //eslint-disable-next-line
        hard_break(state, node, parent, index) {
            for (let i = index + 1; i < parent.childCount; i++)
                if (parent.child(i).type != node.type) {
                    state.write("\\\n");
                    return;
                }
        },
        //eslint-disable-next-line
        text(state, node) {
            state.text(node.text!, !state.inAutolink);
        },
    },
    {
        em: { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true },
        strong: { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true },
        link: {
            //eslint-disable-next-line
            open(state, mark, parent, index) {
                state.inAutolink = isPlainURL(mark, parent, index);
                return state.inAutolink ? "<" : "[";
            },
            //eslint-disable-next-line
            close(state, mark, parent, index) {
                const { inAutolink } = state;
                state.inAutolink = undefined;
                return inAutolink
                    ? ">"
                    : //eslint-disable-next-line
                      "](" +
                          mark.attrs.href.replace(/[\(\)"]/g, "\\$&") +
                          (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") +
                          ")";
            },
            mixable: true,
        },
        //eslint-disable-next-line
        code: {
            open(_state, _mark, parent, index) {
                return backticksFor(parent.child(index), -1);
            },
            //eslint-disable-next-line
            close(_state, _mark, parent, index) {
                return backticksFor(parent.child(index - 1), 1);
            },
            escape: false,
        },
    }
);

//eslint-disable-next-line
function backticksFor(node: Node, side: number) {
    //eslint-disable-next-line
    let ticks = /`+/g,
        m,
        len = 0;
    //eslint-disable-next-line
    if (node.isText) while ((m = ticks.exec(node.text!))) len = Math.max(len, m[0].length);
    let result = len > 0 && side > 0 ? " `" : "`";
    for (let i = 0; i < len; i++) result += "`";
    if (len > 0 && side < 0) result += " ";
    return result;
}

//eslint-disable-next-line
function isPlainURL(link: Mark, parent: Node, index: number) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
    const content = parent.child(index);
    if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link)
        return false;
    return index == parent.childCount - 1 || !link.isInSet(parent.child(index + 1).marks);
}

/// This is an object used to track state and expose
/// methods related to markdown serialization. Instances are passed to
/// node and mark serialization methods (see `toMarkdown`).
export class MarkdownSerializerState {
    /// @internal
    delim: string = "";
    /// @internal
    out: string = "";
    /// @internal
    closed: Node | null = null;
    /// @internal
    inAutolink: boolean | undefined = undefined;
    /// @internal
    atBlockStart: boolean = false;
    /// @internal
    inTightList: boolean = false;

    /// @internal
    constructor(
        /// @internal
        readonly nodes: {
            [node: string]: (state: MarkdownSerializerState, node: Node, parent: Node, index: number) => void;
        },
        /// @internal
        readonly marks: { [mark: string]: MarkSerializerSpec },
        /// The options passed to the serializer.
        readonly options: { tightLists?: boolean; escapeExtraCharacters?: RegExp; hardBreakNodeName?: string }
    ) {
        if (typeof this.options.tightLists == "undefined") this.options.tightLists = false;
        if (typeof this.options.hardBreakNodeName == "undefined") this.options.hardBreakNodeName = "hard_break";
    }

    /// @internal
    //eslint-disable-next-line
    flushClose(size: number = 2) {
        if (this.closed) {
            if (!this.atBlank()) this.out += "\n";
            if (size > 1) {
                let delimMin = this.delim;
                const trim = /\s+$/.exec(delimMin);
                if (trim) delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
                for (let i = 1; i < size; i++) this.out += delimMin + "\n";
            }
            this.closed = null;
        }
    }

    /// Render a block, prefixing each line with `delim`, and the first
    /// line in `firstDelim`. `node` should be the node that is closed at
    /// the end of the block, and `f` is a function that renders the
    /// content of the block.
    //eslint-disable-next-line
    wrapBlock(delim: string, firstDelim: string | null, node: Node, f: () => void) {
        const old = this.delim;
        this.write(firstDelim != null ? firstDelim : delim);
        this.delim += delim;
        f();
        this.delim = old;
        this.closeBlock(node);
    }

    /// @internal
    //eslint-disable-next-line
    atBlank() {
        return /(^|\n)$/.test(this.out);
    }

    /// Ensure the current content ends with a newline.
    //eslint-disable-next-line
    ensureNewLine() {
        if (!this.atBlank()) this.out += "\n";
    }

    /// Prepare the state for writing output (closing closed paragraphs,
    /// adding delimiters, and so on), and then optionally add content
    /// (unescaped) to the output.
    //eslint-disable-next-line
    write(content?: string) {
        this.flushClose();
        if (this.delim && this.atBlank()) this.out += this.delim;
        if (content) this.out += content;
    }

    /// Close the block for the given node.
    //eslint-disable-next-line
    closeBlock(node: Node) {
        this.closed = node;
    }

    /// Add the given text to the document. When escape is not `false`,
    /// it will be escaped.
    //eslint-disable-next-line
    text(text: string, escape = true) {
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            this.write();
            // Escape exclamation marks in front of links
            //eslint-disable-next-line
            if (!escape && lines[i][0] == "[" && /(^|[^\\])\!$/.test(this.out))
                this.out = this.out.slice(0, this.out.length - 1) + "\\!";
            this.out += escape ? this.esc(lines[i], this.atBlockStart) : lines[i];
            if (i != lines.length - 1) this.out += "\n";
        }
    }

    /// Render the given node as a block.
    //eslint-disable-next-line
    render(node: Node, parent: Node, index: number) {
        if (typeof parent == "number") throw new Error("!");
        if (!this.nodes[node.type.name])
            throw new Error("Token type `" + node.type.name + "` not supported by Markdown renderer");
        this.nodes[node.type.name](this, node, parent, index);
    }

    /// Render the contents of `parent` as block nodes.
    //eslint-disable-next-line
    renderContent(parent: Node) {
        parent.forEach((node, _, i) => this.render(node, parent, i));
    }

    /// Render the contents of `parent` as inline content.
    //eslint-disable-next-line
    renderInline(parent: Node) {
        this.atBlockStart = true;
        //eslint-disable-next-line
        let active: Mark[] = [],
            trailing = "";
        //eslint-disable-next-line
        const progress = (node: Node | null, offset: number, index: number) => {
            let marks = node ? node.marks : [];

            // Remove marks from `hard_break` that are the last node inside
            // that mark to prevent parser edge cases with new lines just
            // before closing marks.
            if (node && node.type.name === this.options.hardBreakNodeName)
                marks = marks.filter((m) => {
                    if (index + 1 == parent.childCount) return false;
                    const next = parent.child(index + 1);
                    //eslint-disable-next-line
                    return m.isInSet(next.marks) && (!next.isText || /\S/.test(next.text!));
                });

            let leading = trailing;
            trailing = "";
            // If whitespace has to be expelled from the node, adjust
            // leading and trailing accordingly.
            if (
                node &&
                node.isText &&
                marks.some((mark) => {
                    const info = this.marks[mark.type.name];
                    return (
                        info &&
                        info.expelEnclosingWhitespace &&
                        !(
                            mark.isInSet(active) ||
                            (index < parent.childCount - 1 && mark.isInSet(parent.child(index + 1).marks))
                        )
                    );
                })
            ) {
                //eslint-disable-next-line
                const [_, lead, inner, trail] = /^(\s*)(.*?)(\s*)$/m.exec(node.text!)!;
                leading += lead;
                trailing = trail;
                if (lead || trail) {
                    //eslint-disable-next-line
                    node = inner ? (node as any).withText(inner) : null;
                    if (!node) marks = active;
                }
            }

            const inner = marks.length ? marks[marks.length - 1] : null;
            const noEsc = inner && this.marks[inner.type.name].escape === false;
            const len = marks.length - (noEsc ? 1 : 0);

            // Try to reorder 'mixable' marks, such as em and strong, which
            // in Markdown may be opened and closed in different order, so
            // that order of the marks for the token matches the order in
            // active.
            outer: for (let i = 0; i < len; i++) {
                const mark = marks[i];
                if (!this.marks[mark.type.name].mixable) break;
                for (let j = 0; j < active.length; j++) {
                    const other = active[j];
                    if (!this.marks[other.type.name].mixable) break;
                    if (mark.eq(other)) {
                        if (i > j)
                            marks = marks
                                .slice(0, j)
                                .concat(mark)
                                .concat(marks.slice(j, i))
                                .concat(marks.slice(i + 1, len));
                        else if (j > i)
                            marks = marks
                                .slice(0, i)
                                .concat(marks.slice(i + 1, j))
                                .concat(mark)
                                .concat(marks.slice(j, len));
                        continue outer;
                    }
                }
            }

            // Find the prefix of the mark set that didn't change
            let keep = 0;
            while (keep < Math.min(active.length, len) && marks[keep].eq(active[keep])) ++keep;

            // Close the marks that need to be closed
            while (keep < active.length)
                //eslint-disable-next-line
                this.text(this.markString(active.pop()!, false, parent, index), false);

            // Output any previously expelled trailing whitespace outside the marks
            if (leading) this.text(leading);

            // Open the marks that need to be opened
            if (node) {
                while (active.length < len) {
                    const add = marks[active.length];
                    active.push(add);
                    this.text(this.markString(add, true, parent, index), false);
                    this.atBlockStart = false;
                }

                // Render the node. Special case code marks, since their content
                // may not be escaped.
                if (noEsc && node.isText)
                    //eslint-disable-next-line
                    this.text(
                        this.markString(inner!, true, parent, index) +
                            node.text +
                            //eslint-disable-next-line
                            this.markString(inner!, false, parent, index + 1),
                        false
                    );
                else this.render(node, parent, index);
                this.atBlockStart = false;
            }

            // After the first non-empty text node is rendered, the end of output
            // is no longer at block start.
            //
            // FIXME: If a non-text node writes something to the output for this
            // block, the end of output is also no longer at block start. But how
            // can we detect that?
            if (node?.isText && node.nodeSize > 0) {
                this.atBlockStart = false;
            }
        };
        parent.forEach(progress);
        progress(null, 0, parent.childCount);
        this.atBlockStart = false;
    }

    /// Render a node's content as a list. `delim` should be the extra
    /// indentation added to all lines except the first in an item,
    /// `firstDelim` is a function going from an item index to a
    /// delimiter for the first line of the item.
    //eslint-disable-next-line
    renderList(node: Node, delim: string, firstDelim: (index: number) => string) {
        if (this.closed && this.closed.type == node.type) this.flushClose(3);
        else if (this.inTightList) this.flushClose(1);

        const isTight = typeof node.attrs.tight != "undefined" ? node.attrs.tight : this.options.tightLists;
        const prevTight = this.inTightList;
        this.inTightList = isTight;
        node.forEach((child, _, i) => {
            if (i && isTight) this.flushClose(1);
            this.wrapBlock(delim, firstDelim(i), node, () => this.render(child, node, i));
        });
        this.inTightList = prevTight;
    }

    /// Escape the given string so that it can safely appear in Markdown
    /// content. If `startOfLine` is true, also escape characters that
    /// have special meaning only at the start of the line.
    //eslint-disable-next-line
    esc(str: string, startOfLine = false) {
        str = str.replace(
            //eslint-disable-next-line
            /[`*\\~\[\]_]/g,
            (m, i) =>
                m == "_" && i > 0 && i + 1 < str.length && str[i - 1].match(/\w/) && str[i + 1].match(/\w/)
                    ? m
                    : "\\" + m
        );
        if (startOfLine) str = str.replace(/^[#\-*+>]/, "\\$&").replace(/^(\s*\d+)\.\s/, "$1\\. ");
        if (this.options.escapeExtraCharacters) str = str.replace(this.options.escapeExtraCharacters, "\\$&");
        return str;
    }

    /// @internal
    //eslint-disable-next-line
    quote(str: string) {
        const wrap = str.indexOf('"') == -1 ? '""' : str.indexOf("'") == -1 ? "''" : "()";
        return wrap[0] + str + wrap[1];
    }

    /// Repeat the given string `n` times.
    //eslint-disable-next-line
    repeat(str: string, n: number) {
        let out = "";
        for (let i = 0; i < n; i++) out += str;
        return out;
    }

    /// Get the markdown string for a given opening or closing mark.
    //eslint-disable-next-line
    markString(mark: Mark, open: boolean, parent: Node, index: number) {
        const info = this.marks[mark.type.name];
        const value = open ? info.open : info.close;
        return typeof value == "string" ? value : value(this, mark, parent, index);
    }

    /// Get leading and trailing whitespace from a string. Values of
    /// leading or trailing property of the return object will be undefined
    /// if there is no match.
    getEnclosingWhitespace(text: string): { leading?: string; trailing?: string } {
        return {
            leading: (text.match(/^(\s+)/) || [undefined])[0],
            trailing: (text.match(/(\s+)$/) || [undefined])[0],
        };
    }
}
