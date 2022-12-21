/*
* file: `editor.ts`
*
* this is the main file that holds the editor div for Iris
*
*/

import { App } from '../app'

import '../styles/prosemirror.css'

//ProseMirror Editor Div class
export class ProseMirrorEditorNode {
    //passable created DOM node variables to reference later
    static editorNode: HTMLDivElement;

    public PMEditorNode(): HTMLDivElement {
        ProseMirrorEditorNode.editorNode = document.createElement('div') as HTMLDivElement;
        ProseMirrorEditorNode.editorNode.setAttribute("id", "editor");

        console.log("CREATED EDITOR DIV");

        return (App.appNode.appendChild(ProseMirrorEditorNode.editorNode) as HTMLDivElement) 
    }
}