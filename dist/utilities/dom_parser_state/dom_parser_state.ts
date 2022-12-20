import { DOMParser, Schema } from 'prosemirror-model'

export class DOMParserState {
    static parser(schema: Schema, domNode: Node) {
        return DOMParser.fromSchema(schema).parse(domNode);
    }
}