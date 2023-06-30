export class ReadingMode {
    static readingModeNode(): void {
        const readingModeContainerNode: HTMLDivElement = document.createElement('div');
        readingModeContainerNode.setAttribute("id", "reading-mode-container");
        (document.getElementById('editor-container') as HTMLElement).appendChild(readingModeContainerNode);

        const readingModeContent: HTMLDivElement = document.createElement('div');   
        readingModeContent.setAttribute("id", "reading-mode-content");
        readingModeContainerNode.appendChild(readingModeContent);
    }
}