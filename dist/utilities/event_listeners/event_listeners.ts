/* 
* file: `event_listeners.ts`
*
* this file holds all the event listeners necessary to make 
* the front-end side of things usable
*
*/

import { LocalFileDirectory } from '../file_directory/file_directory'
import { CodeMirror_EditorNode } from '../../codemirror/cm_editor/cm_editor'
import { CodeMirror_EditorView } from '../../codemirror/cm_editor_view/cm_editor_view'
import { ProseMirrorEditorNode } from '../../pm_editor/pm_editor_node'
import { ProseMirrorEditor } from '../../pm_editor/pm_editor_state/pm_editor_state'
import { EditorModeConstants } from '../constants/constants'
import { getMarkdown, replaceAll } from '@milkdown/utils'

//const LFDirectory = new LocalFileDirectory() as LocalFileDirectory;
//Local Event Listeners class
export class LocalEventListeners extends LocalFileDirectory {
    //local file directory object
    private LFDirectory = new LocalFileDirectory() as LocalFileDirectory;

    //constant refs
    public wysiwygConst: string;
    public markdownConst: string
    public readingConst: string;

    //open folder listener
    public openFolderListener() {
        const browseFolder = document.querySelector('#openFolder') as HTMLButtonElement;

        browseFolder.addEventListener('click', async () => {
            console.log("Open Local Folder: Promise Resolved.");
            await Promise.resolve(this.LFDirectory.OpenLFFolder()).then(() => {
                console.log("Open Local Folder: Promise Resolved.");
            });
        });
    }

    //open file listener
    public openFileListener() {
        const openFile = document.querySelector('#openFile') as HTMLButtonElement;
        
        openFile.addEventListener('click', async () => {
            console.log("Clicked open file button");

            await Promise.resolve(this.LFDirectory.OpenLF()).then(() => {
                console.log("Open Local File: Promise Resolved.");
            });
        });
    }   

    //save file listener
    public saveFileListener() {
        const saveFile = document.querySelector('#saveFile') as HTMLButtonElement;

        saveFile.addEventListener('click' , async () => {
            await Promise.resolve(this.LFDirectory.saveLF()).then(() => {
                console.log("Save Local File: Promise Resolved.");
            });
        });
    }

    //editor mode
    public editorMode() {
        //get all input elements from inputButtonNodeContainer
        const input = (document.querySelector('#inputButtonNodeContainer') as HTMLElement).getElementsByTagName('input');

        //iterate over input array tags
        for(let i = 0; i < input.length; i++) {
            //event listener for when each of the input buttons are clicked
            input[i].addEventListener('click', () => {
                //check if value is wysiwyg
                if(input[i].value === "wysiwygButton") {
                    console.log("WYSIWYG");

                    //set constants
                    this.wysiwygConst = EditorModeConstants.WYSIWYG_Active;
                    this.markdownConst = EditorModeConstants.Markdown_Inactive;

                    //check if markdown editor is visible
                    if((document.querySelector('#cm_editor') as HTMLElement).style.display === "") {
                        //hide CM editor
                        CodeMirror_EditorNode.editorNode.style.display = "none";

                        //show PM editor
                        ProseMirrorEditorNode.editorNode.style.display = "";

                        //replace all contents of wysiwyg editor with markdown editor contents
                        ProseMirrorEditor.editor.action(replaceAll(CodeMirror_EditorView.editorView.state.doc.toString()));
                    } else if((document.querySelector('#cm_editor') as HTMLElement).style.display === "none") { 
                        this.wysiwygConst = EditorModeConstants.WYSIWYG_Active;
                        this.markdownConst = EditorModeConstants.Markdown_Inactive;
                        
                        ProseMirrorEditorNode.editorNode.style.display = "";

                        ProseMirrorEditor.editor.action(replaceAll(CodeMirror_EditorView.editorView.state.doc.toString()));
                    }
                //check if value is markdownButton
                } else if(input[i].value === "markdownButton") {
                    console.log("Markdown");
                    this.markdownConst = EditorModeConstants.Markdown_Active;
                    this.wysiwygConst = EditorModeConstants.WYSIWYG_Inactive;

                    //check if wysiwyg editor is visible
                    if((document.querySelector('#editor') as HTMLElement).style.display === "") {                        
                        //hide PM editor
                        ProseMirrorEditorNode.editorNode.style.display = "none";

                        //show CM editor
                        CodeMirror_EditorNode.editorNode.style.display = "";

                        //dispatch an insert change to editorview
                        //
                        //inserts wysiwyg editor contents into markdown editor
                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });
                    //check if wysiwyg editor is invisible 
                    } else if((document.querySelector('#editor') as HTMLElement).style.display === "none") {
                        this.markdownConst = EditorModeConstants.Markdown_Active;
                        this.wysiwygConst = EditorModeConstants.WYSIWYG_Inactive;
                        
                        CodeMirror_EditorNode.editorNode.style.display = "";

                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });
                    }
                } else if(input[i].value === "readingButton") {
                    
                }
            });
        }
    }
}