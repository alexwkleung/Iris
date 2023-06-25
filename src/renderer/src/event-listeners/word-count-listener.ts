import { debounce } from "../utils/debounce"
import { WordCountContainerNode } from "../misc-ui/word-count"

/**
 * Word count listener
 * 
 * @param editor Editor type (options: `"prosemirror"`, `"codemirror"`)
 * @returns Word count 
 */
export function wordCountListener(editor: string): number {
    //default value
    let wordCount: number = 0;
    let textArr: string[] = [];
    
    //regex pattern
    //s+: one or more whitespace characters
    //n+: one or more new line characters
    //r+: one or more carriage return characters
    //g: match all
    const regexPattern: RegExp = /[\s+\n+\r+]/g;

    if(editor === "prosemirror") {
        const pm: HTMLElement = document.querySelector('.ProseMirror') as HTMLElement;

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        //reset value to 0 so re-calculating is accurate (internally and visually)
        WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";

        //initial check when initially opening a note
        if(!(pm.textContent as string).trim().split(regexPattern)[0]) {
            wordCount = 0; //re-initialize 
            WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words"; 
        } else {
            wordCount = (pm.textContent as string).trim().split(regexPattern).filter(str => str !== "").length;

            //log
            console.log((pm.textContent as string).trim().split(regexPattern).filter(str => str !== ""));

            WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words"; 
        }

        console.log(wordCount);
        
        //listener for during note writing
        pm.addEventListener('keyup', debounce(() => {
            textArr = (pm.textContent as string).trim().split(regexPattern);

            //if there are no words
            if(!textArr[0]) {
                wordCount = 0; //re-initialize
                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words"; 
            } else {
                wordCount = textArr.filter(str => str !== "").length;

                //log
                console.log(textArr.filter(str => str !== ""));

                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";
            }

            console.log(wordCount);
        }, 250)) //250ms default
    } else if(editor === "codemirror") {
        const cm: HTMLElement = document.querySelector('.cm-editor') as HTMLElement;

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        //reset value to 0 so re-calculating is accurate (internally and visually)
        WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";

        //initial check when initially opening a note
        if(!(cm.textContent as string).trim().split(regexPattern)[0]) {
            wordCount = 0; //re-initialize 
            WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words"; 
        } else {
            wordCount = (cm.textContent as string).trim().split(regexPattern).filter(str => str !== "").length;

            //log
            console.log((cm.textContent as string).trim().split(regexPattern).filter(str => str !== ""));

            WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words"; 
        }

        console.log(wordCount);
        
        //listener for during note writing
        cm.addEventListener('keyup', debounce(() => {
            textArr = (cm.textContent as string).trim().split(regexPattern);

            //if there are no words
            if(!textArr[0]) {
                wordCount = 0; //re-initialize
                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words"; 
            } else {
                wordCount = textArr.filter(str => str !== "").length;

                //log
                console.log(textArr.filter(str => str !== ""));

                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";
            }

            console.log(wordCount);
        }, 250)) //250ms default
    }

    return wordCount;
}