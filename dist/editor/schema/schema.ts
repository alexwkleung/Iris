/*
* file: `schema.ts`
*
* this file contains the schema for the EditorView
*
*/

import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

//override default schema
export const overrideDefaultSchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
});
