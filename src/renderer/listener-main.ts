import { DirectoryTreeListeners } from "./event-listeners/directory-tree-listeners.js";
import { DirectoryTreeUIModalListeners } from "./event-listeners/directory-tree-ui-modal-listeners.js";
import { SettingsModalListeners } from "./event-listeners/settings-modal-listeners.js";

export namespace ListenerNs {
    export function directoryTreeListeners(): void {
        const dirTreeListeners = new DirectoryTreeListeners();

        dirTreeListeners.parentRootListener();
    }

    export function directoryTreeUIModalListeners(): void {
        const dirTreeUIModalListeners = new DirectoryTreeUIModalListeners();

        dirTreeUIModalListeners.createFileListener();

        dirTreeUIModalListeners.createFolderListener();
    }

    export function settingsModalListeners(): void {
        const settingsModalListenersObj = new SettingsModalListeners();

        settingsModalListenersObj.settingsModalListener();
    }
}

export function invokeListeners(): void {
    window.addEventListener("load", async () => {
        ListenerNs.directoryTreeListeners();

        ListenerNs.directoryTreeUIModalListeners();

        ListenerNs.settingsModalListeners();
    });
}
