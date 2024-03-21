import { App } from "./app";
import { WordCountContainerNode } from "./misc-ui/word-count";
import { PMEditorView } from "./prosemirror/editor/pm-editor-view";

export namespace EditorNs {
    export class EditorContainerNode {
        public static editorContainer: HTMLDivElement;

        public static createEditorContainer(): void {
            EditorContainerNode.editorContainer = document.createElement("div");
            EditorContainerNode.editorContainer.setAttribute("id", "editor-container");
            EditorContainerNode.editorContainer.setAttribute("aria-hidden", "true");

            App.appNode.insertBefore(EditorContainerNode.editorContainer, App.appNode.firstChild);
        }
    }

    export class EditorTopBarContainer {
        public static editorTopBarContainer: HTMLDivElement;

        public static createEditorTopBarContainer(): void {
            EditorTopBarContainer.editorTopBarContainer = document.createElement("div");
            EditorTopBarContainer.editorTopBarContainer.setAttribute("id", "editor-top-bar-container");

            App.appNode.insertBefore(EditorTopBarContainer.editorTopBarContainer, App.appNode.firstChild);
        }

        /**
         * Directory info
         */
        public directoryInfo(): void {
            const topBarDirectoryInfo: HTMLDivElement = document.createElement("div");
            topBarDirectoryInfo.setAttribute("id", "top-bar-directory-info");

            const docTitleName: string = document.title.split("-")[2].trim();

            document.querySelectorAll(".child-file-name.is-active-child").forEach((el) => {
                if (el !== null) {
                    const topBarDirectoryInfoTextNode: Text = document.createTextNode(docTitleName);
                    topBarDirectoryInfo.appendChild(topBarDirectoryInfoTextNode);
                }
            });

            if (
                document.getElementById("top-bar-directory-info") &&
                document.getElementById("top-bar-directory-info") !== null
            ) {
                (document.getElementById("top-bar-directory-info") as HTMLDivElement).remove();

                (document.getElementById("editor-top-bar-container") as HTMLDivElement).appendChild(
                    topBarDirectoryInfo
                );
            } else {
                (document.getElementById("editor-top-bar-container") as HTMLDivElement).appendChild(
                    topBarDirectoryInfo
                );
            }
        }
    }

    export function editor(): void {
        EditorContainerNode.createEditorContainer();

        PMEditorView.createEditorView();

        PMEditorView.setContenteditable(false);

        (document.querySelector(".ProseMirror-menubar") as HTMLElement).style.display = "none";

        EditorTopBarContainer.createEditorTopBarContainer();

        WordCountContainerNode.createWordCountContainer();
    }
}
