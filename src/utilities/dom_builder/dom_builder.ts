/* 
* file: `dom_builder.ts`
*
* this file holds the dom builder functions from EvaDOMBuilderUtil: https://github.com/alexwkleung/Eva-DOM-Builder-Util
* 
*/

/* file directory tree reference: https://www.w3schools.com/howto/howto_js_treeview.asp */

import { EvaDOMBuilderUtil } from "eva-dom-builder-util"
import { LocalFileDirectoryNode } from "../file_directory/file_directory_node"

/**
 * @class FileDirectoryBuilder
 * 
 * @file `dom_builder.ts`
 */
export class FileDirectoryBuilder {
    /**
     * Eva DOM builder util object
     * 
     * @access private readonly
     */
    private readonly EvaDOM = new EvaDOMBuilderUtil() as EvaDOMBuilderUtil;

    public Eva_FileDirectoryTreeBuilder(folderName: string, fileName: string | null | undefined) {
        //ul node
        this.EvaDOM.DOMBuilderChildWithRef(
            'ul', 
            'class', 
            "parentFolder",  
            undefined,
            LocalFileDirectoryNode.folderContainerNode,
            1,
            false,
            true
        );

        //li node
        this.EvaDOM.DOMBuilderChild(
            'li',
            'class',
            "parentFolderList",
            undefined,
            EvaDOMBuilderUtil.prevChildNode,
            1,
            false
        );

        //span child to li
        this.EvaDOM.DOMBuilderChild(
            'span',
            'class',
            "caret",
            folderName,
            EvaDOMBuilderUtil.prevChildNode,
            1,
            false
        );

        //span child to li
        this.EvaDOM.DOMBuilderChildWithRef(
            'ul',
            'class',
            "nested",
            undefined,
            document.querySelector('li') as HTMLElement,
            1,
            false, 
            true
        );  

        //check if filename arg is omited
        if(fileName !== undefined) {
            this.EvaDOM.DOMBuilderChild(
                'li',
                'class',
                'noteFiles',
                fileName as string | undefined,
                EvaDOMBuilderUtil.prevChildNode,
                1,
                false
            );
        }
    }

    //file directory tree
    public Eva_FileDirectoryTreeFilesBuilder(stringArray: string[]) {
        this.EvaDOM.DOMBuilderChildWithStringArray(
            'li',
            'class',
            "noteFiles",
            EvaDOMBuilderUtil.prevChildNode,
            stringArray,
            false
        );
    }

    //file directory tree files ref 
    public Eva_FileDirectoryTreeFilesRefBuilder(stringArray: string[]) {
        this.EvaDOM.DOMBuilderChildWithStringArray(
            'li',
            'class',
            "noteFilesRef",
            EvaDOMBuilderUtil.prevChildNode,
            stringArray,
            false
        )
    }
}