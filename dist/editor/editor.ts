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

    //editor node
    static editorNode: HTMLDivElement;

    //input button node container
    static inputButtonNodeContainer: HTMLDivElement;

    //wysiwyg input
    static wysiwygInputParentNode: HTMLDivElement;
    static wysiwygInputNode: HTMLInputElement;
    static wysiwygInputLabelNode: HTMLLabelElement;

    //markdonw input
    static markdownInputParentNode: HTMLDivElement;
    static markdownInputNode: HTMLInputElement;
    static markdownInputLabelNode: HTMLLabelElement;

    public PMEditorNode() {
        //editor node
        ProseMirrorEditorNode.editorNode = document.createElement('div') as HTMLDivElement;
        ProseMirrorEditorNode.editorNode.setAttribute("id", "editor");

        console.log("Created Editor Node");

        //wysiwyg button parent
        ProseMirrorEditorNode.wysiwygInputParentNode = document.createElement('div');
        ProseMirrorEditorNode.wysiwygInputParentNode.setAttribute("id", "wysiwygButtonParent");

        //wysiwyg input node
        ProseMirrorEditorNode.wysiwygInputNode = document.createElement('input');
        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("type", "radio");
        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("value", "WYSIWYG");
        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("id", "wysiwygButton");
        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("value", "wysiwygButton");
        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("name", "editorSwitcher");
        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("disabled", "");

        //wysiwyg input label node
        ProseMirrorEditorNode.wysiwygInputLabelNode = document.createElement('label');
        ProseMirrorEditorNode.wysiwygInputLabelNode.setAttribute("for", "wysiwygButton");
        ProseMirrorEditorNode.wysiwygInputLabelNode.textContent = "WYSIWYG";

        //markdown button parent
        ProseMirrorEditorNode.markdownInputParentNode = document.createElement('div');
        ProseMirrorEditorNode.markdownInputParentNode.setAttribute("id", "markdownButtonParent");

        //markdown input node
        ProseMirrorEditorNode.markdownInputNode= document.createElement('input');
        ProseMirrorEditorNode.markdownInputNode.setAttribute("type", "radio");
        ProseMirrorEditorNode.markdownInputNode.setAttribute("value", "markdown");
        ProseMirrorEditorNode.markdownInputNode.setAttribute("id", "markdownButton");
        ProseMirrorEditorNode.markdownInputNode.setAttribute("value", "markdownButton");
        ProseMirrorEditorNode.markdownInputNode.setAttribute("name", "editorSwitcher");
        ProseMirrorEditorNode.markdownInputNode.setAttribute("disabled", "");

        //markdown input label node
        ProseMirrorEditorNode.markdownInputLabelNode = document.createElement('label');
        ProseMirrorEditorNode.markdownInputLabelNode.setAttribute("for", "markdownButton");
        ProseMirrorEditorNode.markdownInputLabelNode.textContent = "Markdown";
        
        //input button container
        ProseMirrorEditorNode.inputButtonNodeContainer = document.createElement('div');
        ProseMirrorEditorNode.inputButtonNodeContainer.setAttribute("id", "inputButtonNodeContainer");
        ProseMirrorEditorNode.inputButtonNodeContainer.style.display = "none";
        
        //append childs
        App.appNode.appendChild(ProseMirrorEditorNode.inputButtonNodeContainer);

        App.appNode.appendChild(ProseMirrorEditorNode.editorNode);
        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.wysiwygInputParentNode);
        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.markdownInputParentNode);

        ProseMirrorEditorNode.wysiwygInputParentNode.appendChild(ProseMirrorEditorNode.wysiwygInputNode);
        ProseMirrorEditorNode.wysiwygInputParentNode.appendChild(ProseMirrorEditorNode.wysiwygInputLabelNode);

        ProseMirrorEditorNode.markdownInputParentNode.appendChild(ProseMirrorEditorNode.markdownInputNode);
        ProseMirrorEditorNode.markdownInputParentNode.appendChild(ProseMirrorEditorNode.markdownInputLabelNode);
    }
}