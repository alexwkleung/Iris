import { debounce } from "lodash-es"
import { WordCountContainerNode } from "../misc-ui/word-count"

export function wordCountListener(editor: string): number {
    //default value
    let words: number = 0;
    let textArr: string[] = [];
    
    //regex pattern
    const regexPattern: RegExp = /[\s+\n\r]/;

    if(editor === "prosemirror") {
        const pm: HTMLElement = document.querySelector('.ProseMirror') as HTMLElement;

        console.log(words);

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        //reset value to 0 so re-calculating is accurate (internally and visually)
        WordCountContainerNode.wordCountContainer.textContent = words.toString() + " words";

        //initial check when initially opening a note
        if(!(pm.textContent as string).trim().split(regexPattern)[0]) {
            words = 0; //re-initialize 
            WordCountContainerNode.wordCountContainer.textContent = words.toString() +  " words"; 
        } else {
            WordCountContainerNode.wordCountContainer.textContent = ((pm.textContent as string).trim().split(regexPattern).length) + " words"; 
        }

        //listener for during note writing
        pm.addEventListener('keyup', debounce(() => {
            textArr = (pm.textContent as string).trim().split(regexPattern);

            //if there are no words
            if(!textArr[0]) {
                words = 0; //re-initialize
                WordCountContainerNode.wordCountContainer.textContent = words.toString() +  " words"; 
            } else {
                words = textArr.length;
                WordCountContainerNode.wordCountContainer.textContent = words.toString() + " words";
            }

            console.log(words);
        }, 250)) //250ms default
    }

    return words;
}