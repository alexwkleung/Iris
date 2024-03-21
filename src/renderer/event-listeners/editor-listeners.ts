import { IEditorListeners } from "../interfaces/listener-interfaces";
import { RefsNs } from "./directory-tree-listeners";
import { fsMod } from "../../utils/alias";
import { debounce } from "../../utils/debounce";
import { GenericEvent } from "./event";
import { defaultMarkdownSerializer } from "../prosemirror/markdown/export";
import { PMEditorView } from "../prosemirror/editor/pm-editor-view";

/**
 * @implements `IEditorListeners`
 */
export class EditorListeners implements IEditorListeners {
    public pm: HTMLDivElement = {} as HTMLDivElement;

    public pmDebounceAutoSave = debounce(() => {
        RefsNs.currentParentChildData.map((props) => {
            if (props !== null) {
                fsMod.fs._writeToFile(
                    props.parentFolderName + "/" + props.childFileName + ".md",
                    defaultMarkdownSerializer.serialize(PMEditorView.editorView.state.doc).toString()
                );

                GenericEvent.use.disposeEvent(
                    this.pm,
                    "keyup",
                    this.pmDebounceAutoSave,
                    undefined,
                    "Disposed PM debounce auto save event"
                );
            }
        });
    }, 250); //250ms default

    /**
     * Auto save listener
     *
     * @public
     */
    public autoSaveListener(editor: string): void {
        if (editor === "prosemirror") {
            if (this.pm !== null) {
                this.pm = document.querySelector(".ProseMirror") as HTMLDivElement;

                GenericEvent.use.createDisposableEvent(
                    this.pm,
                    "keyup",
                    () => {
                        GenericEvent.use.createDisposableEvent(
                            this.pm,
                            "keyup",
                            this.pmDebounceAutoSave,
                            undefined,
                            "Created disposable event for PM debounce auto save"
                        );
                    },
                    undefined,
                    "Created generic non-disposable event for PM auto save"
                );
            }
        }
    }

    /**
     * Insert tab listener
     *
     * Tabs are based on spaces and not actual tab characters
     */
    public insertTabListener(el: HTMLElement, numberOfSpaces?: number): void {
        let spaces: string = "";

        //ref: https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
        el.addEventListener("keydown", (e) => {
            if ((e as KeyboardEvent).key === "Tab") {
                e.preventDefault();

                const getSelection: Selection = document.getSelection() as Selection;
                const getRange: Range = getSelection.getRangeAt(0);

                if (numberOfSpaces === 2) {
                    spaces = "  "; //2 spaces
                } else if (numberOfSpaces === 4) {
                    spaces = "    "; //4 spaces
                } else if ((numberOfSpaces as number) <= 0) {
                    throw console.error("Number of spaces cannot be zero or negative");
                } else if (numberOfSpaces === null || numberOfSpaces === undefined) {
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
        });
    }
}
