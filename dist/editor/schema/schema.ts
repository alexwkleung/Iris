/*
* file: `schema.ts`
*
* this file contains the schema for the EditorView
*
*/

import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

//basic interface to define Schema
interface SchemaDefine {
    defaultSchema: Schema;
}

//override default schema
export class OverrideDefaultSchema implements SchemaDefine {
    public defaultSchema: Schema = new Schema({
        nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        marks: schema.spec.marks
    });
}
