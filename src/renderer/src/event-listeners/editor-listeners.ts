import { IEditorListeners } from "../interfaces/listener-interfaces"
import { RefsNs } from "./directory-tree-listeners"
import { fsMod } from "../utils/alias"
import { DirectoryRefNs } from "../file-directory-tree/file-directory"
import { defaultMarkdownSerializer } from "prosemirror-markdown"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { debounce } from "../utils/debounce"
import { isModeBasic } from "../utils/is"

/**
 * @implements `IEditorListeners`
 */
export class EditorListeners implements IEditorListeners {
    /**
     * Auto save listener
     * 
     * @param type The mode type
     * @public
     */
    public autoSaveListener(): void {
        const editors: HTMLDivElement = document.querySelector('.ProseMirror') as HTMLDivElement;

        //when a keyboard press is released
        if(editors !== null) {
            editors.addEventListener('keyup', debounce(() => {
                RefsNs.currentParentChildData.map((props) => {
                    //null check
                    if(props !== null) {
                        //mode check
                        if(isModeBasic()) {
                            //write to file
                            const t0: number = performance.now(); //start perf timer
    
                            //log
                            console.log(props.parentFolderName);

                            console.log(props.childFileName);
                            
                            fsMod.fs._writeToFile(
                                DirectoryRefNs.basicRef, 
                                props.parentFolderName + "/" + props.childFileName + ".md", 
                                defaultMarkdownSerializer.serialize(PMEditorView.editorView.state.doc).toString()
                            );                         
    
                            const t1: number = performance.now(); //end perf timer
                            
                            //log perf timer
                            console.log("window.fsMod._writeToFile took " + (t1 - t0) + "ms!");
                        }
                    }
                })
            }, 1100)); //1100ms default
        }
    }

    /**
     * Insert tab listener
     * 
     * Tabs are based on spaces and not actual tab characters
     */
    public insertTabListener(numberOfSpaces?: number): void {
        let spaces: string = "";
        
        //ref: https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
        (document.querySelector('.ProseMirror') as HTMLElement).addEventListener('keydown', (e) => {
            if((e as KeyboardEvent).key === 'Tab') {
                //prevent default tab behaviour
                e.preventDefault();

                const getSelection: Selection = document.getSelection() as Selection;
                const getRange: Range = getSelection.getRangeAt(0);

                //check number of spaces passed from argument
                if(numberOfSpaces === 2) {
                    spaces = "  "; //2 spaces
                } else if(numberOfSpaces === 4) {
                    spaces = "    "; //4 spaces
                } else if((numberOfSpaces as number <= 0)) {
                    throw console.error("Number of spaces cannot be zero or negative");
                } else if(numberOfSpaces === null || numberOfSpaces === undefined) {
                    spaces = "  "; //default 2 spaces if numberOfSpaces argument is not provided
                }

                //spaces text node
                const spacesTextNode: Text = document.createTextNode(spaces); 

                //insert node at start of range
                getRange.insertNode(spacesTextNode);

                //set start position after a node
                getRange.setStartAfter(spacesTextNode);

                //set end position after a node
                getRange.setEndAfter(spacesTextNode);
            }
        })
    }
}