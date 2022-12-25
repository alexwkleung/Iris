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
import { ProseMirrorEditorNode } from '../../editor/editor'
import { ProseMirrorEditor } from '../../editor/editor_state/editor_state'
import { EditorModeConstants } from '../constants/constants'
import { getMarkdown, replaceAll } from '@milkdown/utils'
import { CodeMirror_EditorState } from '../../codemirror/cm_editor_state/cm_editor_state'

//const LFDirectory = new LocalFileDirectory() as LocalFileDirectory;
//Local Event Listeners class
export class LocalEventListeners extends LocalFileDirectory {
    private LFDirectory = new LocalFileDirectory() as LocalFileDirectory;
    private CM_View = new CodeMirror_EditorView() as CodeMirror_EditorView;

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
                    EditorModeConstants.WYSIWYG_Active;
                    EditorModeConstants.Markdown_Inactive;

                    //check if markdown editor is visible
                    if((document.querySelector('#cm_editor') as HTMLElement).style.display === "") {
                        CodeMirror_EditorNode.editorNode.style.display = "none";
                        ProseMirrorEditorNode.editorNode.style.display = "";
                        ProseMirrorEditor.editor.action(replaceAll(CodeMirror_EditorView.editorView.state.doc.toString()));
                    } else if((document.querySelector('#cm_editor') as HTMLElement).style.display === "none") { 
                        ProseMirrorEditorNode.editorNode.style.display = "";
                        ProseMirrorEditor.editor.action(replaceAll(CodeMirror_EditorView.editorView.state.doc.toString()));
                    }
                //check if value is markdownButton
                } else if(input[i].value === "markdownButton") {
                    console.log("Markdown");
                    EditorModeConstants.Markdown_Active;
                    EditorModeConstants.WYSIWYG_Inactive;

                    //check if wysiwyg editor is visible
                    if((document.querySelector('#editor') as HTMLElement).style.display === "") {
                        //CodeMirror_EditorView.editorView.destroy();

                        //this.CM_View.CodeMirror_EditorView();

                        ProseMirrorEditorNode.editorNode.style.display = "none";
                        CodeMirror_EditorNode.editorNode.style.display = "";

                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });
                    //check if wysiwyg editor is invisible 
                    } else if((document.querySelector('#editor') as HTMLElement).style.display === "none") {
                        //CodeMirror_EditorView.editorView.destroy();

                        //this.CM_View.CodeMirror_EditorView();

                        CodeMirror_EditorNode.editorNode.style.display = "";

                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });
                    }
                }
            })
        }
    }
}