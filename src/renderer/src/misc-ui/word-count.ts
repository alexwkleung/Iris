import { App } from "../../app"

export class WordCountContainerNode {
    public static wordCountContainer: HTMLElement;
    
    public static createWordCountContainer(): void {
        WordCountContainerNode.wordCountContainer = document.createElement('div');
        WordCountContainerNode.wordCountContainer.setAttribute("id", "word-count-container");
        WordCountContainerNode.wordCountContainer.style.display = "none";

        App.appNode.insertBefore(WordCountContainerNode.wordCountContainer, document.querySelector('#editor-container'));
    }
}