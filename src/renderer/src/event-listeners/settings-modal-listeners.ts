import { SettingsModal } from "../settings/settings-modal"

//https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
//https://vitejs.dev/guide/assets.html#importing-asset-as-url
//?inline: to prevent auto injection
//?url: get url of named import
import editorDark from '../../assets/editor-dark.css?inline?url'

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

            if((document.querySelector('.light-option') as HTMLElement).hasAttribute("selected") && (document.querySelector('.editor-dark-theme') as HTMLElement) !== null) {
                //remove dark stylesheet node
                document.querySelectorAll('.editor-dark-theme').forEach((el) => {
                    el.remove();
                });

                return;
            } else {
                //theme selection (no persistence at the moment)
                (document.getElementById("theme-select") as HTMLElement).addEventListener('change', (e) => {
                    const currentSelection = (e.currentTarget as HTMLSelectElement);
    
                    //if dark theme exists in dom
                    if((document.querySelector('.editor-dark-theme') as HTMLElement) !== null) {
                        //remove stylesheet node
                        document.querySelectorAll('.editor-dark-theme').forEach((el) => {
                            el.remove();
                        })
                    }
                    
                    //if selection is light theme
                    if(currentSelection.value === 'editor-light') {
                        (document.querySelector('.dark-option') as HTMLElement).removeAttribute("selected");
    
                        (document.querySelector('.light-option') as HTMLElement).setAttribute("selected", "");
                    //if selection is dark theme
                    } else if(currentSelection.value === 'editor-dark') {
                        (document.querySelector('.light-option') as HTMLElement).removeAttribute("selected");
    
                        (document.querySelector('.dark-option') as HTMLElement).setAttribute("selected", "");

                        //link node
                        const linkNode: HTMLLinkElement = document.createElement('link');
                        linkNode.setAttribute("rel", "stylesheet");
                        linkNode.setAttribute("href", editorDark);
                        linkNode.setAttribute("class", "editor-dark-theme");
                        document.body.appendChild(linkNode);
                    }
                })
            }
        })
    }
}