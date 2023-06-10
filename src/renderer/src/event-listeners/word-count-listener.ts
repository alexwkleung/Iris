import { debounce } from "lodash-es"
import { WordCountContainerNode } from "../../misc-ui/word-count"

export function wordCountListener(editor: string): number {
    let words: number = 0; //default value
    let textArr: string[] = [];

    if(editor === "prosemirror") {
        const pm: HTMLElement = document.querySelector('.ProseMirror') as HTMLElement;

        console.log(words);

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        //reset value to 0 so re-calculating is accurate (internally and visually)
        WordCountContainerNode.wordCountContainer.textContent = words.toString() + " words";

        //initial check when initially opening a note
        if(!(pm.textContent as string).trim().split(/\s+/)[0]) {
            words = 0; //re-initialize 
            WordCountContainerNode.wordCountContainer.textContent = words.toString() +  " words"; 
        } else {
            WordCountContainerNode.wordCountContainer.textContent = ((pm.textContent as string).trim().split(/\s+/).length + 1) + " words"; 
        }

        //listener for during note writing
        pm.addEventListener('keyup', debounce(() => {
            textArr = (pm.textContent as string).trim().split(/\s+/);

            //if there are no words
            if(!textArr[0]) {
                words = 0; //re-initialize
                WordCountContainerNode.wordCountContainer.textContent = words.toString() +  " words"; 
            } else {
                words = textArr.length; //the initial check adds 1 so you don't need to add it again
                WordCountContainerNode.wordCountContainer.textContent = words.toString() + " words";
            }

            console.log(words);
        }, 250)) //250ms default
    }

    return words;
}