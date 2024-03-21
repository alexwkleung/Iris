import { EditorView } from "prosemirror-view";
import { PMEditorState } from "./pm-editor-state";
import { defaultMarkdownSerializer } from "../markdown/export";

export class PMEditorView {
    /**
     * Reference variable for prosemirror editor view
     *
     * @static
     */
    public static editorView: EditorView;

    /**
     * Set contenteditable
     *
     * @param enable Option to enable contenteditable property (`true` or `false`)
     * @returns Enabled or disabled `contenteditable` property
     *
     * @static
     */
    public static setContenteditable(enable: boolean): void {
        let contenteditable: void;

        const proseMirrorNode: HTMLElement = document.querySelector(".ProseMirror") as HTMLElement;

        if (enable) {
            contenteditable = proseMirrorNode.setAttribute("contenteditable", "");
        } else if (!enable) {
            contenteditable = proseMirrorNode.setAttribute("contenteditable", "none");
        }

        return contenteditable;
    }

    /**
     * Create editor view
     *
     * @returns New editor view object
     *
     * @static
     */
    public static createEditorView(): EditorView {
        PMEditorView.editorView = new EditorView(document.querySelector("#editor-container"), {
            state: PMEditorState.createEditorState(),
            //serialize clipboard content to markdown
            clipboardTextSerializer: (slice): any => {
                return defaultMarkdownSerializer.serialize(slice.content as any);
            },
            attributes: {
                spellcheck: "false",
            },
        });

        return PMEditorView.editorView;
    }
}
