import { DirectoryTreeUIElements } from './file-directory'
import { App } from '../app'

export class DirectoryTreeUIModals extends DirectoryTreeUIElements {
    /**
     * Create file modal container reference variable
     * 
     * @static
     */
    public static createModalContainer: HTMLDivElement;

    /**
     * Create file modal inner window reference variable 
     * 
     * @static
     */
    public static createModalInnerWindow: HTMLDivElement;

    /**
     * Create file modal inner window text container
     * 
     * @static
     */
    public static createFileModalInnerWindowTextContainer: HTMLDivElement;

    /**
     * Create file modal exit button reference variable
     * 
     * @static 
     */
    public static createModalExitButton: HTMLDivElement;

    /**
     * Create file modal continue button 
     * 
     * @static
     */
    public static createModalContinueButton: HTMLDivElement;

    /**
     * Create file modal exit node 
     * 
     * @private
     */
    private createModalExitNode(): void {
        //create file modal exit node
        DirectoryTreeUIModals.createModalExitButton = document.createElement('div');
        DirectoryTreeUIModals.createModalExitButton.setAttribute("id", "create-modal-exit");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(DirectoryTreeUIModals.createModalExitButton);
       
        //create file modal exit text node
        const createFileModalExitTextNode: Text = document.createTextNode("Cancel");
        DirectoryTreeUIModals.createModalExitButton.appendChild(createFileModalExitTextNode);
    }

    /**
     * Create file modal continue node
     * 
     * @private
     */
    private createModalContinueNode(): void {
        DirectoryTreeUIModals.createModalContinueButton = document.createElement('div');
        DirectoryTreeUIModals.createModalContinueButton.setAttribute("id", "create-modal-continue");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(DirectoryTreeUIModals.createModalContinueButton);

        const createFileModalContinueTextNode: Text = document.createTextNode("Continue");
        DirectoryTreeUIModals.createModalContinueButton.appendChild(createFileModalContinueTextNode);
    }

    /**
     * Create file modal current folder node
     * 
     * @param folderName Name of the current folder to create a file in
     */
    protected createFileModalCurrentFolderNode(folderName: string): void {
        //folder name node
        const folderNameNode: HTMLDivElement = document.createElement('div');
        folderNameNode.setAttribute("id", "create-file-modal-current-folder-node");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(folderNameNode);

        //folder text node
        const folderTextNode: Text = document.createTextNode("Folder: ");
        folderNameNode.appendChild(folderTextNode);

        //folder name input container node
        const folderNameInputContainerNode: HTMLDivElement = document.createElement('div');
        folderNameInputContainerNode.setAttribute("id", "create-file-modal-folder-name-input-container-node");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(folderNameInputContainerNode);

        //folder name input node
        const folderNameInputNode: HTMLInputElement = document.createElement('input');
        folderNameInputNode.setAttribute("id", "create-file-modal-folder-name-input-node");
        folderNameInputNode.setAttribute("type", "text");
        folderNameInputNode.setAttribute("readonly", "true");
        folderNameInputContainerNode.appendChild(folderNameInputNode);

        (folderNameInputNode as HTMLInputElement).value = folderName;
        (folderNameInputNode as HTMLInputElement).textContent = folderName;
    }

    protected createFileModalNewFileNameNode(): void {
        //new file name node
        const newFileNameNode: HTMLDivElement = document.createElement('div');
        newFileNameNode.setAttribute("id", "create-file-modal-new-file-name-node");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(newFileNameNode);

        //new file name text node
        const newFileNameTextNode: Text = document.createTextNode("Name: ");
        newFileNameNode.appendChild(newFileNameTextNode);

        //new file name input node container
        const newFileNameInputNodeContainer: HTMLDivElement = document.createElement('div');
        newFileNameInputNodeContainer.setAttribute("id", "create-file-modal-new-file-name-input-node-container");
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.appendChild(newFileNameInputNodeContainer);

        //new file name input node
        const newFileNameInputNode: HTMLInputElement = document.createElement('input');
        newFileNameInputNode.setAttribute("id", "create-file-modal-new-file-name-input-node");
        newFileNameInputNode.setAttribute("type", "text");
        newFileNameInputNode.setAttribute("placeholder", "Enter a note name");
        newFileNameInputNode.setAttribute("spellcheck", "false");
        newFileNameInputNodeContainer.appendChild(newFileNameInputNode);

        //focus the new file name input node
        newFileNameInputNode.focus();
    }

    /**
     * Create file modal
     * 
     * @protected
     */
    protected createFileModal(): void {
        //create file modal container node
        DirectoryTreeUIModals.createModalContainer = document.createElement('div');
        DirectoryTreeUIModals.createModalContainer.setAttribute("id", "create-modal-container");
        App.appNode.insertBefore(DirectoryTreeUIModals.createModalContainer, App.appNode.firstChild);

        //create file modal inner window node
        DirectoryTreeUIModals.createModalInnerWindow = document.createElement('div');
        DirectoryTreeUIModals.createModalInnerWindow.setAttribute("id", "create-modal-inner-window");
        DirectoryTreeUIModals.createModalContainer.appendChild(DirectoryTreeUIModals.createModalInnerWindow);

        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer = document.createElement('div');
        DirectoryTreeUIModals.createFileModalInnerWindowTextContainer.setAttribute("id", "create-file-modal-inner-window-text-container");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(DirectoryTreeUIModals.createFileModalInnerWindowTextContainer);

        //invoke createFileModalExitNode
        this.createModalExitNode();

        //invoke createFileModalContinueNode
        this.createModalContinueNode();
    }

    protected createFolderModal(): void {
        //create modal container
        DirectoryTreeUIModals.createModalContainer = document.createElement('div');
        DirectoryTreeUIModals.createModalContainer.setAttribute("id", "create-modal-container");
        App.appNode.insertBefore(DirectoryTreeUIModals.createModalContainer, App.appNode.firstChild);

        //create modal inner window
        DirectoryTreeUIModals.createModalInnerWindow = document.createElement('div');
        DirectoryTreeUIModals.createModalInnerWindow.setAttribute("id", "create-modal-inner-window");
        DirectoryTreeUIModals.createModalContainer.appendChild(DirectoryTreeUIModals.createModalInnerWindow);

        //create folder modal inner window text container
        const createFolderModalInnerWindowTextContainer: HTMLDivElement = document.createElement('div');
        createFolderModalInnerWindowTextContainer.setAttribute("id", "create-folder-modal-inner-window-text-container");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(createFolderModalInnerWindowTextContainer);

        //create folder modal inner window text node
        const createFolderModalInnerWindowTextNode: Text = document.createTextNode("Name: ");
        createFolderModalInnerWindowTextContainer.appendChild(createFolderModalInnerWindowTextNode);

        //create folder input node container
        const createFolderInputNodeContainer: HTMLDivElement = document.createElement('div');
        createFolderInputNodeContainer.setAttribute("id", "create-folder-input-node-container");
        DirectoryTreeUIModals.createModalInnerWindow.appendChild(createFolderInputNodeContainer);

        //create folder input node
        const createFolderInputNode: HTMLInputElement = document.createElement('input');
        createFolderInputNode.setAttribute("id", "create-folder-input-node");
        createFolderInputNode.setAttribute("type", "text");
        createFolderInputNode.setAttribute("placeholder", "Enter a folder name");
        createFolderInputNode.setAttribute("spellcheck", "false");
        createFolderInputNodeContainer.appendChild(createFolderInputNode);

        //focus create folder input node
        createFolderInputNode.focus();

        //create modal exit node
        this.createModalExitNode();

        //create modal continue node
        this.createModalContinueNode();
    }
}