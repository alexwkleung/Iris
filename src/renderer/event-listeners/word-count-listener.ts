import { debounce } from "../../utils/debounce";
import { WordCountContainerNode } from "../misc-ui/word-count";
import { GenericEvent } from "./event";

class WordCount {
    public static count: number = 0;
}
/**
 * Word count listener
 *
 * @param editor Editor type (options: `"codemirror"`)
 * @returns Word count
 */
export function wordCountListener(editor: string): number {
    let textArr: string[] = [];

    const regexPattern: RegExp = new RegExp(/[\s+\n+\r+]/g);

    if (editor === "prosemirror") {
        const pm: HTMLElement = document.querySelector(".ProseMirror") as HTMLElement;

        WordCountContainerNode.wordCountContainer.style.display = "";

        WordCount.count = 0;

        WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";

        if (!(pm.textContent as string).trim().split(regexPattern)[0]) {
            WordCount.count = 0;
            WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";
        } else {
            WordCount.count = (pm.textContent as string)
                .trim()
                .split(regexPattern)
                .filter((str) => str !== "").length;

            WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";
        }

        const pmDebounceWordCount: () => any = debounce(() => {
            textArr = (pm.textContent as string).trim().split(regexPattern);

            //if there are no words
            if (!textArr[0]) {
                WordCount.count = 0; //re-initialize
                WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";
            } else {
                WordCount.count = textArr.filter((str) => str !== "").length;

                //log
                console.log(textArr.filter((str) => str !== ""));

                WordCountContainerNode.wordCountContainer.textContent = WordCount.count.toString() + " words";
            }
        }, 250);

        GenericEvent.use.createDisposableEvent(
            pm,
            "keyup",
            pmDebounceWordCount,
            undefined,
            "Created disposable event listener for PM debounce word count"
        );
    }

    return WordCount.count;
}
