/* 
* file: `inputrules.ts`
*
* this file holds the input rules that are configured to be used with 
* the given schema in the file `editor.ts`
* 
* the current implementation of input rules is based off and 
* referenced from https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/index.ts
*
*/

import { 
    InputRule, 
    inputRules, 
    wrappingInputRule, 
    textblockTypeInputRule, 
    smartQuotes, 
    emDash, 
    ellipsis 
} from 'prosemirror-inputrules'
import { NodeType, Schema } from 'prosemirror-model'

//interface to define input rules 
interface inputRulesType {
    blockQuoteRule: InputRule;
    orderedListRule: InputRule;
    bulletListRule: InputRule;
    headingRule: InputRule;
}

//Default Input Rules class
export class DefaultInputRules implements inputRulesType {
    //block quote rule
    public blockQuoteRule(nodeType: NodeType) {
        return wrappingInputRule(/^\s*>\s$/, nodeType);
    }

    //ordered list rule
    public orderedListRule(nodeType: NodeType) {
        return wrappingInputRule(
            /^(\d+)\.\s$/, 
            nodeType, 
            (match) => ({
            order: +match[1]
            }), 
            (match, node) => node.childCount + node.attrs.order == +match[1]
        );
    }

    //bullet list rule
    public bulletListRule(nodeType: NodeType) {
        return wrappingInputRule(
            /^\s*([-+*])\s$/,
            nodeType
        );
    }

    //heading rule
    public headingRule(nodeType: NodeType, maxLevel: number) {
        return textblockTypeInputRule(
            new RegExp("^(#{1," + maxLevel + "})\\s$"),
            nodeType, 
            (match) => ({
                level: match[1].length
            })
        );
    }

    //buildInputRules function
    public buildInputRules(schema: Schema) {
        let rules: InputRule[] = [...smartQuotes, ellipsis, emDash];
        let type: NodeType;

        if(type = schema.nodes.blockquote) {
            rules.push(this.blockQuoteRule(type));
        }

        if(type = schema.nodes.ordered_list) {
            rules.push(this.orderedListRule(type));
        } 

        if(type = schema.nodes.bullet_list) {
            rules.push(this.bulletListRule(type));
        }

        if(type = schema.nodes.heading) {
            rules.push(this.headingRule(type, 6));
        }

        return inputRules({
            rules
        });
    }
}