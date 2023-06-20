import { App } from "../../app"

export class KebabDropdownModals {
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
        KebabDropdownModals.kebabModalContinueButtonNode = document.createElement('div');
        KebabDropdownModals.kebabModalContinueButtonNode.setAttribute("id", "kebab-modal-continue-button");
        KebabDropdownModals.kebabModalInnerWindow.appendChild(KebabDropdownModals.kebabModalContinueButtonNode);

        const kebabModalContinueButtonTextNode: Text = document.createTextNode("Continue");
        KebabDropdownModals.kebabModalContinueButtonNode.appendChild(kebabModalContinueButtonTextNode);
    }

    /**
     * Kebab modal exit button
     *  
     * @protected
     */
    protected kebabModalExitButton(): void {
        KebabDropdownModals.kebabModalExitButtonNode = document.createElement('div');
        KebabDropdownModals.kebabModalExitButtonNode.setAttribute("id", "kebab-modal-exit-button");
        KebabDropdownModals.kebabModalInnerWindow.appendChild(KebabDropdownModals.kebabModalExitButtonNode);

        const kebabModalExitButtonTextNode: Text = document.createTextNode("Cancel");
        KebabDropdownModals.kebabModalExitButtonNode.appendChild(kebabModalExitButtonTextNode);
    }

    /**
     * Kebbab modal container 
     * 
     * @protected
     */
    protected kebabModalContainer(): void {
        console.log("kebab modal container");

        KebabDropdownModals.kebabModalContainerNode = document.createElement('div');
        KebabDropdownModals.kebabModalContainerNode.setAttribute("id", "kebab-modal-container-node");
        App.appNode.insertBefore(KebabDropdownModals.kebabModalContainerNode, App.appNode.firstChild);

        KebabDropdownModals.kebabModalInnerWindow = document.createElement('div');
        KebabDropdownModals.kebabModalInnerWindow.setAttribute("id", "kebab-modal-inner-window");
        KebabDropdownModals.kebabModalContainerNode.appendChild(KebabDropdownModals.kebabModalInnerWindow);

        const kebabModalTextNodeContainer: HTMLDivElement = document.createElement('div');
        kebabModalTextNodeContainer.setAttribute("id", "kebab-modal-text-node-containner");
        KebabDropdownModals.kebabModalInnerWindow.appendChild(kebabModalTextNodeContainer);

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