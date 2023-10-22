import { debounce } from "../utils/debounce"
import { WordCountContainerNode } from "../misc-ui/word-count"
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { TextIterator } from "@codemirror/state";
import { GenericEvent } from "./event"

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
        
        const pmDebounceWordCount: () => any = debounce(() => {
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
        }, 250);

        GenericEvent.use.createDisposableEvent(pm, 'keyup', pmDebounceWordCount, undefined, "Created detachable event listener for PM debounce word count");
    } else if(editor === "codemirror") {
        const cm: HTMLElement = document.querySelector('.cm-editor') as HTMLElement;

        //show word count
        WordCountContainerNode.wordCountContainer.style.display = "";

        WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";

        //reset word count
        wordCount = 0;

        //taken from: https://codemirror.net/examples/panel/
        const iter: TextIterator = CMEditorView.editorView.state.doc.iter();
        while(!iter.next().done) {
            let inWord: boolean = false;

            for(let i = 0; i < iter.value.length; i++) {
                const word: boolean = /[\w]/.test(iter.value[i]);

                if(word && !inWord) {
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
            while(!iter.next().done) {
                let inWord: boolean = false;
    
                for(let i = 0; i < iter.value.length; i++) {
                    const word: boolean = /[\w]/.test(iter.value[i]);
    
                    if(word && !inWord) {
                        wordCount++;
                    }
    
                    inWord = word;
                }
            }

            if(!wordCount) {
                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";
            } else {
                WordCountContainerNode.wordCountContainer.textContent = wordCount.toString() + " words";
            }

            console.log(wordCount);
        }, 250) //250ms default

        GenericEvent.use.createDisposableEvent(cm, 'keyup', cmDebounceWordCount, undefined, "Created disposable event for CM debounce");
    }

    return wordCount;
}