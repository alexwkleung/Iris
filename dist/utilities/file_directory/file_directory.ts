/* 
* file: `file_directory.ts`
*
* this file creates the file directory that is beside the editor within the 
* main window in the front-end 
*
* TypeScript and/or Rust (Tauri/Native API) will be used for
* processing folders/files in the OS
*
* for now, the majority of file operations will be done through the TypeScript API and will move 
* to the Rust API later once the core structure is down (maybe)
*
* at the moment, the file directory will only handle local files
*
* later on, there is a possibly of a local/remote database that will be added in here 
* in parallel to the local file directory
*
* note that implementations may change over time
*
*/

import { App } from '../../app'
import { dialog, fs, path } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { e } from '@tauri-apps/api/fs-4bb77382'
import { ProseMirrorEditor } from '../../prosemirror/pm_editor_state/pm_editor_state'
import { getMarkdown, replaceAll } from '@milkdown/utils'
import { FileSystemConstants } from '../constants/constants'
import { FileDirectoryBuilder } from '../dom_builder/dom_builder'
import { ProseMirrorEditorNode } from '../../prosemirror/pm_editor_node'
import { CodeMirror_EditorView } from '../../codemirror/cm_editor_view/cm_editor_view'
import { ReadingMode } from '../../reading_mode/reading_mode'

//stylesheets
import '../../styles/file_directory.css'
import { CodeMirror_EditorNode } from '../../codemirror/cm_editor/cm_editor'

//Local File Directory Node class
export class LocalFileDirectoryNode {
    //passable created DOM node variables to reference later
    static fileDirectoryNodeParent: HTMLDivElement;
    static browseFolderBtn: HTMLButtonElement;
    static openFileBtn: HTMLButtonElement;
    static saveFileBtn: HTMLButtonElement;
    static fileDirectoryNode: HTMLDivElement;
    static folderContainerNode: HTMLDivElement;
    static deleteFileBtn: HTMLButtonElement;

    public LFDirectoryDiv() {
        //file directory div (parent)
        LocalFileDirectoryNode.fileDirectoryNodeParent = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNodeParent.setAttribute("id", "fileDirectoryParent");
        
        App.appNodeContainer.appendChild(LocalFileDirectoryNode.fileDirectoryNodeParent) as HTMLDivElement;

        const fileDirectoryInteractionContainer = document.createElement('div') as HTMLDivElement;
        fileDirectoryInteractionContainer.setAttribute("id", "fileDirectoryInteractionContainer");

        App.appNodeContainer.appendChild(fileDirectoryInteractionContainer);

        //browse folder button (temporary)
        LocalFileDirectoryNode.browseFolderBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.browseFolderBtn.setAttribute("id", "openFolder");
     
        //browse folder button text node (temporary)
        const FFTextNode1 = document.createTextNode("Open/Sync Folder");
        LocalFileDirectoryNode.browseFolderBtn.appendChild(FFTextNode1);

        fileDirectoryInteractionContainer.appendChild(LocalFileDirectoryNode.browseFolderBtn);

        //LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.browseFolderBtn);

        //open file button (temporary)
        /*
        LocalFileDirectoryNode.openFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.openFileBtn.setAttribute("id", "openFile");

        const OFTextNode1 = document.createTextNode("Open File");
        LocalFileDirectoryNode.openFileBtn.appendChild(OFTextNode1);
        LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.openFileBtn);
        */

        //save file button (temporary)
        /*
        LocalFileDirectoryNode.saveFileBtn = document.createElement('button') as HTMLButtonElement;
        LocalFileDirectoryNode.saveFileBtn.setAttribute("id", "saveFile");

        const SFTextNode1 = document.createTextNode("Save File");
        LocalFileDirectoryNode.saveFileBtn.appendChild(SFTextNode1);
        LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.saveFileBtn);
        */

        //file directory div (child)
        LocalFileDirectoryNode.fileDirectoryNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.fileDirectoryNode.setAttribute("id", "fileDirectory");
        
        App.appNodeContainer.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
        
        //const fileDirectoryParent = document.querySelector('#fileDirectoryParent') as HTMLDivElement;

        //folder directory container
        LocalFileDirectoryNode.folderContainerNode = document.createElement('div') as HTMLDivElement;
        LocalFileDirectoryNode.folderContainerNode.setAttribute("id", "folderContainer");
                
        LocalFileDirectoryNode.fileDirectoryNode.appendChild(LocalFileDirectoryNode.folderContainerNode) as HTMLDivElement;
                
        //const folderContainer = document.querySelector('#fileDirectory') as HTMLDivElement;
        
        //create file node
        const createFile = document.createElement('input') as HTMLDivElement;
        createFile.setAttribute("id", "createFileInput");
        createFile.setAttribute("type", "text");
        createFile.setAttribute("placeholder", "Create File...");
        createFile.style.display = "none";

        //create file text node
        const createFileTextNode = document.createTextNode("Create File") as Text;
        createFile.appendChild(createFileTextNode);

        fileDirectoryInteractionContainer.appendChild(createFile);

        //LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(createFile);

        //input box button
        /*
        const inputBoxBtn = document.createElement('button') as HTMLButtonElement;
        inputBoxBtn.setAttribute("id", "inputBoxBtn");
        inputBoxBtn.style.display = "none";

        //input box button text node
        const inputBoxBtnTextNode = document.createTextNode("->") as Text;
        
        inputBoxBtn.appendChild(inputBoxBtnTextNode);

        //LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(inputBoxBtn);
        fileDirectoryInteractionContainer.appendChild(inputBoxBtn);
        */

        //delete file button
        LocalFileDirectoryNode.deleteFileBtn = document.createElement('button');
        LocalFileDirectoryNode.deleteFileBtn.setAttribute("id", "deleteFileButton");

        //delete file button text node
        const deleteFileBtnTextNode = document.createTextNode("Delete File");
        LocalFileDirectoryNode.deleteFileBtn.appendChild(deleteFileBtnTextNode);
        LocalFileDirectoryNode.deleteFileBtn.style.display = "none";

        fileDirectoryInteractionContainer.appendChild(LocalFileDirectoryNode.deleteFileBtn);

        return LocalFileDirectoryNode.fileDirectoryNodeParent.appendChild(LocalFileDirectoryNode.fileDirectoryNode) as HTMLDivElement;
    }
}

//Local File Directory class
export class LocalFileDirectory {
    //FileDirectoryBuilder object
    private FileDirectoryBuilder = new FileDirectoryBuilder() as FileDirectoryBuilder;

    private ReMode = new ReadingMode() as ReadingMode;

    //string to hold data from file
    static openFileString: string = "";

    //string to hold data from file
    static saveFileString: string;

    //local folder array
    static localFolderArr: string[] = [];

    //local file array
    static localFileArr: string[] = [];

    //open folder variables
    public openFolder: string;
    public splitFolderDirectory: string[];
    public splitFolderPop1: string | null;
    public splitFolderPop2: string | null;
    public splitFolderConcat: string;

    public folderFileString: string;
    public splitFolderFile: string[];
    public splitFolderFilePop1: string | null;
    public splitFolderFilePop2: string | null;
    public splitFolderFileConcat1: string;
    public splitFolderFileConcat2: string;
    public splitFolderFileConcat3: string;

    //open file variables
    public openFile: string;
    public splitFileDirectory: string[];
    public splitFilePop1: string | null;
    public splitFilePop2: string | null;
    public splitFilePop3: string | null;
    public splitFileConcat1: string;
    public splitFileConcat2: string;

    //save file variables
    public saveFile: void;

    //private variables to assign constants
    //private openFileConst: string;
    private saveFileConst: string;

    //file array + string refs
    public fileArr: string[] = [];
    public fileStr: string = "";

    //list files ref
    public listFilesRef: string = "";

    //local folder array refs
    public localFolderArrSortRef: string[];
    public localFolderArrShiftRef: string | undefined;

    //copy refs for local folder filter
    public localFolderArrRefCopy: string[] = [];
    public lfArrSortRefSplit: string[];
    public mdExtensionArr: string[];
    public filterMdFiles: string[];

    //recursively iterate over folder contents
    private OpenLFFolderRecursive(entries: e[]) {
        for(const entry of entries) {
            console.log(entry.path);
            //check type of path
            console.log(typeof entry.path);

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
    public async OpenLFFolder(): Promise<void> {
        //open folder dialog
        /*
        this.openFolder = await dialog.open({
            directory: true,
            defaultPath: await path.desktopDir() //await path.homeDir()
        }) as string;
        */

        //exception handle
        //if(this.openFolder) {

        if(await fs.exists("Iris_Notes", { dir: fs.BaseDirectory.Desktop})) {
            const entries = await fs.readDir("Iris_Notes", {
                dir: fs.BaseDirectory.Desktop,
                recursive: true
            });
            
            console.log(entries);

            //call function again to that folder is synced after creating dir
            //this.OpenLFFolder();

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
                console.log(typeof this.folderFileString);
                
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
                //shift localFolderArray
                //since the array is alphabetically sorted, we can also assume that .DS_STORE 
                //would be end up being the first element of the array.
                //
                //since .DS_STORE is the only dotfile we want to take out (so it doesn't show in the 
                //file directory tree), then this method would work okay for now until 
                //further complications show up
                //this.localFolderArrShiftRef = this.localFolderArrSortRef.splice(0, 1).toString();
                //this.localFolderArrShiftRef = this.localFolderArrSortRef.shift();
                //this.localFolderArrSortRef.shift();
    
                //directly copy the local folder content array to a ref copy array for use later
                this.localFolderArrRefCopy.length = 0;
                for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                    this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
                }
    ////
                console.log(this.localFolderArrRefCopy);
                
                this.localFolderArrRefCopy.shift();
    
                //split the ref array using regex character class array
                this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
                //let lfSortRefSplit2: string[] | undefined = this.localFolderArrShiftRef?.split(',');
                console.log(this.lfArrSortRefSplit); 
                //console.log(lfSortRefSplit2);
                
                this.mdExtensionArr = [".md"];
                this.filterMdFiles = this.lfArrSortRefSplit.filter(
                    mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
                ));
                console.log(this.filterMdFiles);
                
                console.log("ARRAY REF COPY OUTPUT");
                console.log(this.localFolderArrRefCopy);
                            
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
                console.log(listFiles);
    
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
                        //this.listFilesRef = listFiles[i].textContent as string; 
    
                        console.log(this.listFilesRef);
    
                        const readText= fs.readTextFile(this.listFilesRef, {
                            dir: fs.BaseDirectory.Desktop
                        });
    
                        //reset
                        this.fileArr.length = 0;
                        this.fileStr = " ";
    
                        //resolve promise for fs readTextFile 
                        Promise.resolve(readText).then((fileData) => {
                            //resolved promise value 
                            //will be pushed into array
                            this.fileArr.push(fileData);
                            console.log(this.fileArr);
    
                            //iterate over array containing 
                            //file content
                            for(let fileIndex of this.fileArr) {
                                this.fileStr = fileIndex;
                            }
    
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
                        });
    
                        console.log(this.fileStr);
                        console.log(this.listFilesRef);
    
                        //temp naming
                        const split1 = this.listFilesRef.split('/');
                        const pop1 = split1.pop() as string | null;
                        const pop2 = split1.pop() as string | null;
                        const pop3 = split1.pop() as string | null
                        const concat1 = pop3 + "/" + pop2;
    
                        console.log(pop1);
                        console.log(concat1);
    
                        appWindow.setTitle("Iris-dev-build - " + pop1 + " @ " + concat1);
                    });
    
                    await appWindow.setTitle("Iris-dev-build - " + this.splitFolderConcat);
                }  
            } else {
                this.folderFileString = LocalFileDirectory.localFolderArr.toString();
                this.splitFolderFile = this.folderFileString.split(',');
                this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
                console.log(typeof this.folderFileString);
    
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

                //this.localFolderArrShiftRef = this.localFolderArrSortRef.splice(0, 1).toString();
    
                //this.localFolderArrShiftRef = this.localFolderArrSortRef.shift();
    
                //directly copy the local folder content array to a ref copy array for use later
                this.localFolderArrRefCopy.length = 0;
                for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                    this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
                }
    ////
                this.localFolderArrRefCopy.shift();
    
                console.log(this.localFolderArrRefCopy);
    
                //split the ref array using regex character class array
                this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
                console.log(this.lfArrSortRefSplit); 
                //console.log(lfSortRefSplit2);
    
                this.mdExtensionArr = [".md"];
                this.filterMdFiles = this.lfArrSortRefSplit.filter(
                    mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
                ));
                console.log(this.filterMdFiles);
    
                console.log("ARRAY REF COPY OUTPUT");
                console.log(this.localFolderArrRefCopy);
                
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(this.filterMdFiles);
                this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesRefBuilder(this.localFolderArrRefCopy);
                
                //logic for opening a file to the editor from an opened folder within 
                //the directory tree.
                const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFiles');
                //list files dom ref
                const listFilesDOMRef = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFilesRef');
                console.log(listFiles);
    
                for(let i = 0; i < listFiles.length; i++) {
                    listFiles[i].addEventListener('click', () => {
                        const getElemWithClass = document.querySelector('.activeFile');
                        if(getElemWithClass !== null) {
                            getElemWithClass.classList.remove('activeFile');
                        }
                        //add the active class to the element from which click event triggered
                        listFiles[i].classList.add('activeFile');
    
                        console.log('click');
                        ProseMirrorEditor.readonly = true;
    
                        ProseMirrorEditor.editor.destroy();
                        ProseMirrorEditor.editor.create();
    
                        //iterate over list files dom ref array
                        for(let j = 0; j < listFilesDOMRef.length; j++) {
                            this.listFilesRef = listFilesDOMRef[i].textContent as string;
                        }
    
                        //this.listFilesRef = listFiles[i].textContent as string; 
    
                        console.log(this.listFilesRef);
    
                        const readText= fs.readTextFile(this.listFilesRef, {
                            dir: fs.BaseDirectory.Desktop
                        });
    
                        //reset
                        this.fileArr.length = 0;
                        this.fileStr = " "; 
    
                        //resolve promise for fs readTextFile 
                        Promise.resolve(readText).then((fileData) => {
                            //resolved promise value 
                            //will be pushed into array
                            this.fileArr.push(fileData);
                            console.log(this.fileArr);
    
                            //iterate over array containing 
                            //file content
                            for(let fileIndex of this.fileArr) {
                                this.fileStr = fileIndex;
                            }
    
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
    
                            console.log(this.fileStr);
                        });
                    
                        console.log((document.querySelector('#inputButtonNodeContainer') as HTMLElement).getElementsByTagName('input'));
    
                        console.log(this.fileStr);
                        console.log(this.listFilesRef);
    
                        //temp naming
                        const split1 = this.listFilesRef.split('/');
                        const pop1 = split1.pop() as string | null;
                        const pop2 = split1.pop() as string | null;
                        const pop3 = split1.pop() as string | null
                        const concat1 = pop3 + "/" + pop2;
    
                        console.log(pop1);
                        console.log(concat1);
    
                        appWindow.setTitle("Iris-dev-build - " + pop1 + " @ " + concat1);
                    });
    
                    await appWindow.setTitle("Iris-dev-build - " + this.splitFolderConcat);
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

            /*
            const createFileTemp = await fs.writeFile({
                path: "Iris_Notes/.temp.md",
                contents: ""
            }, {
                dir: fs.BaseDirectory.Desktop
            });
            */

            const createFile = await fs.writeFile({
                path: "Iris_Notes/Note.md",
                contents: ""
            }, {
                dir: fs.BaseDirectory.Desktop
            });

            console.log(entries);

            //call function again to that folder is synced after creating dir
            this.OpenLFFolder();

            //set recArr length to 0 to reset array
            LocalFileDirectory.localFolderArr.length = 0;

            //call recursive function
            this.OpenLFFolderRecursive(entries);
        }

        /*
            const entries = await fs.readDir("Iris_Notes", {
                dir: fs.BaseDirectory.Desktop,
                recursive: true
            });
            
            console.log(entries);

            //set recArr length to 0 to reset array
            LocalFileDirectory.localFolderArr.length = 0;

            //call recursive function
            this.OpenLFFolderRecursive(entries);
            */

            console.log(LocalFileDirectory.localFolderArr);
            console.log(LocalFileDirectory.localFolderArr);
            console.log(this.openFolder + " ---> " + typeof this.openFolder);
            /*
        } else if(this.openFolder === null) {
            throw console.log("User canceled open dialog: Promise Rejected.")
        } 
        */

        /*
        this.splitFolderDirectory = this.openFolder.split('/');
        this.splitFolderPop1 = this.splitFolderDirectory.pop() as string | null;
        this.splitFolderPop2 = this.splitFolderDirectory.pop()  as string | null;
        this.splitFolderConcat = this.splitFolderPop2 + "/" + this.splitFolderPop1 as string;
        */
       
        (document.querySelector('#createFileInput') as HTMLElement).style.display = "";
        LocalFileDirectoryNode.deleteFileBtn.style.display = "";

        //check if parentFolder is in the DOM
        if((document.querySelector('.parentFolder'))) {
            this.folderFileString = LocalFileDirectory.localFolderArr.toString();
            this.splitFolderFile = this.folderFileString.split(',');
            this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
            console.log(typeof this.folderFileString);
            
            //remove parentFolder from DOM if found
            (document.querySelector('.parentFolder') as ChildNode).remove();

            ProseMirrorEditor.readonly = false;

            ProseMirrorEditor.editor.destroy();
            ProseMirrorEditor.editor.create();

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder("Desktop/Iris_Notes", undefined)

            //sort localFolderArr alphabetically
            this.localFolderArrSortRef = LocalFileDirectory.localFolderArr.sort();

            //shift localFolderArray
            //since the array is alphabetically sorted, we can also assume that .DS_STORE 
            //would be end up being the first element of the array.
            //
            //since .DS_STORE is the only dotfile we want to take out (so it doesn't show in the 
            //file directory tree), then this method would work okay for now until 
            //further complications show up
            //this.localFolderArrShiftRef = this.localFolderArrSortRef.splice(0, 1).toString();
            //this.localFolderArrShiftRef = this.localFolderArrSortRef.shift();
            //this.localFolderArrSortRef.shift();

            console.log("OPOPO");
            console.log(this.localFolderArrSortRef);

            console.log(this.localFolderArrSortRef[0].toString().split('/').pop());

            //remove .DS_Store from sorted ref array
            if(this.localFolderArrSortRef[0].toString().split('/').pop() === ".DS_Store") {
                //this.localFolderArrSortRef.splice(0, 1);
                //or
                this.localFolderArrSortRef.shift();
            }

            //console.log(this.localFolderArrSortRef);

            //directly copy the local folder content array to a ref copy array for use later
            this.localFolderArrRefCopy.length = 0;
            for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
            }
////
            console.log(this.localFolderArrRefCopy);
            
            this.localFolderArrRefCopy.shift();

            //split the ref array using regex character class array
            this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
            //let lfSortRefSplit2: string[] | undefined = this.localFolderArrShiftRef?.split(',');
            console.log(this.lfArrSortRefSplit); 
            //console.log(lfSortRefSplit2);
            
            this.mdExtensionArr = [".md"];
            this.filterMdFiles = this.lfArrSortRefSplit.filter(
                mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
            ));
            console.log(this.filterMdFiles);
            
            console.log("ARRAY REF COPY OUTPUT");
            console.log(this.localFolderArrRefCopy);
                        
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
            console.log(listFiles);

            //iterate over files list
            for(let i = 0; i < listFiles.length; i++) { 
                listFiles[i].addEventListener('click', () => {
                    const getElemWithClass = document.querySelector('.activeFile');
                    if (getElemWithClass !== null) {
                        getElemWithClass.classList.remove('activeFile');
                    }
                    //add the active class to the element from which click event triggered
                    listFiles[i].classList.add('activeFile');

                    ProseMirrorEditor.readonly = true;

                    ProseMirrorEditor.editor.destroy();
                    ProseMirrorEditor.editor.create();

                    //iterate over list files dom ref array
                    for(let j = 0; j < listFilesDOMRef.length; j++) {
                        this.listFilesRef = listFilesDOMRef[i].textContent as string;
                    }
                    //this.listFilesRef = listFiles[i].textContent as string; 

                    console.log(this.listFilesRef);

                    const readText= fs.readTextFile(this.listFilesRef, {
                        dir: fs.BaseDirectory.Desktop
                    });

                    //reset
                    this.fileArr.length = 0;
                    this.fileStr = " ";

                    //resolve promise for fs readTextFile 
                    Promise.resolve(readText).then((fileData) => {
                        //resolved promise value 
                        //will be pushed into array
                        this.fileArr.push(fileData);
                        console.log(this.fileArr);

                        //iterate over array containing 
                        //file content
                        for(let fileIndex of this.fileArr) {
                            this.fileStr = fileIndex;
                        }

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
                    });

                    console.log(this.fileStr);
                    console.log(this.listFilesRef);

                    //set hidden rename input value to file name
                    ProseMirrorEditorNode.renameInputNodeHidden.value = listFiles[i].innerHTML;

                    //temp naming
                    const split1 = this.listFilesRef.split('/');
                    const pop1 = split1.pop() as string | null;
                    const pop2 = split1.pop() as string | null;
                    const pop3 = split1.pop() as string | null
                    const concat1 = pop3 + "/" + pop2;

                    console.log(pop1);
                    console.log(concat1);

                    appWindow.setTitle("Iris-dev - " + pop1 + " @ " + concat1);
                });

                await appWindow.setTitle("Iris-dev - " + "@ " + "Desktop/Iris_Notes");
            }  
        } else {
            this.folderFileString = LocalFileDirectory.localFolderArr.toString();
            this.splitFolderFile = this.folderFileString.split(',');
            this.splitFolderFilePop1 = this.splitFolderFile.pop() as string | null;
            console.log(typeof this.folderFileString);

            (document.querySelector('#createFileInput') as HTMLElement).style.display = "";
            LocalFileDirectoryNode.deleteFileBtn.style.display = "";

            ProseMirrorEditor.readonly = true;

            ProseMirrorEditor.editor.destroy();
            ProseMirrorEditor.editor.create();

            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder("Desktop/Iris_Notes", undefined);

            this.localFolderArrSortRef = LocalFileDirectory.localFolderArr.sort();

            //this.localFolderArrShiftRef = this.localFolderArrSortRef.splice(0, 1).toString();

            //this.localFolderArrShiftRef = this.localFolderArrSortRef.shift();

            //directly copy the local folder content array to a ref copy array for use later
            this.localFolderArrRefCopy.length = 0;
            for(let i = 0; i < this.localFolderArrSortRef.length; i++) {
                this.localFolderArrRefCopy.push(this.localFolderArrSortRef[i]);
            }
////
            this.localFolderArrRefCopy.shift();

            console.log(this.localFolderArrRefCopy);

            //split the ref array using regex character class array
            this.lfArrSortRefSplit = this.localFolderArrSortRef.toString().split(/[,/]/);
            console.log(this.lfArrSortRefSplit); 
            //console.log(lfSortRefSplit2);

            this.mdExtensionArr = [".md"];
            this.filterMdFiles = this.lfArrSortRefSplit.filter(
                mdFilter => this.mdExtensionArr.some(end => mdFilter.endsWith(end)
            ));
            console.log(this.filterMdFiles);

            console.log("ARRAY REF COPY OUTPUT");
            console.log(this.localFolderArrRefCopy);
            
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesBuilder(this.filterMdFiles);
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeFilesRefBuilder(this.localFolderArrRefCopy);
            
            //logic for opening a file to the editor from an opened folder within 
            //the directory tree.
            const listFiles = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFiles');
            //list files dom ref
            const listFilesDOMRef = (document.querySelector('.nested') as HTMLElement).getElementsByClassName('noteFilesRef');
            console.log(listFiles);

            for(let i = 0; i < listFiles.length; i++) {
                listFiles[i].addEventListener('click', () => {
                    // if so then remove the class from it
                    const getElemWithClass = document.querySelector('.activeFile');
                    if(getElemWithClass !== null) {
                        getElemWithClass.classList.remove('activeFile');
                    }
                    //add the active class to the element from which click event triggered
                    listFiles[i].classList.add('activeFile');

                    console.log('click');
                    ProseMirrorEditor.readonly = true;

                    ProseMirrorEditor.editor.destroy();
                    ProseMirrorEditor.editor.create();

                    //iterate over list files dom ref array
                    for(let j = 0; j < listFilesDOMRef.length; j++) {
                        this.listFilesRef = listFilesDOMRef[i].textContent as string;
                    }

                    //this.listFilesRef = listFiles[i].textContent as string; 

                    console.log(this.listFilesRef);

                    const readText= fs.readTextFile(this.listFilesRef, {
                        dir: fs.BaseDirectory.Desktop
                    });

                    //reset
                    this.fileArr.length = 0;
                    this.fileStr = " "; 

                    //resolve promise for fs readTextFile 
                    Promise.resolve(readText).then((fileData) => {
                        //resolved promise value 
                        //will be pushed into array
                        this.fileArr.push(fileData);
                        console.log(this.fileArr);

                        //iterate over array containing 
                        //file content
                        for(let fileIndex of this.fileArr) {
                            this.fileStr = fileIndex;
                        }

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

                        console.log(this.fileStr);
                    });
                
                    console.log((document.querySelector('#inputButtonNodeContainer') as HTMLElement).getElementsByTagName('input'));

                    console.log(this.fileStr);
                    console.log(this.listFilesRef);

                    //temp naming
                    const split1 = this.listFilesRef.split('/');
                    const pop1 = split1.pop() as string | null;
                    const pop2 = split1.pop() as string | null;
                    const pop3 = split1.pop() as string | null
                    const concat1 = pop3 + "/" + pop2;

                    console.log(pop1);
                    console.log(concat1);

                    appWindow.setTitle("Iris-dev - " + pop1 + " @ " + concat1);
                });

                await appWindow.setTitle("Iris-dev - " + "Desktop/Iris_Notes");
            }  
        }
    }

    //open file dialog
    /*
    public async OpenLF(): Promise<void> {
        //reset local file array
        LocalFileDirectory.localFileArr.length = 0;

        LocalFileDirectory.openFileString = " ";

        //open file dialog
        this.openFile = await dialog.open({
            filters: [{
                name: "Accepted File Types",
                extensions: ["md"],
            }], 
            recursive: true,
        }) as string;

        const readFileToArr = fs.readTextFile(this.openFile, {
            dir: fs.BaseDirectory.Desktop //|| fs.BaseDirectory.Home
        })

        //const fileDirectory = document.querySelector('#fileDirectory') as HTMLElement;
        
        //temporary directory folder title
        this.splitFileDirectory = this.openFile.split('/');
        this.splitFilePop1 = this.splitFileDirectory.pop() as string | null;
        this.splitFilePop2 = this.splitFileDirectory.pop() as string | null;
        this.splitFilePop3 = this.splitFileDirectory.pop() as string | null;
        this.splitFileConcat1 = this.splitFilePop3 + "/" + this.splitFilePop2 as string;

        this.splitFileConcat2 = this.splitFilePop3 + "/" + this.splitFilePop2;

        //check if parentFolder is in DOM
        if((document.querySelector('.parentFolder'))) {
            //remove parentFolder from DOM if found
            (document.querySelector('.parentFolder') as ChildNode).remove();

            //then

            //re-build file directory tree based on opened file
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder(this.splitFileConcat2, this.splitFilePop1);
        } else {
            //build file directory based on opened file
            this.FileDirectoryBuilder.Eva_FileDirectoryTreeBuilder(this.splitFileConcat2, this.splitFilePop1);
        }

        console.log(EvaDOMBuilderUtil.prevParentNode);

        Promise.resolve(this.openFile).then((): void => {
            Promise.resolve(readFileToArr).then((fileData): void => {
                LocalFileDirectory.localFileArr.push(fileData);

                console.log(LocalFileDirectory.localFileArr);
            });
        });

        //exception handle 
        if(this.openFile) {
            //set openFileConst to OpenFile constant ("File Opened")
            this.openFileConst = FileSystemConstants.OpenFile;

            console.log(this.openFileConst);

            //log path to file
            console.log(this.openFile);

            //resolve promise from readTextFile to handle data
            //and push that data into fileArr array
            await Promise.resolve(readFileToArr).then((fileData) => {
                LocalFileDirectory.localFileArr.push(fileData);
            }); 

            //ensure data is passed 
            //
            //this logic must be tweaked in order to handle multiple files
            //
            for(let folderIndex of LocalFileDirectory.localFileArr) {
                LocalFileDirectory.openFileString = folderIndex;

                //console.log("INSIDE LOOP:");
                //console.log(LocalFileDirectory.openFileString);
                //break;
            }

            //console.log("OUTSIDE LOOP:")
            //console.log(LocalFileDirectory.openFileString);

            //check if editor node is present in the DOM before inserting file content
            if(document.querySelector('.milkdown')) {
                //await ProseMirrorEditor.editor.destroy();
                ProseMirrorEditor.readonly = true;
                //await ProseMirrorEditor.editor.create();

                //insert raw markdown string into editor state by replacing 
                //all its contents with the opened file string
                ProseMirrorEditor.editor.action(replaceAll(LocalFileDirectory.openFileString, true));

                //update CodeMirror instance
                CodeMirror_EditorView.editorView.dispatch({
                    changes: {
                        from: 0,
                        to: CodeMirror_EditorView.editorView.state.doc.length,
                        insert: ProseMirrorEditor.editor.action(getMarkdown())
                    }
                });

                //update reader instance
                this.ReMode.readingMode_ProseMirror();

                ///adsasdasdasdasdas
                if(ProseMirrorEditorNode.editorNode.style.display === "none") {
                    ProseMirrorEditorNode.editorNode.style.display = "";
                }
                if(CodeMirror_EditorNode.editorNode.style.display === "") {
                    ReadingMode.readingModeNodeContainer.style.display = "none";
                    ProseMirrorEditorNode.editorNode.style.display = "none";
                } else if(ReadingMode.readingModeNodeContainer.style.display === "") {
                    CodeMirror_EditorNode.editorNode.style.display = "none";
                    ProseMirrorEditorNode.editorNode.style.display = "none";
                }

                //show editor
                //ProseMirrorEditorNode.editorNode.style.display = "";

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
            } else {
                ProseMirrorEditor.readonly = true;

                await ProseMirrorEditor.editor.create();

                //insert raw markdown string into editor state by replacing 
                //all its contents with the opened file string
                ProseMirrorEditor.editor.action(replaceAll(LocalFileDirectory.openFileString, true));

                CodeMirror_EditorView.editorView.dispatch({
                    changes: {
                        from: 0,
                        to: CodeMirror_EditorView.editorView.state.doc.length,
                        insert: ProseMirrorEditor.editor.action(getMarkdown())
                    }
                });

                this.ReMode.readingMode_ProseMirror();

                if(CodeMirror_EditorNode.editorNode.style.display === "") {
                    ReadingMode.readingModeNodeContainer.style.display = "none";
                    ProseMirrorEditorNode.editorNode.style.display = "none";
                } else if(ReadingMode.readingModeNodeContainer.style.display === "") {
                    CodeMirror_EditorNode.editorNode.style.display = "none";
                    ProseMirrorEditorNode.editorNode.style.display = "none";
                }

                //show editor
                //ProseMirrorEditorNode.editorNode.style.display = "";

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
            }

            //set window title to path of currernt opened file
            await appWindow.setTitle("Iris-dev-build - " + this.splitFilePop1 + " @ " + this.splitFileConcat2);
        } else if(this.openFile === null) {
            //set openFileConst to CloseDialog constant ("Dialog Closed") 
            //when a file is not opened from dialog (user cancels it)
            this.openFileConst = FileSystemConstants.CloseDialog;

            console.log(this.openFileConst);

            throw console.error("Open Dialog (User Cancel): Promise Rejected!");
        }
    }
    */

    //save file
    public async saveLF(): Promise<void> {
        this.saveFileConst = FileSystemConstants.SaveFile;

        console.log(this.saveFileConst);

        console.log(this.listFilesRef);
        
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

            console.log("DELETED FILE");
        } else if(confirmDeletion === false) {
            console.log("CANCELED DELETION OF FILE");
        }
    }
} 
