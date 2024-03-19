//base taken from: https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/index.ts
// Defines a parser and serializer for [CommonMark](http://commonmark.org/) text.

export { schema } from "./schema";
export { defaultMarkdownParser, MarkdownParser, type ParseSpec } from "./from_markdown";
export { MarkdownSerializer, defaultMarkdownSerializer, MarkdownSerializerState } from "./to_markdown";
