import { DirectoryTreeListeners } from "./src/event-listeners/directory-tree-listeners.js"
import { DirectoryTreeUIModalListeners } from "./src/event-listeners/directory-tree-ui-modal-listeners"
import { SettingsModalListeners } from "./src/event-listeners/settings-modal-listeners.js"
import { DirectoryTreeKebabDropdownListeners } from "./src/event-listeners/directory-tree-kebab-dropdown-listener.js"

export namespace ListenerNs {
    export function directoryTreeListeners(): void {
        const dirTreeListeners = new DirectoryTreeListeners();

        //needs to be in sync with mode switch when implemented?
        dirTreeListeners.parentRootListener();
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

    export function kebabListeners(): void {
        const directoryTreeKebabDropdownListener = new DirectoryTreeKebabDropdownListeners();

        directoryTreeKebabDropdownListener.directoryTreeKebabDropdownListeners();
    }
}

function invokeListeners(): void {
    window.addEventListener('load', async () => {
        ListenerNs.directoryTreeListeners();
        
        ListenerNs.directoryTreeUIModalListeners();

        ListenerNs.settingsModalListeners();

        ListenerNs.kebabListeners();
    });
}
invokeListeners();