import { debounce } from "../../utils/debounce";
import { WordCountContainerNode } from "../misc-ui/word-count";
import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { TextIterator } from "@codemirror/state";
import { GenericEvent } from "./event";

class WordCount {
    public static count: number = 0;

    public static createWordCount(): void {
        //taken from: https://codemirror.net/examples/panel/
        const iter: TextIterator = CMEditorView.editorView.state.doc.iter();
        while (!iter.next().done) {
            let inWord: boolean = false;

            for (let i = 0; i < iter.value.length; i++) {
                //https://stackoverflow.com/questions/4593565/regular-expression-for-accurate-word-count-using-javascript
                const word: boolean = /[/\b\S+\b/g]/.test(iter.value[i]);

                if (word && !inWord) {
                    WordCount.count++;
                }

                inWord = word;
            }
        }

        if (!WordCount.count) {
            WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";
        } else {
            WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";
        }
    }
}
/**
 * Word count listener
 *
 * @param editor Editor type (options: `"codemirror"`)
 * @returns Word count
 */
export function wordCountListener(editor: string): number {
    if (editor === "codemirror") {
        const cm: HTMLElement = document.querySelector(".cm-editor") as HTMLElement;

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";
        WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";

        //reset word count
        WordCount.count = 0;

        WordCount.createWordCount();

        //initial word count
        WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";

        const cmDebounceWordCount: () => any = debounce(() => {
            console.log(cm.textContent);

            //reset word count
            WordCount.count = 0;

            WordCount.createWordCount();
        }, 250); //250ms default

        GenericEvent.use.createDisposableEvent(
            cm,
            "keyup",
            cmDebounceWordCount,
            undefined,
            "Created disposable event for CM debounce"
        );
    }

    return WordCount.count;
}
