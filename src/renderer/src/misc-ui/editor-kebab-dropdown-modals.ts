import { App } from "../../app"

export class EditorKebabDropdownModals {
    static kebabModalInnerWindow: HTMLDivElement;
    static kebabModalContinueButtonNode: HTMLDivElement;
    static kebabModalExitButtonNode: HTMLDivElement;
    static kebabModalContainerNode: HTMLDivElement;

    /**
     * Kebab modal continue button 
     * 
     * @protected
     */
    protected kebabModalContinueButton(): void {
        EditorKebabDropdownModals.kebabModalContinueButtonNode = document.createElement('div');
        EditorKebabDropdownModals.kebabModalContinueButtonNode.setAttribute("id", "kebab-modal-continue-button");
        EditorKebabDropdownModals.kebabModalInnerWindow.appendChild(EditorKebabDropdownModals.kebabModalContinueButtonNode);

        const kebabModalContinueButtonTextNode: Text = document.createTextNode("Continue");
        EditorKebabDropdownModals.kebabModalContinueButtonNode.appendChild(kebabModalContinueButtonTextNode);
    }

    /**
     * Kebab modal exit button
     *  
     * @protected
     */
    protected kebabModalExitButton(): void {
        //kebab modal exit button node
        EditorKebabDropdownModals.kebabModalExitButtonNode = document.createElement('div');
        EditorKebabDropdownModals.kebabModalExitButtonNode.setAttribute("id", "kebab-modal-exit-button");
        EditorKebabDropdownModals.kebabModalInnerWindow.appendChild(EditorKebabDropdownModals.kebabModalExitButtonNode);

        //kebab modal exit button text node
        const kebabModalExitButtonTextNode: Text = document.createTextNode("Cancel");
        EditorKebabDropdownModals.kebabModalExitButtonNode.appendChild(kebabModalExitButtonTextNode);
    }

    /**
     * Kebbab modal container 
     * 
     * @protected
     */
    protected kebabModalContainer(): void {
        console.log("kebab modal container");

        //kebab modal container node
        EditorKebabDropdownModals.kebabModalContainerNode = document.createElement('div');
        EditorKebabDropdownModals.kebabModalContainerNode.setAttribute("id", "kebab-modal-container-node");
        App.appNode.insertBefore(EditorKebabDropdownModals.kebabModalContainerNode, App.appNode.firstChild);

        //kebab modal inner window
        EditorKebabDropdownModals.kebabModalInnerWindow = document.createElement('div');
        EditorKebabDropdownModals.kebabModalInnerWindow.setAttribute("id", "kebab-modal-inner-window");
        EditorKebabDropdownModals.kebabModalContainerNode.appendChild(EditorKebabDropdownModals.kebabModalInnerWindow);

        //kebab modal text node container
        const kebabModalTextNodeContainer: HTMLDivElement = document.createElement('div');
        kebabModalTextNodeContainer.setAttribute("id", "kebab-modal-text-node-container");
        EditorKebabDropdownModals.kebabModalInnerWindow.appendChild(kebabModalTextNodeContainer);

        document.querySelectorAll('.child-file-name.is-active-child').forEach((el) => {
            const kebabModalTextNode1: Text = document.createTextNode(
                "Are you sure you want to delete "
                + el.textContent + ".md?"
            );            
            
            kebabModalTextNodeContainer.appendChild(kebabModalTextNode1);

            for(let i = 0; i < 2; i++) {
                const kebabModalTextNodeBreak: HTMLElement = document.createElement('br');
                kebabModalTextNodeContainer.appendChild(kebabModalTextNodeBreak);
            }

            const kebabModalTextNode2: Text = document.createTextNode("You can retrieve it from your system trash to restore the file.");

            kebabModalTextNodeContainer.appendChild(kebabModalTextNode2);
        })
        
        this.kebabModalContinueButton();
        this.kebabModalExitButton();
    }
}