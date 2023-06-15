/**
 * Directory tree ui modal listeners interface
 */
export interface IDirectoryTreeUIModalListeners {
    createModalExitListener(): void;
    createFileModalContinueListener(el: HTMLElement, type: string): void;
    createFileListener(): void;
    createFolderListener(): void;
}

/**
 * Directory tree listeners interface
 */
export interface IDirectoryTreeListeners {
    parentRootListener(type: string): void;
    childNodeListener(): void;
}

/**
 * Editor listeners interface
 */
export interface IEditorListeners {
    autoSaveListener(type: string): void;
    insertTabListener(numberOfSpaces: number): void;
}