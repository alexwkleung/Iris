import { DirectoryTreeListeners } from "./src/event-listeners/listeners.js"
import { EditorListeners } from "./src/event-listeners/listeners.js"

export namespace ListenerNs {
    export function directoryTreeListener(): void {
        const dirTreeListeners = new DirectoryTreeListeners();
        
        dirTreeListeners.parentRootListener();
    }

    export function editorListener() {
        const editorListeners = new EditorListeners();

        editorListeners.autoSaveListener();
    }
}

function invokeListeners() {
    ListenerNs.directoryTreeListener();

    ListenerNs.editorListener();
}
invokeListeners();