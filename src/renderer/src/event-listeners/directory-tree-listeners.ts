import { fsMod }  from "../utils/alias"
import { DirectoryTree } from "../file-directory-tree/file-directory"
import { setWindowTitle } from "../window/window-title"
import { IDirectoryTreeListeners } from "../interfaces/listener-interfaces"
import { defaultMarkdownParser } from "prosemirror-markdown"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { PMEditorState } from "../prosemirror/editor/editor-state"
import { EditorListeners } from "./editor-listeners"
import { DirectoryTreeStateListeners } from "./file-directory-state-listener"
import { EditorNs } from "../../editor-main"
import { wordCountListener } from "./word-count-listener"
import { isModeAdvanced, isModeBasic } from "../utils/is"
import { Node } from "prosemirror-model"
import { FolderFileCount } from "../misc-ui/folder-file-count"
import { EditorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener"
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { CMEditorState } from "../codemirror/editor/cm-editor-state"
import { Settings } from "../settings/settings"
import { cursors } from "../codemirror/extensions/cursors"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RefsNs {
    /**
     * Generic interface for current parent child data
     * 
     * Anything that implements `ICurrentParentChildData` should default to any type that inherits `string` or `Element` only, for example:
     * 
     * `T` corresponds to type `string`
     * 
     * `K` corresponds to type `Element`
     */
    interface ICurrentParentChildData<T extends string, K extends Element> {
        parentFolderName: T,
        childFileName: T,
        parentFolderNode: K,
        parentFolderNameNode: K,
        childFileNode: K
    }

    /**
    * Current parent child data array of objects
    * 
    * References of the current parent folder and child file data can be accessed here.
    * 
    * Since the references may change, you will have to reassign the values.
    * 
    */
    export const currentParentChildData: ICurrentParentChildData<string, Element>[] = [
        {
            parentFolderName: "",
            childFileName: "",
            parentFolderNode: {} as Element,
            parentFolderNameNode: {} as Element,
            childFileNode: {} as Element
        }
    ];
}

/**
 * @extends DirectoryTree
 * @implements `IDirectoryTreeListeners`
 */
export class DirectoryTreeListeners extends DirectoryTree implements IDirectoryTreeListeners {
    /**
     * Get parent tags
     * 
     * @private
     */
    private getParentTags: NodeListOf<Element> = {} as NodeListOf<Element>;

    /**
     * Get parent name tags
     * 
     * @private
     */
    private getParentNameTags: NodeListOf<Element> = {} as NodeListOf<Element>;

    /**
     * Parent name tag reference variable
     * 
     * @protected
     */
    protected parentNameTagRef: string = "";

    /**
     * Parent name tag node reference variable
     * 
     * @protected
     */
    protected parentNameTagNodeRef: Element = {} as Element;

    /**
     * Child file name reference variable
     * 
     * @protected
     */
    protected childFileNameRef: string = "";

    /**
     * Parent name tag node reference variable
     * 
     * @protected
     */
    protected parentTagNodeRef: Element = {} as Element; 

    /**
     * Child file node reference variable
     * 
     * @protected
     */
    protected childFileNodeRef: Element = {} as Element;

    /**
     * Editor listeners object
     * 
     * @private
     * @readonly
     */
    private readonly editorListeners = new EditorListeners();

    /**
     * Directory tree state listeners object
     * 
     * @private
     * @readonly
     */
    private readonly dirTreeStateListeners = new DirectoryTreeStateListeners();

    /**
     * Editor top bar container object
     * 
     * @private
     * @readonly
     */
    private readonly editorTopBarContainer = new EditorNs.EditorTopBarContainer();

    /**
     * Folder file count object 
     *  
     * @private
     * @readonly
     */
    private readonly folderFileCountObject = new FolderFileCount();

    /**
     * Kebab dropdown menu listeners
     * 
     * @private
     * @readonly
     */
    private readonly editorKebabDropdownMenuListeners = new EditorKebabDropdownMenuListeners();

    /**
     * Parent root listener 
     */
    public parentRootListener(): void {
        this.getParentTags = document.querySelectorAll('.parent-of-root-folder');
        this.getParentNameTags = document.querySelectorAll('.parent-folder-name');

        let count: number = 0;
        //remove duplicate folder file count nodes
        while(count <= 2) {
            document.querySelectorAll('.folder-file-count-container').forEach((el) => {
                el.remove();
            });
            count++;
        }

        if(this.getParentTags !== null && this.getParentNameTags !== null) {
            for(let i = 0; i < this.getParentTags.length; i++) {       
                this.folderFileCountObject.folderFileCount(this.getParentTags[i], this.parentNameTagsArr()[i], false);

                this.getParentNameTags[i].addEventListener('click', () => {          
                    //toggle is-active-parent class on parent tag               
                    this.getParentTags[i].classList.toggle('is-active-parent');
                    
                    //toggle is-active-folder class on parent name tag
                    this.getParentNameTags[i].classList.toggle('is-active-folder');

                    //check if parent tag contains is-active-parent class
                    if(this.getParentTags[i].classList.contains('is-active-parent')) {
                        //
                        this.createDirTreeChildNodes(this.getParentTags[i], this.parentNameTagsArr()[i], "home");

                        document.querySelectorAll('.parent-folder-caret')[i].classList.toggle('is-active-parent-folder');

                        //remove is-not-active-parent class 
                        this.getParentTags[i].classList.remove('is-not-active-parent');

                        //call child node listener when parent is active 
                        this.childNodeListener();

                    //console.log(this.getParentTags[i].querySelectorAll('.child-file-name').length);
                    //if parent tag doesn't contain is-active-parent class
                    } else if(!this.getParentTags[i].classList.contains('is-active-parent')) {
                        //remove all child files
                        this.getParentTags[i].querySelectorAll('.child-file-name').forEach(
                            (elem) => {
                                if(elem !== null) {
                                    elem.remove();
                                }
                            }
                        );

                        //remove is-active-parent-folder class
                        this.getParentTags[i].querySelectorAll('.parent-folder-caret').forEach(
                            (elem) => { 
                                if(elem !== null) {
                                    elem.classList.remove('is-active-parent-folder');
                                }
                            }
                        );

                        //add is-not-active-parent
                        this.getParentTags[i].classList.add('is-not-active-parent');
                    }
                });
            }
        } else {
            throw console.error("Generic error. Cannot find parent and parent name tags.");
        }
    }

    /**
     * Child node listener
     */
    public childNodeListener(): void {
        document.querySelectorAll('.is-active-parent').forEach((isActiveParent) => {
            const childFileName: NodeListOf<Element> = isActiveParent.querySelectorAll('.child-file-name');

            //for all child file names
            for(let i = 0; i < childFileName.length; i++) {
                childFileName[i].addEventListener('click', async () => {
                    //if document contains at least one active child
                    if(document.querySelector('.is-active-child')) {
                        //select all active children and remove them from the dom (active status)
                        //this removes any existing active children files
                        document.querySelectorAll('.is-active-child').forEach(
                            (isActiveChild) => {
                                if(isActiveChild !== null) {
                                    isActiveChild.classList.remove('is-active-child')
                                }
                            }
                        );
                    }
                    
                    //for all clicked children files, add 'is-active-child' class
                    childFileName[i].classList.add('is-active-child');

                    for(let j = 0; j < this.getParentTags.length, j < this.getParentNameTags.length; j++) {
                        if(this.getParentTags[j].contains(childFileName[i]) && childFileName[i].classList.contains('is-active-child')) {
                            //log parent folder
                            //console.log(this.getParentNameTags[j].textContent);
                            //log child file that corresponds to parent folder
                            //console.log(childFileName[i].textContent);

                            //if mode is basic
                            if(isModeBasic()) {
                                const t0: number = performance.now(); //start perf timer

                                //destroy current editor view
                                PMEditorView.editorView.destroy();
                                
                                //create new editor view
                                PMEditorView.createEditorView();
                                
                                //update editor view state
                                PMEditorView.editorView.updateState(
                                    //apply transaction
                                    PMEditorView.editorView.state.apply(
                                        //since editor gets destroyed and re-created, the 
                                        //range is 0 to 0 
                                        PMEditorState.editorState.tr.replaceRangeWith(
                                            0, 
                                            0,
                                            defaultMarkdownParser.parse(
                                            fsMod.fs._readFileFolder(this.getParentNameTags[j].textContent as string, 
                                            (childFileName[i].textContent as string) + ".md"
                                        )
                                    ) as Node
                                )));
    
                                const t1: number = performance.now(); //end perf timer
                                
                                //log perf timer
                                console.log("Editor destroy, create, and replace in total took " + (t1 - t0) + "ms!");
    
                                //set contenteditable 
                                PMEditorView.setContenteditable(true);

                                //if contenteditable attribute is set to true 
                                if((document.querySelector('.ProseMirror') as HTMLElement).getAttribute('contenteditable') === 'true') {
                                    //show the menubar
                                    (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "";
                                }
                            
                                //show kebab dropdown menu 
                                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "";

                                //invoke auto save listener
                                this.editorListeners.autoSaveListener("prosemirror");

                                //invoke insert tab listener
                                this.editorListeners.insertTabListener((document.querySelector(".ProseMirror") as HTMLElement), 2);

                                //null check
                                if(this.parentTagNodeRef !== null && this.parentNameTagRef !== null && this.childFileNameRef !== null && this.childFileNodeRef !== null) {
                                    //assign child refs
                                    this.childFileNameRef = childFileName[i].textContent as string;
                                    this.childFileNodeRef = childFileName[i];

                                    if(this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                        //assign parent refs
                                        this.parentNameTagRef = this.getParentNameTags[j].textContent as string;
                                        this.parentNameTagNodeRef = this.getParentNameTags[j];
                                        this.parentTagNodeRef = this.getParentTags[j];
                                    } else if(!this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                        continue;
                                    }

                                    //assign references to corresponding key properties
                                    RefsNs.currentParentChildData.map((props) => {
                                        //null check
                                        if(props !== null) {
                                            //child file name
                                            props.childFileName = this.childFileNameRef;

                                            //child file node
                                            props.childFileNode = this.childFileNodeRef;

                                            //parent folder name
                                            props.parentFolderName = this.parentNameTagRef; 

                                            //parent folder name node
                                            props.parentFolderNameNode = this.parentNameTagNodeRef;

                                            //parent folder node
                                            props.parentFolderNode = this.parentTagNodeRef;

                                            //log
                                            //console.log(props.childFileName);
                                            //log
                                            //console.log(props.childFileNode);
                                        }
                                    })
                                }
                            
                                //apply active state listener 
                                this.dirTreeStateListeners.activeChildFileStateListener();

                                //word count listener
                                wordCountListener("prosemirror");

                                //kebab dropdown menu listener
                                this.editorKebabDropdownMenuListeners.kebabDropdownMenuListener();
                            //if mode is advanced
                            } else if(isModeAdvanced()) {
                                //destroy cm editor view
                                CMEditorView.editorView.destroy();

                                //create cm editor view
                                CMEditorView.createEditorView();

                                //dispatch text insertion tr
                                CMEditorView.editorView.dispatch({
                                    changes: {
                                        from: 0,
                                        to: 0,
                                        insert: fsMod.fs._readFileFolder(this.getParentNameTags[j].textContent as string, 
                                        (childFileName[i].textContent as string) + ".md")
                                    }
                                });

                                //set contenteditable 
                                CMEditorView.setContenteditable(true);

                                //show kebab dropdown menu 
                                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "";

                                //invoke auto save listener
                                this.editorListeners.autoSaveListener("codemirror");
                               
                                //invoke insert tab listener
                                this.editorListeners.insertTabListener((document.querySelector(".cm-content") as HTMLElement), 2);

                               //null check
                               if(this.parentTagNodeRef !== null && this.parentNameTagRef !== null && this.childFileNameRef !== null && this.childFileNodeRef !== null) {
                                //assign child refs
                                this.childFileNameRef = childFileName[i].textContent as string;
                                this.childFileNodeRef = childFileName[i];

                                if(this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                    //assign parent refs
                                    this.parentNameTagRef = this.getParentNameTags[j].textContent as string;
                                    this.parentNameTagNodeRef = this.getParentNameTags[j];
                                    this.parentTagNodeRef = this.getParentTags[j];
                                } else if(!this.getParentTags[j].contains(this.getParentNameTags[j])) {
                                    continue;
                                }

                                //assign references to corresponding key properties
                                RefsNs.currentParentChildData.map((props) => {
                                    //null check
                                    if(props !== null) {
                                        //child file name
                                        props.childFileName = this.childFileNameRef;

                                        //child file node
                                        props.childFileNode = this.childFileNodeRef;

                                        //parent folder name
                                        props.parentFolderName = this.parentNameTagRef; 

                                        //parent folder name node
                                        props.parentFolderNameNode = this.parentNameTagNodeRef;

                                        //parent folder node
                                        props.parentFolderNode = this.parentTagNodeRef;

                                        //log
                                        //console.log(props.childFileName);
                                        //log
                                        //console.log(props.childFileNode);
                                    }
                                })

                                //word count listener
                                wordCountListener("codemirror");
                                
                                //kebab dropdown menu listener
                                this.editorKebabDropdownMenuListeners.kebabDropdownMenuListener();

                                if(Settings.parseThemeSettings().lightTheme) {
                                    CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) })
                                } else if(Settings.parseThemeSettings().darkTheme) {
                                    CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]) })
                                }
                            }
                            }
                        } else if(!this.getParentTags[j].contains(childFileName[i]) && !childFileName[i].classList.contains('is-active-child')) {
                            continue;
                        }
                    }
                    
                    //change document title so it corresponds to the opened file
                    await setWindowTitle("Iris", true, this.parentNameTagRef + " - " + (childFileName[i].textContent)).catch((e) => { throw console.error(e) });

                    //add directory info to editor top bar
                    this.editorTopBarContainer.directoryInfo();
                });
            }
        });
    }
}
