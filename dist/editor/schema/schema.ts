/*
* file: `schema.ts`
*
* this file contains the schema for the EditorView
*
*/

import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

//interface to define Schema 
interface DefineSchema {
    defaultSchema: Schema;
}

//override default schema
export class OverrideDefaultSchema implements DefineSchema {
    public defaultSchema: Schema = new Schema({
        nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        marks: schema.spec.marks
    });
}
