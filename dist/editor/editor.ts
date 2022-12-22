/*
* file: `editor.ts`
*
* this is the main file that holds the editor node
*
*/

import { App } from '../app'

//stylesheets
import '../styles/prosemirror.css'
import '../styles/themes/prism-coldark-dark.css'

//ProseMirror Editor Div class
export class ProseMirrorEditorNode {
    //passable created DOM node variables to reference later
    static editorNode: HTMLDivElement;

    public PMEditorNode(): HTMLDivElement {
        ProseMirrorEditorNode.editorNode = document.createElement('div') as HTMLDivElement;
        ProseMirrorEditorNode.editorNode.setAttribute("id", "editor");

        console.log("Created Editor Node");

        return (App.appNode.appendChild(ProseMirrorEditorNode.editorNode) as HTMLDivElement) 
    }
}