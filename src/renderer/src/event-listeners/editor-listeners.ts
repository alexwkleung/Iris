import { IEditorListeners } from "../interfaces/listener-interfaces"
import { RefsNs } from "./directory-tree-listeners"
import { fsMod } from "../utils/alias"
import { DirectoryRefNs } from "../file-directory-tree/file-directory"
import { defaultMarkdownSerializer } from "prosemirror-markdown"
import { PMEditorView } from "../prosemirror/editor-view"
import { debounce } from "lodash-es"

/**
 * @implements `IEditorListeners`
 */
export class EditorListeners implements IEditorListeners {
    /**
     * Auto save listener
     * 
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
                        //write to file
                        //const t0: number = performance.now(); //start perf timer

                        //log
                        //console.log(props.parentFolderName);
                        fsMod.fs._writeToFile(DirectoryRefNs.basicRef, props.parentFolderName + "/" + props.childFileName, defaultMarkdownSerializer.serialize(PMEditorView.editorView.state.doc).toString());                         

                        //const t1: number = performance.now(); //end perf timer
                        //log perf timer
                        //console.log("window.fsMod._writeToFile took " + (t1 - t0) + "ms!");
                    }
                })
            }, 1200));
        }
    }
}