import { App } from "../app";
import { appendHorizontalLineNode } from "../misc-ui/horizontal-line";
import { Settings } from "./settings";

export class SettingsModal {
    static settingsModalContainerNode: HTMLDivElement;
    static settingsModalInnerWindow: HTMLDivElement;
    static settingsModalExitButton: HTMLDivElement;
    static settingsModalOptionsContainer: HTMLDivElement;

    /**
     * Settings modal exit
     */
    public settingsModalExit(): void {
        SettingsModal.settingsModalExitButton = document.createElement("div");
        SettingsModal.settingsModalExitButton.setAttribute("id", "settings-modal-exit");
        SettingsModal.settingsModalInnerWindow.appendChild(SettingsModal.settingsModalExitButton);

        const settingsModalExitTextNode: Text = document.createTextNode("x");
        SettingsModal.settingsModalExitButton.appendChild(settingsModalExitTextNode);
    }

    /**
     * Editor theme options
     */
    public editorThemeOptions(): void {
        //theme options container
        const themeOptionsContainer: HTMLDivElement = document.createElement("div");
        themeOptionsContainer.setAttribute("id", "theme-options-container");
        SettingsModal.settingsModalOptionsContainer.appendChild(themeOptionsContainer);

        //theme options container title
        const themeOptionsContainerTitle: HTMLDivElement = document.createElement("div");
        themeOptionsContainerTitle.setAttribute("id", "theme-options-container-title");
        themeOptionsContainer.appendChild(themeOptionsContainerTitle);

        //theme options container title text node
        const themeOptionsContainerTitleTextNode: Text = document.createTextNode("Themes");
        themeOptionsContainerTitle.appendChild(themeOptionsContainerTitleTextNode);

        //horizontal line
        appendHorizontalLineNode(themeOptionsContainer);

        //theme label
        const themeLabel: HTMLLabelElement = document.createElement("label");
        themeLabel.setAttribute("for", "editor-themes");
        themeLabel.setAttribute("class", "editor-theme-label");
        themeLabel.textContent = "Editor";
        themeOptionsContainer.appendChild(themeLabel);

        //theme select
        const themeSelect: HTMLSelectElement = document.createElement("select");
        themeSelect.setAttribute("name", "editor-themes");
        themeSelect.setAttribute("id", "theme-select");
        themeOptionsContainer.appendChild(themeSelect);

        //theme option light
        const themeOptionLight: HTMLOptionElement = document.createElement("option");
        themeOptionLight.setAttribute("value", "editor-light");
        themeOptionLight.setAttribute("class", "light-option");
        themeOptionLight.textContent = "Default Light";
        themeSelect.appendChild(themeOptionLight);

        //theme option dark
        const themeOptionDark: HTMLOptionElement = document.createElement("option");
        themeOptionDark.setAttribute("value", "editor-dark");
        themeOptionDark.setAttribute("class", "dark-option");
        themeOptionDark.textContent = "Default Dark";
        themeSelect.appendChild(themeOptionDark);

        //if light theme is true
        if (Settings.getSettings.lightTheme) {
            //set option selection to light theme
            themeOptionLight.setAttribute("selected", "");
            //if dark theme is true
        } else if (Settings.getSettings.darkTheme) {
            //set option selection to dark theme
            themeOptionDark.setAttribute("selected", "");
        }
    }

    /**
     * Advanced mode options
     */
    public advancedModeOptions(): void {
        //advanced mode options container
        const advancedModeOptionsContainer: HTMLDivElement = document.createElement("div");
        advancedModeOptionsContainer.setAttribute("id", "advanced-mode-options-container");
        SettingsModal.settingsModalOptionsContainer.appendChild(advancedModeOptionsContainer);

        //advanced mode options container title
        const advancedModeOptionsContainerTitle: HTMLDivElement = document.createElement("div");
        advancedModeOptionsContainerTitle.setAttribute("id", "advanced-mode-options-container-title");
        advancedModeOptionsContainer.appendChild(advancedModeOptionsContainerTitle);

        //advanced mode options container title text node
        const advancedModeOptionsContainerTitleTextNode: Text = document.createTextNode("Advanced Mode");
        advancedModeOptionsContainerTitle.appendChild(advancedModeOptionsContainerTitleTextNode);

        //horizontal line
        appendHorizontalLineNode(advancedModeOptionsContainer);

        //advanced mode cursor label
        const advancedModeCursorLabel: HTMLLabelElement = document.createElement("label");
        advancedModeCursorLabel.setAttribute("for", "advanced-mode-options");
        advancedModeCursorLabel.setAttribute("class", "advanced-mode-label");
        advancedModeCursorLabel.textContent = "Cursor";
        advancedModeOptionsContainer.appendChild(advancedModeCursorLabel);

        //advanced mode cursor select
        const advancedModeCursorSelect: HTMLSelectElement = document.createElement("select");
        advancedModeCursorSelect.setAttribute("name", "advanced-mode-options");
        advancedModeCursorSelect.setAttribute("id", "advanced-mode-options-select");
        advancedModeOptionsContainer.appendChild(advancedModeCursorSelect);

        //advanced mode default cursor option
        const advancedModeDefaultCursorOption: HTMLOptionElement = document.createElement("option");
        advancedModeDefaultCursorOption.setAttribute("value", "default-cursor");
        advancedModeDefaultCursorOption.setAttribute("class", "default-cursor-option");
        advancedModeDefaultCursorOption.textContent = "Default Cursor";
        advancedModeCursorSelect.appendChild(advancedModeDefaultCursorOption);

        //advanced mode block cursor option
        const advancedModeBlockCursorOption: HTMLOptionElement = document.createElement("option");
        advancedModeBlockCursorOption.setAttribute("value", "block-cursor");
        advancedModeBlockCursorOption.setAttribute("class", "block-cursor-option");
        advancedModeBlockCursorOption.textContent = "Block Cursor";
        advancedModeCursorSelect.appendChild(advancedModeBlockCursorOption);

        if (Settings.getSettings.defaultCursor) {
            advancedModeDefaultCursorOption.setAttribute("selected", "");
        } else if (Settings.getSettings.blockCursor) {
            advancedModeBlockCursorOption.setAttribute("selected", "");
        }
    }

    public modeDropdownSelectionOptions(): void {
        const modeDropdownOptionsContainer: HTMLDivElement = document.createElement("div");
        modeDropdownOptionsContainer.setAttribute("id", "mode-dropdown-options-container");
        SettingsModal.settingsModalOptionsContainer.appendChild(modeDropdownOptionsContainer);

        const modeDropdownOptionsContainerTitle: HTMLDivElement = document.createElement("div");
        modeDropdownOptionsContainerTitle.setAttribute("id", "mode-dropdown-options-container-title");
        modeDropdownOptionsContainer.appendChild(modeDropdownOptionsContainerTitle);

        const modeDropdownOptionsContainerTitleTextNode: Text = document.createTextNode("Mode Selection");
        modeDropdownOptionsContainerTitle.appendChild(modeDropdownOptionsContainerTitleTextNode);

        appendHorizontalLineNode(modeDropdownOptionsContainer);

        //basic mode selection label
        const basicModeSelectLabel: HTMLLabelElement = document.createElement("label");
        basicModeSelectLabel.setAttribute("for", "basic-mode-selection-options");
        basicModeSelectLabel.setAttribute("class", "basic-mode-selection-options-select-label");
        basicModeSelectLabel.textContent = "Show basic in dropdown";
        modeDropdownOptionsContainer.appendChild(basicModeSelectLabel);

        //basic mode selection toggle select
        const basicModeToggleSelect: HTMLSelectElement = document.createElement("select");
        basicModeToggleSelect.setAttribute("name", "basic-mode-selection-options");
        basicModeToggleSelect.setAttribute("id", "basic-mode-toggle-options-select");
        modeDropdownOptionsContainer.appendChild(basicModeToggleSelect);

        //basic mode true toggle option
        const basicModeToggleTrue: HTMLOptionElement = document.createElement("option");
        basicModeToggleTrue.setAttribute("value", "basic-mode-toggle-true");
        basicModeToggleTrue.setAttribute("class", "basic-mode-toggle-true-option");
        basicModeToggleTrue.textContent = "Always";
        basicModeToggleSelect.appendChild(basicModeToggleTrue);

        //basic mode false toggle option
        const basicModeToggleFalse: HTMLOptionElement = document.createElement("option");
        basicModeToggleFalse.setAttribute("value", "basic-mode-toggle-false");
        basicModeToggleFalse.setAttribute("class", "basic-mode-toggle-false-option");
        basicModeToggleFalse.textContent = "Never";
        basicModeToggleSelect.appendChild(basicModeToggleFalse);

        //advanced mode selection label
        const advancedModeSelectLabel: HTMLLabelElement = document.createElement("label");
        advancedModeSelectLabel.setAttribute("for", "advanced-mode-selection-options");
        advancedModeSelectLabel.setAttribute("class", "advanced-mode-selection-options-select-label");
        advancedModeSelectLabel.textContent = "Show advanced in dropdown";
        modeDropdownOptionsContainer.appendChild(advancedModeSelectLabel);

        //advanced mode selection toggle select
        const advancedModeToggleSelect: HTMLSelectElement = document.createElement("select");
        advancedModeToggleSelect.setAttribute("name", "advanced-mode-selection-options");
        advancedModeToggleSelect.setAttribute("id", "advanced-mode-toggle-options-select");
        modeDropdownOptionsContainer.appendChild(advancedModeToggleSelect);

        //advanced mode true toggle option
        const advancedModeToggleTrue: HTMLOptionElement = document.createElement("option");
        advancedModeToggleTrue.setAttribute("value", "advanced-mode-toggle-true");
        advancedModeToggleTrue.setAttribute("class", "advanced-mode-toggle-true-option");
        advancedModeToggleTrue.textContent = "Always";
        advancedModeToggleSelect.appendChild(advancedModeToggleTrue);

        //advanced mode false toggle option
        const advancedModeToggleFalse: HTMLOptionElement = document.createElement("option");
        advancedModeToggleFalse.setAttribute("value", "advanced-mode-toggle-false");
        advancedModeToggleFalse.setAttribute("class", "advanced-mode-toggle-false-option");
        advancedModeToggleFalse.textContent = "Never";
        advancedModeToggleSelect.appendChild(advancedModeToggleFalse);

        if (Settings.getSettings.showBasicInSelection) {
            basicModeToggleTrue.setAttribute("selected", "");

            if (Settings.getSettings.showAdvancedInSelection) {
                advancedModeToggleTrue.setAttribute("selected", "");
            } else if (!Settings.getSettings.showAdvancedInSelection) {
                advancedModeToggleFalse.setAttribute("selected", "");
            }
        } else if (!Settings.getSettings.showBasicInSelection) {
            basicModeToggleFalse.setAttribute("selected", "");

            if (Settings.getSettings.showAdvancedInSelection) {
                advancedModeToggleTrue.setAttribute("selected", "");
            } else if (!Settings.getSettings.showAdvancedInSelection) {
                advancedModeToggleFalse.setAttribute("selected", "");
            }
        }
    }

    /**
     * Settings modal container
     */
    public settingsModalContainer(): void {
        //settings modal container node
        SettingsModal.settingsModalContainerNode = document.createElement("div");
        SettingsModal.settingsModalContainerNode.setAttribute("id", "settings-modal-container-node");
        App.appNode.insertBefore(SettingsModal.settingsModalContainerNode, App.appNode.firstChild);

        //settings modal inner window
        SettingsModal.settingsModalInnerWindow = document.createElement("div");
        SettingsModal.settingsModalInnerWindow.setAttribute("id", "settings-modal-inner-window");
        SettingsModal.settingsModalContainerNode.appendChild(SettingsModal.settingsModalInnerWindow);

        //settings modal options container
        SettingsModal.settingsModalOptionsContainer = document.createElement("div");
        SettingsModal.settingsModalOptionsContainer.setAttribute("id", "settings-modal-options-container");
        SettingsModal.settingsModalInnerWindow.appendChild(SettingsModal.settingsModalOptionsContainer);

        //settings modal exit
        this.settingsModalExit();

        //editor theme options
        this.editorThemeOptions();

        //advanced mode options
        this.advancedModeOptions();

        this.modeDropdownSelectionOptions();
    }
}
