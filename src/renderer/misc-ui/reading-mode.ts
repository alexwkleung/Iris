import { markdownParser } from "../utils/markdown-parser";
import { fsMod } from "../utils/alias";

export class ReadingMode {
    static readingModeNode(): void {
        const readingModeContainerNode: HTMLDivElement = document.createElement("div");
        readingModeContainerNode.setAttribute("id", "reading-mode-container");
        (document.getElementById("editor-container") as HTMLElement).appendChild(readingModeContainerNode);

        const readingModeContent: HTMLDivElement = document.createElement("div");
        readingModeContent.setAttribute("id", "reading-mode-content");
        readingModeContainerNode.appendChild(readingModeContent);
    }

    public async createReadingMode(parent: string, child: string | null): Promise<void> {
        if ((document.getElementById("reading-mode-container") as HTMLElement) !== null) {
            (document.getElementById("reading-mode-container") as HTMLElement).remove();
        }

        //create reading mode node
        ReadingMode.readingModeNode();

        //create fragment from content and append
        const content: string = await markdownParser(fsMod.fs._readFileFolder(parent, child + ".md")).catch((e) => {
            throw console.error(e);
        });

        const rangeContextFragment = new Range().createContextualFragment(content);
        (document.getElementById("reading-mode-content") as HTMLElement).appendChild(rangeContextFragment);
    }
}

export const reading: ReadingMode = new ReadingMode();
