import { DirectoryTreeListeners } from "./src/event-listeners/listeners.js"
import { EditorListeners } from "./src/event-listeners/listeners.js"
import { DirectoryTreeUIModalListeners } from "./src/event-listeners/listeners.js"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListenerNs {
    export function directoryTreeListeners(): void {
        const dirTreeListeners = new DirectoryTreeListeners();
        
        dirTreeListeners.parentRootListener();
    }

    export function editorListeners(): void {
        const editorListeners = new EditorListeners();

        editorListeners.autoSaveListener();
    }

    export function directoryTreeUIModalListeners(): void {
        const dirTreeUIModalListeners = new DirectoryTreeUIModalListeners();

        dirTreeUIModalListeners.createFileListener();
    }
}

function invokeListeners(): void {
    ListenerNs.directoryTreeListeners();

    ListenerNs.editorListeners();

    ListenerNs.directoryTreeUIModalListeners();
}
invokeListeners();