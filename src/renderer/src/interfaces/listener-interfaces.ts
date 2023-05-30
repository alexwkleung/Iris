/**
 * Directory tree ui modal listeners interface
 */
export interface IDirectoryTreeUIModalListeners {
    createFileModalExitListener(): void;
    createFileListener(): void;
}

/**
 * Directory tree listeners interface
 */
export interface IDirectoryTreeListeners {
    parentRootListener(): void;
    childNodeListener(): void;
}

/**
 * Editor listeners interface
 */
export interface IEditorListeners {
    autoSaveListener(): void;
}