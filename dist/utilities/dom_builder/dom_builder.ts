/* 
* file: `dom_builder.ts`
*
* this file holds the dom builder functions from EvaDOMBuilderUtil 
* from https://github.com/alexwkleung/Eva-DOM-Builder-Util
*
* use the DOM builder for difficult structures such as the file directory
* 
* since the utility is tailored towards this application, other
* developers may find it difficult to create DOM structures 
*
*/

import { EvaDOMBuilderUtil } from "eva-dom-builder-util"
import { LocalFileDirectoryNode } from "../file_directory/file_directory"

export class FileDirectoryBuilder {
    private EvaDOM = new EvaDOMBuilderUtil() as EvaDOMBuilderUtil;

    //tree view is based off of https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_treeview
    //in the future, you should switch to a more rigid implementation of a file tree 
    //
    public Eva_FileDirectoryTreeBuilder(folderName: string, fileName: string | null | undefined) {
        console.log(EvaDOMBuilderUtil.parentNode);

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

        this.EvaDOM.DOMBuilderChildNoAttr(
            'li',
            undefined,
            EvaDOMBuilderUtil.prevChildNode,
            1,
            false
        );

        //span child --> to li
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
            'select',
            'class',
            "nested",
            undefined,
            document.querySelector('li') as HTMLElement,
            1,
            false, 
            true
        )

        if(fileName !== undefined) {
            this.EvaDOM.DOMBuilderChildNoAttr(
                'option',
                fileName as string | undefined,
                EvaDOMBuilderUtil.prevChildNode,
                1,
                false
            );
        }

        //logic for clicking folders and showing files
        const toggle = document.getElementsByClassName('caret');
        const nested = document.querySelector('.nested') as HTMLElement;

        for(let i = 0; i < toggle.length; i++) {
            toggle[i].addEventListener('click', function(this: Element) {
                nested.classList.toggle('active');
                (this as Element).classList.toggle('caret-down');
            });
        }
    }

    public Eva_FileDirectoryTreeFilesBuilder(stringArray: string[]) {
        this.EvaDOM.DOMBuilderChildWithStringArray(
            'option',
            EvaDOMBuilderUtil.prevChildNode,
            stringArray
        )
    }
}