import { debounce } from "../../utils/debounce";
import { WordCountContainerNode } from "../misc-ui/word-count";
import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { TextIterator } from "@codemirror/state";
import { GenericEvent } from "./event";

/**
 * Word count listener
 *
 * @param editor Editor type (options: `"prosemirror"`, `"codemirror"`)
 * @returns Word count
 */
export function wordCountListener(editor: string): number {
    //default value
    let wordCount: number = 0;

    if (editor === "codemirror") {
        const cm: HTMLElement = document.querySelector(".cm-editor") as HTMLElement;

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";

        //reset word count
        wordCount = 0;

        //taken from: https://codemirror.net/examples/panel/
        const iter: TextIterator = CMEditorView.editorView.state.doc.iter();
        while (!iter.next().done) {
            let inWord: boolean = false;

            for (let i = 0; i < iter.value.length; i++) {
                const word: boolean = /[\w]/.test(iter.value[i]);

                if (word && !inWord) {
                    wordCount++;
                }

                inWord = word;
            }
        }

        //initial word count
        WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";

        console.log(wordCount);

        const cmDebounceWordCount: () => any = debounce(() => {
            console.log(cm.textContent);

            //reset word count
            wordCount = 0;

            const iter: TextIterator = CMEditorView.editorView.state.doc.iter();
            while (!iter.next().done) {
                let inWord: boolean = false;

                for (let i = 0; i < iter.value.length; i++) {
                    const word: boolean = /[\w]/.test(iter.value[i]);

                    if (word && !inWord) {
                        wordCount++;
                    }

                    inWord = word;
                }
            }

            if (!wordCount) {
                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";
            } else {
                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";
            }

            console.log(wordCount);
        }, 250); //250ms default

        GenericEvent.use.createDisposableEvent(
            cm,
            "keyup",
            cmDebounceWordCount,
            undefined,
            "Created disposable event for CM debounce"
        );
    }

    return wordCount;
}
