import { DirectoryTreeListeners } from "./src/event-listeners/listeners.js"
import { EditorListeners } from "./src/event-listeners/listeners.js"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListenerNs {
    export function directoryTreeListener(): void {
        const dirTreeListeners = new DirectoryTreeListeners();
        
        dirTreeListeners.parentRootListener();

        dirTreeListeners.createFileListener();
    }

    export function editorListener(): void {
        const editorListeners = new EditorListeners();

        editorListeners.autoSaveListener();
    }
}

function invokeListeners(): void {
    ListenerNs.directoryTreeListener();

    ListenerNs.editorListener();
}
invokeListeners();