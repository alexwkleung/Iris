import { DirectoryTreeListeners } from "./src/event-listeners/directory-tree-listeners.js"
import { DirectoryTreeUIModalListeners } from "./src/event-listeners/directory-tree-ui-modal-listeners"
import { SettingsModalListeners } from "./src/event-listeners/settings-modal-listeners.js"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListenerNs {
    export function directoryTreeListeners(): void {
        const dirTreeListeners = new DirectoryTreeListeners();

        //needs to be in sync with mode switch when implemented?
        dirTreeListeners.parentRootListener("Basic");
    }

    export function directoryTreeUIModalListeners(): void {
        const dirTreeUIModalListeners = new DirectoryTreeUIModalListeners();

        //needs to be in sync with mode switch when implemented?
        dirTreeUIModalListeners.createFileListener();

        dirTreeUIModalListeners.createFolderListener();
    }

    export function settingsModalListeners(): void {
        const settingsModalListenersObj = new SettingsModalListeners();

        settingsModalListenersObj.settingsModalListener();
    }
}

function invokeListeners(): void {
    window.addEventListener('load', async () => {
        ListenerNs.directoryTreeListeners();
        
        ListenerNs.directoryTreeUIModalListeners();

        ListenerNs.settingsModalListeners();
    });
}
invokeListeners();