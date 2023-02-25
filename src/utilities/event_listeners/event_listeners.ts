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
import { ProseMirrorEditorNode } from '../../prosemirror/pm_editor_node'
import { ProseMirrorEditor } from '../../prosemirror/pm_editor_state/pm_editor_state'
import { EditorModeConstants } from '../constants/constants'
import { getMarkdown, replaceAll } from '@milkdown/utils'
import { ReadingMode } from '../../reading_mode/reading_mode'
import { EvaSTUtil } from 'eva-st-util'

//Local Event Listeners class
export class LocalEventListeners extends LocalFileDirectory {
    /**
     * Local File Directory object
     * 
     * @access private readonly
     */
    private readonly LFDirectory = new LocalFileDirectory() as LocalFileDirectory;

    /**
     * Reading Mode object
     * 
     * @access private readonly
     */
    private readonly ReMode_Evt = new ReadingMode() as ReadingMode;

    //constant refs
    private wysiwygConst: string;
    private markdownConst: string
    private readingConst: string;

    //open folder listener
    public openFolderListener() {
        const browseFolder = document.querySelector('#openFolder') as HTMLButtonElement;

        browseFolder.addEventListener('click', async () => {
            await Promise.resolve(this.LFDirectory.OpenLFFolder()).then(() => {
                //console.log("Open Local Folder: Promise Resolved.");
                return;
            }).catch(() => console.error("Unable to open folder"));
        });
    }

    //save file listener
    public saveFileListener() {
        const editor = document.querySelector('#editor') as HTMLElement;
        const cm_editor = document.querySelector('#cm_editor') as HTMLElement;

        //auto saving 
        editor.addEventListener('keyup', async () => {
            await Promise.resolve(this.LFDirectory.saveLF()).then(() => {
                //console.log("Save Local File: Promise Resolved.");
                return;
            });
        });
        cm_editor.addEventListener('keyup', async () => {
            await Promise.resolve(this.LFDirectory.saveLF()).then(() => {
                //console.log("Save Local File: Promise Resolved.");
                return;
            }).catch(() => console.error("Unable to save file"));
        });
    }

    //editor mode
    public editorModeListener() {
        //get all input elements from inputButtonNodeContainer
        const input = (document.querySelector('#inputButtonNodeContainer') as HTMLElement).getElementsByTagName('input');

        //iterate over input array tags
        for(let i = 0; i < input.length; i++) {
            //event listener for when each of the input buttons are clicked
            input[i].addEventListener('click', () => {
                //check if value is wysiwyg
                if(input[i].value === "wysiwygButton") {
                    //set constants
                    this.wysiwygConst = EditorModeConstants.WYSIWYG_Active;
                    this.markdownConst = EditorModeConstants.Markdown_Inactive;
                    this.readingConst = EditorModeConstants.Reading_Inactive;

                    //check if markdown editor is visible
                    if((document.querySelector('#cm_editor') as HTMLElement).style.display === "") {
                        //hide CM editor
                        CodeMirror_EditorNode.editorNode.style.display = "none";

                        //hide reading editor
                        ReadingMode.readingModeNodeContainer.style.display = "none";

                        //show PM editor
                        ProseMirrorEditorNode.editorNode.style.display = "";

                        //replace all contents of wysiwyg editor with markdown editor contents
                        ProseMirrorEditor.editor.action(replaceAll(CodeMirror_EditorView.editorView.state.doc.toString()));

                        //focus PM editor
                        (document.querySelector('.ProseMirror') as HTMLElement).focus();
                    //check if codemirror instance is not displayed
                    } else if((document.querySelector('#cm_editor') as HTMLElement).style.display === "none") { 
                        this.wysiwygConst = EditorModeConstants.WYSIWYG_Active;
                        this.markdownConst = EditorModeConstants.Markdown_Inactive;

                        ReadingMode.readingModeNodeContainer.style.display = "none";

                        ProseMirrorEditorNode.editorNode.style.display = "";

                        ProseMirrorEditor.editor.action(replaceAll(CodeMirror_EditorView.editorView.state.doc.toString()));

                        (document.querySelector('.ProseMirror') as HTMLElement).focus();
                    }
                //check if value is markdownButton
                } else if(input[i].value === "markdownButton") {
                    this.markdownConst = EditorModeConstants.Markdown_Active;
                    this.wysiwygConst = EditorModeConstants.WYSIWYG_Inactive;
                    this.readingConst = EditorModeConstants.Reading_Inactive;

                    //check if wysiwyg editor is displayed
                    if((document.querySelector('#editor') as HTMLElement).style.display === "") {                        
                        //hide PM editor
                        ProseMirrorEditorNode.editorNode.style.display = "none";

                        //hide reading editor
                        ReadingMode.readingModeNodeContainer.style.display = "none";

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

                        //update reading mode from prosemirror instance
                        this.ReMode_Evt.readingMode_ProseMirror();

                        //focus editor view
                        CodeMirror_EditorView.editorView.focus();
                    //check if wysiwyg editor is not displayed
                    } else if((document.querySelector('#editor') as HTMLElement).style.display === "none") {
                        this.markdownConst = EditorModeConstants.Markdown_Active;
                        this.wysiwygConst = EditorModeConstants.WYSIWYG_Inactive;
                        this.readingConst = EditorModeConstants.Reading_Inactive;

                        ProseMirrorEditorNode.editorNode.style.display = "none";

                        ReadingMode.readingModeNodeContainer.style.display = "none";

                        CodeMirror_EditorNode.editorNode.style.display = "";

                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });
                        
                        this.ReMode_Evt.readingMode_ProseMirror();

                        CodeMirror_EditorView.editorView.focus();
                    }
                //check if reading button is clicked and if prosemirror instance was previously displayed
                } else if(input[i].value === "readingButton" && ProseMirrorEditorNode.editorNode.style.display === "") {
                    this.readingConst = EditorModeConstants.Reading_Active;
                    this.wysiwygConst = EditorModeConstants.WYSIWYG_Inactive;
                    this.markdownConst = EditorModeConstants.Markdown_Inactive;

                    ProseMirrorEditorNode.editorNode.style.display = "none";
                    CodeMirror_EditorNode.editorNode.style.display = "none";

                    this.ReMode_Evt.readingMode_ProseMirror();

                    CodeMirror_EditorView.editorView.dispatch({
                        changes: {
                            from: 0,
                            to: CodeMirror_EditorView.editorView.state.doc.length,
                            insert: EvaSTUtil.HTMLtoMarkdown_ST(ReadingMode.readingModeNodeContainer.innerHTML)
                        }
                    });

                    ReadingMode.readingModeNodeContainer.style.display = "";

                    //focus reading mode node container
                    (document.querySelector("#readingModeNodeContainer") as HTMLElement).focus();
                //check if reading button is clicked and check if codemirror instance was previously displayed
                } else if(input[i].value === "readingButton" && CodeMirror_EditorNode.editorNode.style.display === "") {
                    this.readingConst = EditorModeConstants.Reading_Active;
                    this.wysiwygConst = EditorModeConstants.WYSIWYG_Inactive;
                    this.markdownConst = EditorModeConstants.Markdown_Inactive;

                    CodeMirror_EditorNode.editorNode.style.display = "none";

                    //update reading mode from codemirror instance
                    this.ReMode_Evt.readingMode_CodeMirror();

                    CodeMirror_EditorView.editorView.dispatch({
                        changes: {
                            from: 0,
                            to: CodeMirror_EditorView.editorView.state.doc.length,
                            insert: EvaSTUtil.HTMLtoMarkdown_ST(ReadingMode.readingModeNodeContainer.innerHTML)
                        }
                    });

                    ReadingMode.readingModeNodeContainer.style.display = "";

                    //focus reading mode node container
                    (document.querySelector("#readingModeNodeContainer") as HTMLElement).focus();
                }
            });
        }
    }

    //create file listener
    public createFileListener() {
        const inputBox = document.querySelector('#createFileInput') as HTMLInputElement;

        inputBox.addEventListener('keydown', async (event) => {
            //check if user presses enter on input box with some x value
            if(event.key === 'Enter' && inputBox.value) {
                this.LFDirectory.createFile(inputBox.value);

                inputBox.value = "";

                //resync folder
                await Promise.resolve(this.LFDirectory.OpenLFFolder()).then(() => {
                    //console.log("Open Local Folder: Promise Resolved.");
                    return;
                    //console.clear();
                }).catch(() => console.error("Unable to open folder"));
            } else if(inputBox.value === "") {
                throw console.error("Input box cannot be empty!");
            }
        });
    }

    //rename file listener
    public renameFileListener() {
        const inputBoxRename = document.querySelector('#renameInputBox') as HTMLInputElement;

        inputBoxRename.addEventListener('keydown', async (event) => {
            //check if user presses enter on input box with some x value
            if(event.key === 'Enter' && inputBoxRename.value) {
                this.LFDirectory.renameFile()

                inputBoxRename.value = "";

                //resync folder
                await Promise.resolve(this.LFDirectory.OpenLFFolder()).then(() => {
                    //console.log("Open Local Folder: Promise Resolved.");
                    return;
                }).catch(() => "Unable to open folder.");
            } else if(event.key === 'Enter' && inputBoxRename.value === "") {
                throw console.error("Input box cannot be empty!");
            }
        });
    }

    //delete file listener
    public deleteFileListener() {
        const deleteFileButton = document.querySelector('#deleteFileButton') as HTMLElement;

        deleteFileButton.addEventListener('click', async (event) => {
            await this.LFDirectory.deleteFile();

            //resync folder
            await Promise.resolve(this.LFDirectory.OpenLFFolder()).then(() => {
                //console.log("Open Local Folder: Promise Resolved.");
                return;
            }).catch(() => console.error("Unable to open folder"));
        }); 
    }
}