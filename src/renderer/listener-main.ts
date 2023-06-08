import { DirectoryTreeListeners } from "./src/event-listeners/directory-tree-listeners.js"
//import { EditorListeners } from "./src/event-listeners/editor-listeners.js"
import { DirectoryTreeUIModalListeners } from "./src/event-listeners/directory-tree-listeners.js"
import { DirectoryTreeStateListeners } from "./src/event-listeners/file-directory-state-listener.js"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListenerNs {
    export function directoryTreeListeners(): void {
        const dirTreeListeners = new DirectoryTreeListeners();
        
        dirTreeListeners.parentRootListener();
    }

    export function directoryTreeStateListeners(): void {
        const dirTreeStateListeners = new DirectoryTreeStateListeners();

        dirTreeStateListeners.applyActiveNodeListener();
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