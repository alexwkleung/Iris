/*
* file: `pm_editor_node.ts`
*
* this file holds the prosemirror editor node
*
*/

import { App } from '../app'

//stylesheets
import '../styles/prosemirror.css'
import '../styles/themes/prism-coldark-dark.css'

/**
 * @class ProseMirrorEditorNode
 * 
 * @file: `pm_editor_node.ts`
 */
export class ProseMirrorEditorNode {
    //passable created DOM node variables to reference later

    /**
     * editorNode variable
     * 
     * Used as a reference for the editor node
     * 
     * @member static
     * @returns HTMLDivElement
     */
    static editorNode: HTMLDivElement;

    //input button node container
    static inputButtonNodeContainer: HTMLDivElement;

    //wysiwyg input
    static wysiwygInputParentNode: HTMLDivElement;
    static wysiwygInputNode: HTMLInputElement;
    static wysiwygInputLabelNode: HTMLLabelElement;
    static wysiwygInputLabelTextNode: Text;

    //markdown input
    static markdownInputParentNode: HTMLDivElement;
    static markdownInputNode: HTMLInputElement;
    static markdownInputLabelNode: HTMLLabelElement;
    static markdownInputLabelTextNode: Text;

    //reading input 
    static readingInputParentNode: HTMLDivElement;
    static readingInputNode: HTMLInputElement;
    static readingInputLabelNode: HTMLLabelElement;
    static readingInputLabelTextNode: Text;

    //rename input
    static renameInputNode: HTMLInputElement;
    static renameInputNodeHidden: HTMLInputElement;

    //prosemirror editor node
    public PMEditorNode() {
        //editor node
        ProseMirrorEditorNode.editorNode = document.createElement('div') as HTMLDivElement;
        ProseMirrorEditorNode.editorNode.setAttribute("id", "editor");
        ProseMirrorEditorNode.editorNode.style.display = "none";
        ProseMirrorEditorNode.editorNode.setAttribute("spellcheck", "false");

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
        ProseMirrorEditorNode.wysiwygInputLabelTextNode = document.createTextNode("WYSIWYG");
        ProseMirrorEditorNode.wysiwygInputLabelNode.appendChild(ProseMirrorEditorNode.wysiwygInputLabelTextNode);

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
        ProseMirrorEditorNode.markdownInputLabelTextNode = document.createTextNode("Markdown");
        ProseMirrorEditorNode.markdownInputLabelNode.appendChild(ProseMirrorEditorNode.markdownInputLabelTextNode);
        
        //input button container
        ProseMirrorEditorNode.inputButtonNodeContainer = document.createElement('div');
        ProseMirrorEditorNode.inputButtonNodeContainer.setAttribute("id", "inputButtonNodeContainer");
        ProseMirrorEditorNode.inputButtonNodeContainer.style.display = "none";

        //reading input button parent
        ProseMirrorEditorNode.readingInputParentNode = document.createElement('div');
        ProseMirrorEditorNode.readingInputParentNode.setAttribute("id", "readingButtonParent");

        //reading input node
        ProseMirrorEditorNode.readingInputNode = document.createElement('input');
        ProseMirrorEditorNode.readingInputNode.setAttribute("type", "radio");
        ProseMirrorEditorNode.readingInputNode.setAttribute("value", "reading");
        ProseMirrorEditorNode.readingInputNode.setAttribute("id", "readingButton");
        ProseMirrorEditorNode.readingInputNode.setAttribute("value", "readingButton");
        ProseMirrorEditorNode.readingInputNode.setAttribute("name", "editorSwitcher");
        ProseMirrorEditorNode.readingInputNode.setAttribute("disabled", "");

        ProseMirrorEditorNode.readingInputLabelNode = document.createElement('label');
        ProseMirrorEditorNode.readingInputLabelNode.setAttribute("for", "readingButton");
        ProseMirrorEditorNode.readingInputLabelTextNode = document.createTextNode("Reading");
        ProseMirrorEditorNode.readingInputLabelNode.appendChild(ProseMirrorEditorNode.readingInputLabelTextNode);

        ProseMirrorEditorNode.renameInputNode = document.createElement('input');
        ProseMirrorEditorNode.renameInputNode.setAttribute("id", "renameInputBox");
        ProseMirrorEditorNode.renameInputNode.setAttribute("type", "text");
        ProseMirrorEditorNode.renameInputNode.setAttribute("placeholder", "Rename File...");

        ProseMirrorEditorNode.renameInputNodeHidden = document.createElement('input');
        ProseMirrorEditorNode.renameInputNodeHidden.setAttribute("id", "renameInputBoxHidden");
        ProseMirrorEditorNode.renameInputNodeHidden.setAttribute("type", "text");
        ProseMirrorEditorNode.renameInputNodeHidden.setAttribute("disabled", "");

        //append childs
        App.appNodeContainer.appendChild(ProseMirrorEditorNode.inputButtonNodeContainer);
        App.appNodeContainer.appendChild(ProseMirrorEditorNode.editorNode);

        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.renameInputNode);
        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.renameInputNodeHidden);

        //containers

        //input
        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.wysiwygInputParentNode);
        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.markdownInputParentNode);
        ProseMirrorEditorNode.inputButtonNodeContainer.appendChild(ProseMirrorEditorNode.readingInputParentNode)

        //wysiwg
        ProseMirrorEditorNode.wysiwygInputParentNode.appendChild(ProseMirrorEditorNode.wysiwygInputNode);
        ProseMirrorEditorNode.wysiwygInputParentNode.appendChild(ProseMirrorEditorNode.wysiwygInputLabelNode);

        //markdown
        ProseMirrorEditorNode.markdownInputParentNode.appendChild(ProseMirrorEditorNode.markdownInputNode);
        ProseMirrorEditorNode.markdownInputParentNode.appendChild(ProseMirrorEditorNode.markdownInputLabelNode);

        //reading
        ProseMirrorEditorNode.readingInputParentNode.appendChild(ProseMirrorEditorNode.readingInputNode);
        ProseMirrorEditorNode.readingInputParentNode.appendChild(ProseMirrorEditorNode.readingInputLabelNode);
    }
}