import { DirectoryTreeListeners } from "./src/event-listeners/listeners.js"

export function listener(): void {
    const dirTreeListeners = new DirectoryTreeListeners();
    
    dirTreeListeners.parentRootListener();
}
listener();