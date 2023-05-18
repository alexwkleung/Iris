import { DirectoryTreeListeners } from "./event-listeners/listeners.js"

function listener() {
    const dirTreeListeners = new DirectoryTreeListeners();
    
    dirTreeListeners.parentRootListener();
}
listener();