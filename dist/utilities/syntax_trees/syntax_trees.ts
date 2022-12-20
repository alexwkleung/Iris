/* 
* file: `syntax_trees.ts`
*
* this file contains the syntax tree converters using hast/mdast utils from https://github.com/syntax-tree
*  
* the base of these functions are taken from https://github.com/alexwkleung/Eva-ST-Util
*
*/

import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { fromMarkdown } from 'mdast-util-from-markdown'

//Syntax Trees class
export class SyntaxTrees {
    //convert data string to html
    //use hast utils to convert mdast to hast and hast (html)
    //to html for opening files
    //
    //although this somewhat works, you need to make sure 
    //that the prosemirror side of things are working 
    //the way the library handles certain operations
    //
    static MDtoHTML_ST(dataString: string) {
        const _mdast = fromMarkdown(String(dataString));
        const _hast = toHast(_mdast)!;
        const _html = toHtml(_hast);

        return _html;
    }

    //convert data string to markdown
    //use hast utils to convert html to mdast and mdast to markdown for saving files
    //
    //although this somewhat works, you need to make sure 
    //that the prosemirror side of things are working 
    //the way the library handles certain operations
    //
    static HTMLtoMarkdown_ST(dataString: string) {
        const _hast = fromHtml(String(dataString), { 
            fragment: true 
        });

        const _mdast = toMdast(_hast);
        const _md = toMarkdown(_mdast);

        return _md;
    }
}