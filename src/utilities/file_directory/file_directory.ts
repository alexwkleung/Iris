/* 
* file: `file_directory.ts`
*
* this file creates the file directory
*
*/

import { App } from '../../app'
import { dialog, fs } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { e } from '@tauri-apps/api/fs-4bb77382'
import { ProseMirrorEditor } from '../../prosemirror/pm_editor_state/pm_editor_state'
import { getMarkdown, replaceAll } from '@milkdown/utils'
import { FileSystemConstants } from '../constants/constants'
import { FileDirectoryBuilder } from '../dom_builder/dom_builder'
import { ProseMirrorEditorNode } from '../../prosemirror/pm_editor_node'
import { CodeMirror_EditorView } from '../../codemirror/cm_editor_view/cm_editor_view'
import { ReadingMode } from '../../reading_mode/reading_mode'
import { CodeMirror_EditorNode } from '../../codemirror/cm_editor/cm_editor'
import { LocalFileDirectoryNode } from './file_directory_node'

//stylesheets
import '../../styles/file_directory.css'

/**
 * @class LocalFileDirectory
 * 
 * @file `file_directory.ts`
 */
export class LocalFileDirectory {
    //FileDirectoryBuilder object
    private readonly FileDirectoryBuilder = new FileDirectoryBuilder() as FileDirectoryBuilder;

    private readonly ReMode = new ReadingMode() as ReadingMode;

    //string to hold data from file
    static openFileString: string = "";

    //string to hold data from file
    static saveFileString: string;

    //local folder array
    static localFolderArr: string[] = [];

    //local file array
    static localFileArr: string[] = [];

    //open folder variables
    private openFolder: string;
    private splitFolderDirectory: string[];
    private splitFolderPop1: string | null;
    private splitFolderPop2: string | null;
    private splitFolderConcat: string;

    private folderFileString: string;
    private splitFolderFile: string[];
    private splitFolderFilePop1: string | null;
    private splitFolderFilePop2: string | null;
    private splitFolderFileConcat1: string;
    private splitFolderFileConcat2: string;
    private splitFolderFileConcat3: string;

    //open file variables
    private openFile: string;
    private splitFileDirectory: string[];
    private splitFilePop1: string | null;
    private splitFilePop2: string | null;
    private splitFilePop3: string | null;
    private splitFileConcat1: string;
    private splitFileConcat2: string;

    //save file variables
    private saveFile: void;

    //private variables to assign constants
    //private openFileConst: string;
    private saveFileConst: string;

    //file string ref
    private fileStr: string = "";

    //list files ref
    private listFilesRef: string = "";

    //local folder array refs
    private localFolderArrSortRef: string[];
    private localFolderArrShiftRef: string | undefined;

    //copy refs for local folder filter
    private localFolderArrRefCopy: string[] = [];
    private lfArrSortRefSplit: string[];
    private mdExtensionArr: string[];
    private filterMdFiles: string[];

    //recursively iterate over folder contents
    private OpenLFFolderRecursive(entries: e[]) {
        for(const entry of entries) {
            //console.log(entry.path);
            //check type of path
            //console.log(typeof entry.path);

            //push paths of folder to recArr
            LocalFileDirectory.localFolderArr.push(entry.path);

            //check if the children of opened folder path is a directory
            //...
            //return null if children of opened folder path isn't a directory
            if(entry.children) { 
                this.OpenLFFolderRecursive(entry.children);
            } else if(entry.children === false) {
                return null;
            } 
        }
    }

    //open folder
    /*
    * THIS NEEDS TO BE OPTIMIZED!
    */
    public async OpenLFFolder(): Promise<void> {
        if(await fs.exists("Iris_Notes", { dir: fs.BaseDirectory.Desktop})) {
            const entries = await fs.readDir("Iris_Notes", {
                dir: fs.BaseDirectory.Desktop,
                recursive: true
            });
            
            //console.log(entries);

            //set recArr length to 0 to reset array
            LocalFileDirectory.localFolderArr.length = 0;

            //call recursive function
            this.OpenLFFolderRecursive(entries);

            (document.querySelector('#createFileInput') as HTMLElement).style.display = "";
            LocalFileDirectoryNode.deleteFileBtn.style.display = "";

            //check if parentFolder is in the DOM
            if((document.querySelector('.parentFolder'))) {
                this.folderFileString = LocalFileDirectory.localFolderArr.toString();
                this.splitFolderFile = this.folderFileString.split(',');
                this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
                //console.log(typeof this.folderFileString);
                
                //remove parentFolder from DOM if found
                (document.querySelector('.parentFolder') as ChildNode).remove();
    
                ProseMirrorEditor.readonly = false;
    
                ProseMirrorEditor.editor.destroy();
                ProseMirrorEditor.editor.create();
    
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder("Desktop/Iris_Notes", undefined)
    
                //sort localFolderArr alphabetically
                this.localFolderArrSortRef = LocalFileDirectory.localFolderArr.sort();
                
                //remove .DS_Store from sorted ref array
                if(this.localFolderArrSortRef[0].toString().split('/').pop() === ".DS_Store") {
                    //this.localFolderArrSortRef.splice(0, 1);
                    //or
                    this.localFolderArrSortRef.shift();
                }
    
                //directly copy the local folder content array to a ref copy array for use later
                this.localFolderArrRefCopy.length = 0;
                for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                    this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
                }

                //console.log(this.localFolderArrRefCopy);
                
                this.localFolderArrRefCopy.shift();
    
                //split the ref array using regex character class array
                this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
                //console.log(this.lfArrSortRefSplit); 
                //console.log(lfSortRefSplit2);
                
                this.mdExtensionArr = [".md"];
                this.filterMdFiles = this.lfArrSortRefSplit.filter(
                    mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
                ));

                //console.log(this.filterMdFiles);
                //console.log("ARRAY REF COPY OUTPUT");
                //console.log(this.localFolderArrRefCopy);
                            
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(this.filterMdFiles);
    
                //this will build the reference nodes for the directory tree files. 
                //the reference nodes will be hidden and present in the DOM, however they
                //will be used only for linking its full path to open files.
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesRefBuilder(this.localFolderArrSortRef);
    
                //logic for opening a file to the editor from an opened folder within 
                //the directory tree.
                const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFiles');

                //list files dom ref
                const listFilesDOMRef = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFilesRef');
                //console.log(listFiles);
    
                //iterate over files list
                for(let i = 0; i < listFiles.length; i++) { 
                    listFiles[i].addEventListener('click', () => {
                        ProseMirrorEditor.readonly = true;
    
                        ProseMirrorEditor.editor.destroy();
                        ProseMirrorEditor.editor.create();
    
                        //iterate over list files dom ref array
                        for(let j = 0; j < listFilesDOMRef.length; j++) {
                            this.listFilesRef = listFilesDOMRef[i].textContent as string;
                        }
    
                        //console.log(this.listFilesRef);
    
                        const readText = fs.readTextFile(this.listFilesRef, {
                            dir: fs.BaseDirectory.Desktop
                        });
    
                        //reset
                        //this.fileArr.length = 0;
                        this.fileStr = " ";
    
                        //resolve promise for fs readTextFile 
                        Promise.resolve(readText).then((fileData) => {
                            this.fileStr = fileData;
    
                            //console.log(fileStr);
                            //open file content in editor
                            ProseMirrorEditor.editor.action(replaceAll(this.fileStr, true));
    
                            CodeMirror_EditorView.editorView.dispatch({
                                changes: {
                                    from: 0,
                                    to: CodeMirror_EditorView.editorView.state.doc.length,
                                    insert: ProseMirrorEditor.editor.action(getMarkdown())
                                }
                            });
    
                            //show editor
                            ProseMirrorEditorNode.editorNode.style.display = "";
    
                            this.ReMode.readingMode_ProseMirror();
    
                            //check editor/reader display 
                            if(CodeMirror_EditorNode.editorNode.style.display === "") {
                                ProseMirrorEditorNode.editorNode.style.display = "none";
                                ReadingMode.readingModeNodeContainer.style.display = "none";
                            } else if(ReadingMode.readingModeNodeContainer.style.display === "") {
                                CodeMirror_EditorNode.editorNode.style.display = "none";
                                ProseMirrorEditorNode.editorNode.style.display = "none";
                            }
    
                            //show input button node container 
                            ProseMirrorEditorNode.inputButtonNodeContainer.style.display = "";
    
                            //remove disabled attribute from wysiwyg input label
                            ProseMirrorEditorNode.wysiwygInputNode.removeAttribute("disabled");
    
                            //set wysiwyg input to checked
                            ProseMirrorEditorNode.wysiwygInputNode.setAttribute("checked", "");
    
                            //remove disabled attribute from markdown input label
                            ProseMirrorEditorNode.markdownInputNode.removeAttribute("disabled");
    
                            //remove disabled attribute from reading input label
                            ProseMirrorEditorNode.readingInputNode.removeAttribute("disabled");
    
                            //focus PM editor
                            (document.querySelector('.ProseMirror') as HTMLElement).focus();
                        }).catch(() => console.error("Unable to read text file."));
    
                        //console.log(this.fileStr);
                        //console.log(this.listFilesRef);
    
                        //temp naming
                        const split1 = this.listFilesRef.split('/');
                        const pop1 = split1.pop() as string | null;
                        const pop2 = split1.pop() as string | null;
                        const pop3 = split1.pop() as string | null
                        const concat1 = pop3 + "/" + pop2;
    
                        //console.log(pop1);
                        //console.log(concat1);
    
                        appWindow.setTitle("Iris - " + pop1 + " @ " + concat1);
                    });
    
                    await appWindow.setTitle("Iris - " + this.splitFolderConcat);
                }  
            } else {
                this.folderFileString = LocalFileDirectory.localFolderArr.toString();
                this.splitFolderFile = this.folderFileString.split(',');
                this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
                //console.log(typeof this.folderFileString);
    
                (document.querySelector('#createFileInput') as HTMLElement).style.display = "";
                LocalFileDirectoryNode.deleteFileBtn.style.display = "";

                ProseMirrorEditor.readonly = true;
    
                ProseMirrorEditor.editor.destroy();
                ProseMirrorEditor.editor.create();
    
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder("Desktop/Iris_Notes", undefined);
    
                this.localFolderArrSortRef = LocalFileDirectory.localFolderArr.sort();
                
                //remove .DS_Store from sorted ref array
                if(this.localFolderArrSortRef[0].toString().split('/').pop() === ".DS_Store") {
                    //this.localFolderArrSortRef.splice(0, 1);
                    //or
                    this.localFolderArrSortRef.shift();
                }
    
                //directly copy the local folder content array to a ref copy array for use later
                this.localFolderArrRefCopy.length = 0;
                for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                    this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
                }

                this.localFolderArrRefCopy.shift();
    
                //console.log(this.localFolderArrRefCopy);
    
                //split the ref array using regex character class array
                this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
                
                //console.log(this.lfArrSortRefSplit); 
                //console.log(lfSortRefSplit2);
    
                this.mdExtensionArr = [".md"];
                this.filterMdFiles = this.lfArrSortRefSplit.filter(
                    mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
                ));

                //console.log(this.filterMdFiles);
                //console.log("ARRAY REF COPY OUTPUT");
                //console.log(this.localFolderArrRefCopy);
                
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(this.filterMdFiles);
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesRefBuilder(this.localFolderArrRefCopy);
                
                //logic for opening a file to the editor from an opened folder within 
                //the directory tree.
                const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFiles');

                //list files dom ref
                const listFilesDOMRef = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFilesRef');

                //console.log(listFiles);
    
                for(let i = 0; i < listFiles.length; i++) {
                    listFiles[i].addEventListener('click', () => {
                        const getElemWithClass = document.querySelector('.activeFile');
                        if(getElemWithClass !== null) {
                            getElemWithClass.classList.remove('activeFile');
                        }
                        listFiles[i].classList.add('activeFile');
    
                        ProseMirrorEditor.readonly = true;
    
                        ProseMirrorEditor.editor.destroy();
                        ProseMirrorEditor.editor.create();
    
                        //iterate over list files dom ref array
                        for(let j = 0; j < listFilesDOMRef.length; j++) {
                            this.listFilesRef = listFilesDOMRef[i].textContent as string;
                        }
    
                        //console.log(this.listFilesRef);
    
                        const readText= fs.readTextFile(this.listFilesRef, {
                            dir: fs.BaseDirectory.Desktop
                        });
    
                        //reset
                        //this.fileArr.length = 0;
                        this.fileStr = " "; 
    
                        //resolve promise for fs readTextFile 
                        Promise.resolve(readText).then((fileData) => {
                            this.fileStr = fileData;
    
                            //console.log(fileStr);
                            //open file content in editor
                            ProseMirrorEditor.editor.action(replaceAll(this.fileStr, true));
                            
                            CodeMirror_EditorView.editorView.dispatch({
                                changes: {
                                    from: 0,
                                    to: CodeMirror_EditorView.editorView.state.doc.length,
                                    insert: ProseMirrorEditor.editor.action(getMarkdown())
                                }
                            });
    
                            this.ReMode.readingMode_ProseMirror();
    
                            //show editor
                            ProseMirrorEditorNode.editorNode.style.display = "";
    
                            if(CodeMirror_EditorNode.editorNode.style.display === "") {
                                ProseMirrorEditorNode.editorNode.style.display = "none";
                                ReadingMode.readingModeNodeContainer.style.display = "none";
                            } else if(ReadingMode.readingModeNodeContainer.style.display === "") {
                                CodeMirror_EditorNode.editorNode.style.display = "none";
                                ProseMirrorEditorNode.editorNode.style.display = "none";
                            }
    
                            //show input button node container 
                            ProseMirrorEditorNode.inputButtonNodeContainer.style.display = "";
    
                            //remove disabled attribute from wysiwyg input label
                            ProseMirrorEditorNode.wysiwygInputNode.removeAttribute("disabled");
    
                            //set wysiwyg input to checked
                            ProseMirrorEditorNode.wysiwygInputNode.setAttribute("checked", "");
    
                            //remove disabled attribute from markdown input label
                            ProseMirrorEditorNode.markdownInputNode.removeAttribute("disabled");
    
                            //remove disabled attribute from reading input label
                            ProseMirrorEditorNode.readingInputNode.removeAttribute("disabled");
    
                            //focus PM editor
                            (document.querySelector('.ProseMirror') as HTMLElement).focus();
    
                            //console.log(this.fileStr);
                        }).catch(() => console.error("Unable to read text file."));
                    
                        //console.log((document.querySelector('#inputButtonNodeContainer') as HTMLElement).getElementsByTagName('input'));
    
                        //console.log(this.fileStr);
                        //console.log(this.listFilesRef);
    
                        //temp naming
                        const split1 = this.listFilesRef.split('/');
                        const pop1 = split1.pop() as string | null;
                        const pop2 = split1.pop() as string | null;
                        const pop3 = split1.pop() as string | null
                        const concat1 = pop3 + "/" + pop2;
    
                        //console.log(pop1);
                        //console.log(concat1);
    
                        appWindow.setTitle("Iris - " + pop1 + " @ " + concat1);
                    });
    
                    await appWindow.setTitle("Iris - " + this.splitFolderConcat);
                }  
            }
        } else {
            const createDir = await fs.createDir("Iris_Notes", { 
                dir: fs.BaseDirectory.Desktop 
            });

            const entries = await fs.readDir("Iris_Notes", {
                dir: fs.BaseDirectory.Desktop,
                recursive: true
            });

            const createFile = await fs.writeFile({
                path: "Iris_Notes/Note.md",
                contents: ""
            }, {
                dir: fs.BaseDirectory.Desktop
            });

            //console.log(entries);

            //call function again to that folder is synced after creating dir
            this.OpenLFFolder();

            //set recArr length to 0 to reset array
            LocalFileDirectory.localFolderArr.length = 0;

            //call recursive function
            this.OpenLFFolderRecursive(entries);
        }

            //console.log(LocalFileDirectory.localFolderArr);
            //console.log(LocalFileDirectory.localFolderArr);
            //console.log(this.openFolder + " ---> " + typeof this.openFolder);
       
        (document.querySelector('#createFileInput') as HTMLElement).style.display = "";
        LocalFileDirectoryNode.deleteFileBtn.style.display = "";

        //check if parentFolder is in the DOM
        if((document.querySelector('.parentFolder'))) {
            this.folderFileString = LocalFileDirectory.localFolderArr.toString();
            this.splitFolderFile = this.folderFileString.split(',');
            this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
            //console.log(typeof this.folderFileString);
            
            //remove parentFolder from DOM if found
            (document.querySelector('.parentFolder') as ChildNode).remove();

            ProseMirrorEditor.readonly = false;

            ProseMirrorEditor.editor.destroy();
            ProseMirrorEditor.editor.create();

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder("Desktop/Iris_Notes", undefined)

            //sort localFolderArr alphabetically
            this.localFolderArrSortRef = LocalFileDirectory.localFolderArr.sort();

            //console.log(this.localFolderArrSortRef);

            //console.log(this.localFolderArrSortRef[0].toString().split('/').pop());

            //remove .DS_Store from sorted ref array
            if(this.localFolderArrSortRef[0].toString().split('/').pop() === ".DS_Store") {
                //this.localFolderArrSortRef.splice(0, 1);
                //or
                this.localFolderArrSortRef.shift();
            }

            //directly copy the local folder content array to a ref copy array for use later
            this.localFolderArrRefCopy.length = 0;
            for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
            }

            //console.log(this.localFolderArrRefCopy);
            
            this.localFolderArrRefCopy.shift();

            //split the ref array using regex character class array
            this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
            //console.log(this.lfArrSortRefSplit); 
            //console.log(lfSortRefSplit2);
            
            this.mdExtensionArr = [".md"];
            this.filterMdFiles = this.lfArrSortRefSplit.filter(
                mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
            ));

            //console.log(this.filterMdFiles);
            //console.log("ARRAY REF COPY OUTPUT");
            //console.log(this.localFolderArrRefCopy);
                        
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(this.filterMdFiles);

            //this will build the reference nodes for the directory tree files. 
            //the reference nodes will be hidden and present in the DOM, however they
            //will be used only for linking its full path to open files.
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesRefBuilder(this.localFolderArrSortRef);

            //logic for opening a file to the editor from an opened folder within 
            //the directory tree.
            const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFiles');
            //list files dom ref
            const listFilesDOMRef = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFilesRef');
            //console.log(listFiles);

            //iterate over files list
            for(let i = 0; i < listFiles.length; i++) { 
                listFiles[i].addEventListener('click', () => {
                    const getElemWithClass = document.querySelector('.activeFile');
                    if (getElemWithClass !== null) {
                        getElemWithClass.classList.remove('activeFile');
                    }
                    listFiles[i].classList.add('activeFile');

                    ProseMirrorEditor.readonly = true;

                    ProseMirrorEditor.editor.destroy();
                    ProseMirrorEditor.editor.create();

                    //iterate over list files dom ref array
                    for(let j = 0; j < listFilesDOMRef.length; j++) {
                        this.listFilesRef = listFilesDOMRef[i].textContent as string;
                    }

                    //console.log(this.listFilesRef);

                    const readText= fs.readTextFile(this.listFilesRef, {
                        dir: fs.BaseDirectory.Desktop
                    });

                    //reset
                    //this.fileArr.length = 0;
                    this.fileStr = " ";

                    //resolve promise for fs readTextFile 
                    Promise.resolve(readText).then((fileData) => {
                        this.fileStr = fileData;

                        //console.log(fileStr);
                        //open file content in editor
                        ProseMirrorEditor.editor.action(replaceAll(this.fileStr, true));

                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });

                        //show editor
                        ProseMirrorEditorNode.editorNode.style.display = "";

                        this.ReMode.readingMode_ProseMirror();

                        //check editor/reader display 
                        if(CodeMirror_EditorNode.editorNode.style.display === "") {
                            ProseMirrorEditorNode.editorNode.style.display = "none";
                            ReadingMode.readingModeNodeContainer.style.display = "none";
                        } else if(ReadingMode.readingModeNodeContainer.style.display === "") {
                            CodeMirror_EditorNode.editorNode.style.display = "none";
                            ProseMirrorEditorNode.editorNode.style.display = "none";
                        }

                        //show input button node container 
                        ProseMirrorEditorNode.inputButtonNodeContainer.style.display = "";

                        //remove disabled attribute from wysiwyg input label
                        ProseMirrorEditorNode.wysiwygInputNode.removeAttribute("disabled");

                        //set wysiwyg input to checked
                        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("checked", "");

                        //remove disabled attribute from markdown input label
                        ProseMirrorEditorNode.markdownInputNode.removeAttribute("disabled");

                        //remove disabled attribute from reading input label
                        ProseMirrorEditorNode.readingInputNode.removeAttribute("disabled");

                        //focus PM editor
                        (document.querySelector('.ProseMirror') as HTMLElement).focus();
                    }).catch(() => console.error("Unable to read text file."));

                    //console.log(this.fileStr);
                    //console.log(this.listFilesRef);

                    //set hidden rename input value to file name
                    ProseMirrorEditorNode.renameInputNodeHidden.value = listFiles[i].innerHTML;

                    //temp naming
                    const split1 = this.listFilesRef.split('/');
                    const pop1 = split1.pop() as string | null;
                    const pop2 = split1.pop() as string | null;
                    const pop3 = split1.pop() as string | null
                    const concat1 = pop3 + "/" + pop2;

                    //console.log(pop1);
                    //console.log(concat1);

                    appWindow.setTitle("Iris - " + pop1 + " @ " + concat1);
                });

                await appWindow.setTitle("Iris - " + "@ " + "Desktop/Iris_Notes");
            }  
        } else {
            this.folderFileString = LocalFileDirectory.localFolderArr.toString();
            this.splitFolderFile = this.folderFileString.split(',');
            this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
            //console.log(typeof this.folderFileString);

            (document.querySelector('#createFileInput') as HTMLElement).style.display = "";
            LocalFileDirectoryNode.deleteFileBtn.style.display = "";

            ProseMirrorEditor.readonly = true;

            ProseMirrorEditor.editor.destroy();
            ProseMirrorEditor.editor.create();

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder("Desktop/Iris_Notes", undefined);

            this.localFolderArrSortRef = LocalFileDirectory.localFolderArr.sort();

            //directly copy the local folder content array to a ref copy array for use later
            this.localFolderArrRefCopy.length = 0;
            for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
            }

            this.localFolderArrRefCopy.shift();

            //console.log(this.localFolderArrRefCopy);

            //split the ref array using regex character class array
            this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);

            //console.log(this.lfArrSortRefSplit); 
            //console.log(lfSortRefSplit2);

            this.mdExtensionArr = [".md"];
            this.filterMdFiles = this.lfArrSortRefSplit.filter(
                mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
            ));

            //console.log(this.filterMdFiles);
            //console.log("ARRAY REF COPY OUTPUT");
            //console.log(this.localFolderArrRefCopy);
            
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(this.filterMdFiles);
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesRefBuilder(this.localFolderArrRefCopy);
            
            //logic for opening a file to the editor from an opened folder within 
            //the directory tree.
            const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFiles');

            //list files dom ref
            const listFilesDOMRef = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFilesRef');

            //console.log(listFiles);

            for(let i = 0; i < listFiles.length; i++) {
                listFiles[i].addEventListener('click', () => {
                    const getElemWithClass = document.querySelector('.activeFile');
                    if(getElemWithClass !== null) {
                        getElemWithClass.classList.remove('activeFile');
                    }
                    listFiles[i].classList.add('activeFile');

                    ProseMirrorEditor.readonly = true;

                    ProseMirrorEditor.editor.destroy();
                    ProseMirrorEditor.editor.create();

                    //iterate over list files dom ref array
                    for(let j = 0; j < listFilesDOMRef.length; j++) {
                        this.listFilesRef = listFilesDOMRef[i].textContent as string;
                    }

                    //console.log(this.listFilesRef);

                    const readText= fs.readTextFile(this.listFilesRef, {
                        dir: fs.BaseDirectory.Desktop
                    });

                    //reset
                    //this.fileArr.length = 0;
                    this.fileStr = " "; 

                    //resolve promise for fs readTextFile 
                    Promise.resolve(readText).then((fileData) => {
                        this.fileStr = fileData;

                        //console.log(fileStr);
                        //open file content in editor
                        ProseMirrorEditor.editor.action(replaceAll(this.fileStr, true));
                        
                        CodeMirror_EditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: CodeMirror_EditorView.editorView.state.doc.length,
                                insert: ProseMirrorEditor.editor.action(getMarkdown())
                            }
                        });

                        this.ReMode.readingMode_ProseMirror();

                        //show editor
                        ProseMirrorEditorNode.editorNode.style.display = "";

                        if(CodeMirror_EditorNode.editorNode.style.display === "") {
                            ProseMirrorEditorNode.editorNode.style.display = "none";
                            ReadingMode.readingModeNodeContainer.style.display = "none";
                        } else if(ReadingMode.readingModeNodeContainer.style.display === "") {
                            CodeMirror_EditorNode.editorNode.style.display = "none";
                            ProseMirrorEditorNode.editorNode.style.display = "none";
                        }

                        //show input button node container 
                        ProseMirrorEditorNode.inputButtonNodeContainer.style.display = "";

                        //remove disabled attribute from wysiwyg input label
                        ProseMirrorEditorNode.wysiwygInputNode.removeAttribute("disabled");

                        //set wysiwyg input to checked
                        ProseMirrorEditorNode.wysiwygInputNode.setAttribute("checked", "");

                        //remove disabled attribute from markdown input label
                        ProseMirrorEditorNode.markdownInputNode.removeAttribute("disabled");

                        //remove disabled attribute from reading input label
                        ProseMirrorEditorNode.readingInputNode.removeAttribute("disabled");

                        //focus PM editor
                        (document.querySelector('.ProseMirror') as HTMLElement).focus();

                        //console.log(this.fileStr);
                    }).catch(() => console.error("Unable to read text file."));;
                
                    //console.log((document.querySelector('#inputButtonNodeContainer') as HTMLElement).getElementsByTagName('input'));
                    //console.log(this.fileStr);
                    //console.log(this.listFilesRef);

                    //temp naming
                    const split1 = this.listFilesRef.split('/');
                    const pop1 = split1.pop() as string | null;
                    const pop2 = split1.pop() as string | null;
                    const pop3 = split1.pop() as string | null
                    const concat1 = pop3 + "/" + pop2;

                    //console.log(pop1);
                    //console.log(concat1);

                    appWindow.setTitle("Iris - " + pop1 + " @ " + concat1);
                });

                await appWindow.setTitle("Iris - " + "Desktop/Iris_Notes");
            }  
        }
    }

    //save file
    public async saveLF(): Promise<void> {
        this.saveFileConst = FileSystemConstants.SaveFile;

        //console.log(this.saveFileConst);

        //console.log(this.listFilesRef);
        
        //check if prosemirror editor is displayed
        if(ProseMirrorEditorNode.editorNode.style.display === "") {
            //write to file
            this.saveFile = await fs.writeTextFile({ 
                path: this.listFilesRef, 
                contents: ProseMirrorEditor.editor.action(getMarkdown())
            }, { 
                dir: fs.BaseDirectory.Desktop //|| fs.BaseDirectory.Home
            });
        //check if codemirror editor is displayed
        } else if(CodeMirror_EditorNode.editorNode.style.display === "") {
            //write to file
            this.saveFile = await fs.writeTextFile({ 
                path: this.listFilesRef, 
                contents: CodeMirror_EditorView.editorView.state.doc.toString()
            }, { 
                dir: fs.BaseDirectory.Desktop //|| fs.BaseDirectory.Home
            });
        } else {
            throw console.error("Cannot save from editor.");
        }
    }

    //create file
    public async createFile(fileName: string): Promise<void> {
        const createFile = await fs.writeFile({
            path: `Iris_Notes/${fileName}.md`,
            contents: ""
        }, {
            dir: fs.BaseDirectory.Desktop
        });
    }

    //rename file 
    public async renameFile(): Promise<void> {
        const renameFile = await fs.renameFile(
            "Iris_Notes/" + ProseMirrorEditorNode.renameInputNodeHidden.value, 
            "Iris_Notes/" + ProseMirrorEditorNode.renameInputNode.value + ".md", {
                dir: fs.BaseDirectory.Desktop
            }
        );
    }   
    
    //delete file 
    public async deleteFile() {
        const confirmDeletion = await dialog.ask(
            "Are you sure you want to delete " + ProseMirrorEditorNode.renameInputNodeHidden.value 
            + " from Desktop/Iris_Notes?", { 
            title: "Iris", 
            type: 'warning'
        });

        //check if user clicked yes or no
        if(confirmDeletion === true) {  
            await fs.removeFile(
                "Iris_Notes/" + ProseMirrorEditorNode.renameInputNodeHidden.value, {
                    dir: fs.BaseDirectory.Desktop
                }
            );
        } else if(confirmDeletion === false) {
            throw console.error("Canceled deletion of file.");
        }
    }
} 
