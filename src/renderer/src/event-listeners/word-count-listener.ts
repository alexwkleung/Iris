import { debounce } from "lodash-es"
import { WordCountContainerNode } from "../../misc-ui/word-count"

export function wordCountListener(editor: string): number {
    let words: number = 0;
    let textArr: string[] = [];

    if(editor === "prosemirror") {
        const pm: HTMLElement = document.querySelector('.ProseMirror') as HTMLElement;

        console.log(words);

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        //reset value to 0 so re-calculating is accurate (internally and visually)
        WordCountContainerNode.wordCountContainer.textContent = words.toString();

        //default value
        WordCountContainerNode.wordCountContainer.textContent = (pm.textContent as string).split(/\s+/).length + " words";

        pm.addEventListener('keyup', debounce(() => {
            textArr = (pm.textContent as string).split(/\s+/);

            words = textArr.length + 1; //add 1 to compensate for extra leading characters (need to check this)
            
            WordCountContainerNode.wordCountContainer.textContent = words.toString() + " words";

            console.log(words);
        }, 500)) //0.5ms default
    }

    return words;
}