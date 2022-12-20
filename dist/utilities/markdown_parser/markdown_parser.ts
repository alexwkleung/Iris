/* 
* file: `markdown_parser.ts`
*
* this file contains the markdown parser function (in MarkdownParser class)
* 
* at the moment, it's using a basic unified (remark/rehype) setup to parse opened files
* from a VFile to a String so that it can be used in the DOM
*
*/

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeRemark from 'rehype-remark'
import rehypeParse from 'rehype-parse'
import { LocalFileDirectory } from '../file_directory/file_directory'

//parse open file using unified
export class MarkdownParser { 
    //parse open file (markdown)
    //
    //call MarkdownParser.mdParse(<your file to parse>)
    //
    static async mdParse(dataToParse: string) {
        const mdParse = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeSanitize)
            .use(rehypeStringify)
            .process(dataToParse)

        LocalFileDirectory.openFileString = String(mdParse);
    }

    /*
    static async mdParseSave(data: any) {
        const mdParseOpen = await unified()
            .use(rehypeParse)
            .use(rehypeRemark)
            .use(rehypeStringify)
            .process(data)

        LocalFileDirectory.saveFileString = String(mdParseOpen);

        console.log(LocalFileDirectory.saveFileString);

    }
    */
}   