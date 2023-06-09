import { DirectoryTreeListeners } from "./src/event-listeners/directory-tree-listeners.js"
//import { EditorListeners } from "./src/event-listeners/editor-listeners.js"
import { DirectoryTreeUIModalListeners } from "./src/event-listeners/directory-tree-listeners.js"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListenerNs {
    export function directoryTreeListeners(): void {
        const dirTreeListeners = new DirectoryTreeListeners();

        //needs to be in sync with mode switch when implemented?
        dirTreeListeners.parentRootListener("Basic");
    }

    export function directoryTreeUIModalListeners(): void {
        const dirTreeUIModalListeners = new DirectoryTreeUIModalListeners();

        dirTreeUIModalListeners.createFileListener();
    }
}

function invokeListeners(): void {
    window.addEventListener('load', async () => {
        ListenerNs.directoryTreeListeners();
        
        ListenerNs.directoryTreeUIModalListeners();
    });
}
invokeListeners();