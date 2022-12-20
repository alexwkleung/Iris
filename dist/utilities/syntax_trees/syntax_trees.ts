/* 
* file: `syntax_trees.ts`
*
* this file contains the syntax tree converters using hast/mdast utils from https://github.com/syntax-tree
*  
*
*/

import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import {toMarkdown} from 'mdast-util-to-markdown'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { fromMarkdown } from 'mdast-util-from-markdown'

export class SyntaxTrees {
    //convert data string to html
    //use hast utils to convert mdast to hast and hast (html)
    //to html for opening files
    //
    //although this somewhat works, you need to make sure 
    //that the prosemirror side of things are working 
    //the way the library handles certain operations
    //
    static toHTML_ST(dataString: string) {
        const mdast = fromMarkdown(dataString);
        //need to remove any type 
        //this is a temporary fix for now
        const hast: any = toHast(mdast);
        const html = toHtml(hast);

        return html;
    }

    //convert data string to markdown
    //use hast utils to convert html to mdast and mdast to markdown for saving files
    //
    //although this somewhat works, you need to make sure 
    //that the prosemirror side of things are working 
    //the way the library handles certain operations
    //
    static toMarkdown_ST(dataString: string) {
        const hast = fromHtml(String(dataString), { 
            fragment: true 
        });

        const mdast = toMdast(hast);
        const md = toMarkdown(mdast);

        return md;
    }
}