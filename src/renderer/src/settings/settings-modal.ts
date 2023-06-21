import { App } from "../../app"

export class SettingsModal {
    static settingsModalContainerNode: HTMLDivElement;
    static settingsModalInnerWindow: HTMLDivElement;
    static settingsModalExitButton: HTMLDivElement;

    /**
     * Settings modal exit 
     */
    public settingsModalExit(): void {
        SettingsModal.settingsModalExitButton = document.createElement('div');
        SettingsModal.settingsModalExitButton.setAttribute("id", "settings-modal-exit");
        SettingsModal.settingsModalInnerWindow.appendChild(SettingsModal.settingsModalExitButton);

        const settingsModalExitTextNode: Text = document.createTextNode("Exit");
        SettingsModal.settingsModalExitButton.appendChild(settingsModalExitTextNode);
    }

    /**
     * Settings modal container
     */
    public settingsModalContainer(): void {
        //settings modal container node
        SettingsModal.settingsModalContainerNode = document.createElement('div');
        SettingsModal.settingsModalContainerNode.setAttribute("id", "settings-modal-container-node");
        App.appNode.insertBefore(SettingsModal.settingsModalContainerNode, App.appNode.firstChild);

        //settings modal inner window
        SettingsModal.settingsModalInnerWindow = document.createElement('div');
        SettingsModal.settingsModalInnerWindow.setAttribute("id", "settings-modal-inner-window");
        SettingsModal.settingsModalContainerNode.appendChild(SettingsModal.settingsModalInnerWindow);

        //settings modal options container 
        const settingsModalOptionsContainer: HTMLDivElement = document.createElement('div');
        settingsModalOptionsContainer.setAttribute("id", "settings-modal-options-container");
        SettingsModal.settingsModalInnerWindow.appendChild(settingsModalOptionsContainer);

        //settings modal exit
        this.settingsModalExit();

        //theme label
        const themeLabel: HTMLLabelElement = document.createElement('label');
        themeLabel.setAttribute("for", "editor-themes");
        themeLabel.setAttribute("class", "editor-theme-label");
        themeLabel.textContent = "Editor Theme:"
        settingsModalOptionsContainer.appendChild(themeLabel);

        //theme select
        const themeSelect: HTMLSelectElement = document.createElement('select');
        themeSelect.setAttribute("name", "editor-themes");
        themeSelect.setAttribute("id", "theme-select");
        settingsModalOptionsContainer.appendChild(themeSelect);

        //theme option light
        const themeOptionLight: HTMLOptionElement = document.createElement('option');
        themeOptionLight.setAttribute("value", "editor-light");
        themeOptionLight.setAttribute("selected", "");
        themeOptionLight.setAttribute("class", "light-option");
        themeOptionLight.textContent = "Light Theme";
        themeSelect.appendChild(themeOptionLight);

        //theme option dark
        const themeOptionDark: HTMLOptionElement = document.createElement('option');
        themeOptionDark.setAttribute("value", "editor-dark");
        themeOptionDark.setAttribute("class", "dark-option");
        themeOptionDark.textContent = "Dark Theme";
        themeSelect.appendChild(themeOptionDark);
    }
}