/* 
* file: `inputrules.ts`
*
* this file holds the input rules that are configured to be used with the 
* given schema in the file `editor.ts`
* 
* the current implementation of input rules is based off and 
* referenced from https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/index.ts
*
*/

import { inputRules, wrappingInputRule, textblockTypeInputRule, smartQuotes, emDash, ellipsis } from 'prosemirror-inputrules'
import { NodeType, Schema } from 'prosemirror-model'

export class DefaultInputRules {
    public blockQuoteRule(nodeType: NodeType) {
        return wrappingInputRule(/^\s*>\s$/, nodeType);
    }

    public orderedListRule(nodeType: NodeType) {
        return wrappingInputRule(
            /^(\d+)\.\s$/, 
            nodeType, 
            match => ({
            order: +match[1]
        }), 
        (match, node) => node.childCount + node.attrs.order == +match[1]);
    }

    public bulletListRule(nodeType: NodeType) {
               
    }
}