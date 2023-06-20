import { SettingsModal } from "../settings/settings-modal"

export class SettingsModalListeners extends SettingsModal {
    /**
     * Settings modal exit listener
     */
    public settingsModalExitListener(): void {
        SettingsModal.settingsModalExitButton.addEventListener('click', () => {
            SettingsModal.settingsModalContainerNode.remove();
        })
    }

    /**
     * Settings modal listener
     */
    public settingsModalListener(): void {
        (document.getElementById("settings-node") as HTMLElement).addEventListener('click', () => {
            console.log("clicked settings node");

            //create settings modal container
            this.settingsModalContainer();

            //invoke settings modal exit listener
            this.settingsModalExitListener();

            if(
                (document.querySelector('.pm-light-option') as HTMLElement).hasAttribute("selected") 
                && (document.querySelector('.pm-editor-dark-theme') as HTMLElement) !== null
            ) {
                //remove dark stylesheet node
                document.querySelectorAll('.pm-editor-dark-theme').forEach((el) => {
                    el.remove();
                });

                return;
            } else {
                //pm theme selection (no persistence at the moment)
                (document.getElementById("pm-theme-select") as HTMLElement).addEventListener('change', (e) => {
                    const currVal = (e.currentTarget as HTMLSelectElement);
    
                    //if dark theme exists in dom
                    if((document.querySelector('.pm-editor-dark-theme') as HTMLElement) !== null) {
                        //remove stylesheet node
                        document.querySelectorAll('.pm-editor-dark-theme').forEach((el) => {
                            el.remove();
                        })
                    }
                    
                    //if selection is light theme
                    if(currVal.value === 'pm-light') {
                        (document.querySelector('.pm-dark-option') as HTMLElement).removeAttribute("selected");
    
                        (document.querySelector('.pm-light-option') as HTMLElement).setAttribute("selected", "");
                    //if selection is dark theme
                    } else if(currVal.value === 'pm-dark') {
                        (document.querySelector('.pm-light-option') as HTMLElement).removeAttribute("selected");
    
                        (document.querySelector('.pm-dark-option') as HTMLElement).setAttribute("selected", "");
                        
                        //link node
                        const linkNode: HTMLLinkElement = document.createElement('link');
                        linkNode.setAttribute("rel", "stylesheet");
                        linkNode.setAttribute("href", "./assets/editor-dark.css");
                        linkNode.setAttribute("class", "pm-editor-dark-theme");
                        document.body.appendChild(linkNode);
                    }
                })
            }
        })
    }
}