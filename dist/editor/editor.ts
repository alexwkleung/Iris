/*
* file: `editor.ts`
*
* this is the main file that holds the editor div for Iris
*
*/

import { App } from '../app'

import '../styles/prosemirror.css'

//ProseMirror Editor Div class
export class ProseMirrorEditorDiv {
    //passable created DOM node variables to reference later
    static editorDiv: HTMLDivElement;
    static contentDiv: HTMLDivElement;

    public PMEditorDiv(): HTMLDivElement {
        ProseMirrorEditorDiv.editorDiv = document.createElement('div') as HTMLDivElement;
        ProseMirrorEditorDiv.editorDiv.setAttribute("id", "editor");

        const contentDiv = document.createElement('div') as HTMLDivElement;
        contentDiv.setAttribute("id", "content");
        contentDiv.style.display = "none";

        return (App.appDiv.appendChild(ProseMirrorEditorDiv.editorDiv) as HTMLDivElement) 
        && ProseMirrorEditorDiv.editorDiv.appendChild(contentDiv);
    }
}