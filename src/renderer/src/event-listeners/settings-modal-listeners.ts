import { SettingsModal } from "../settings/settings-modal"
import { Settings, EditorThemes } from "../settings/settings"
import { fsMod } from "../utils/alias"

//https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
//https://vitejs.dev/guide/assets.html#importing-asset-as-url
//?inline: to prevent auto injection
//?url: get url of named import
//import editorDark from '../../assets/editor-dark.css?inline?url'

/**
 * @extends SettingsModal
 */
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
                        //log
                        console.log(Settings.parseThemeSettings().lightTheme);

                        (document.querySelector('.dark-option') as HTMLElement).removeAttribute("selected");
    
                        (document.querySelector('.light-option') as HTMLElement).setAttribute("selected", "");

                        const updatedSettings: string = '{"lightTheme":true,"darkTheme":false}';

                        if(!Settings.parseThemeSettings().lightTheme) {
                            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/iris-settings.json", updatedSettings);
                        } else {
                            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/iris-settings.json", updatedSettings);
                        }

                    //if selection is dark theme
                    } else if(currentSelection.value === 'editor-dark') {
                        //log
                        console.log(Settings.parseThemeSettings().darkTheme);

                        (document.querySelector('.light-option') as HTMLElement).removeAttribute("selected");
    
                        (document.querySelector('.dark-option') as HTMLElement).setAttribute("selected", "");

                        //apply dark theme
                        EditorThemes.darkTheme();

                        const updatedSettings: string = '{"lightTheme":false,"darkTheme":true}';

                        if(!Settings.parseThemeSettings().darkTheme) {
                            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/iris-settings.json", updatedSettings);
                        } else {
                            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/iris-settings.json", updatedSettings);
                        }
                    }
                })
            }
        })
    }
}