/**
 * Directory tree ui modal listeners interface
 */
export interface IDirectoryTreeUIModalListeners {
    createFileModalExitListener(): void;
    createFileModalContinueListener(el: HTMLElement): void;
    createFileListener(): void;
    createFolderContinueListener(el: HTMLElement): void;
    createFolderListener(): void;
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
    autoSaveListener(editor: string): void;
    insertTabListener(el: HTMLElement, numberOfSpaces: number): void;
}
