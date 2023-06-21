import { App } from "./app"
import { PMEditorView } from "./src/prosemirror/editor/editor-view"
import { WordCountContainerNode } from "./src/misc-ui/word-count"
import { EditorKebabDropdownMenu } from "./src/misc-ui/editor-kebab-dropdown-menu"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EditorNs {
    export class EditorContainerNode {
        public static editorContainer: HTMLDivElement;

        public static createEditorContainer(): void {
            EditorContainerNode.editorContainer = document.createElement('div');
            EditorContainerNode.editorContainer.setAttribute("id", "editor-container");
            EditorContainerNode.editorContainer.setAttribute("spellcheck", "false");
            EditorContainerNode.editorContainer.setAttribute("aria-hidden", "true");

            App.appNode.insertBefore(EditorContainerNode.editorContainer, App.appNode.firstChild);
        }
    }

    export class EditorTopBarContainer {
        public static editorTopBarContainer: HTMLDivElement;

        public static createEditorTopBarContainer(): void {
            EditorTopBarContainer.editorTopBarContainer = document.createElement('div');
            EditorTopBarContainer.editorTopBarContainer.setAttribute("id", "editor-top-bar-container");

            App.appNode.insertBefore(EditorTopBarContainer.editorTopBarContainer, App.appNode.firstChild);
        }

        /**
         * Directory info
         */
        public directoryInfo(): void {
            //top bar directory info
            const topBarDirectoryInfo: HTMLDivElement = document.createElement('div');
            topBarDirectoryInfo.setAttribute("id", "top-bar-directory-info");

            //doc title folder
            const docTitleFolder: string = document.title.split('-')[1].trim();

            document.querySelectorAll('.child-file-name.is-active-child').forEach((el) => {
                //null check
                if(el !== null) {
                    //log
                    console.log(el.textContent);
    
                    //top bar directory info text node
                    const topBarDirectoryInfoTextNode: Text = document.createTextNode(docTitleFolder + " - " + el.textContent);
                    topBarDirectoryInfo.appendChild(topBarDirectoryInfoTextNode);
                }
            });

            //check if top-bar-directory-info node exists in dom
            if(document.getElementById('top-bar-directory-info') && document.getElementById('top-bar-directory-info') !== null) {
                //remove node from dom
                (document.getElementById('top-bar-directory-info') as HTMLDivElement).remove();

                //append top bar directory info node
                (document.getElementById('editor-top-bar-container') as HTMLDivElement).appendChild(topBarDirectoryInfo);
            } else {
                (document.getElementById('editor-top-bar-container') as HTMLDivElement).appendChild(topBarDirectoryInfo);
            }
        }
    }
    
    export function editor(): void {
        //create editor container
        EditorContainerNode.createEditorContainer();

        //create prosemirror editorview 
        PMEditorView.createEditorView();

        //set prosemirror contenteditable
        PMEditorView.setContenteditable(false);

        //hide prosemirror menubar
        (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "none";

        //create editor top bar container
        EditorTopBarContainer.createEditorTopBarContainer();

        //create word count container
        WordCountContainerNode.createWordCountContainer();

        //create kebab dropdown menu container
        EditorKebabDropdownMenu.createKebabDropdownMenuContainer();
    }
}