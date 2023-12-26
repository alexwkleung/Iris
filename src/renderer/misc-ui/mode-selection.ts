import { Settings } from "../settings/settings";

export class ModeSelectionUI {
    public createModeSelection(): void {
        const modeSelectionContainer: HTMLElement = document.createElement("div");
        modeSelectionContainer.setAttribute("id", "mode-selection-container");
        modeSelectionContainer.style.display = "none";
        (document.getElementById("app") as HTMLElement).insertBefore(
            modeSelectionContainer,
            document.getElementById("editor-container") as HTMLElement
        );

        const modeSelectionOptionLabel: HTMLLabelElement = document.createElement("label");
        modeSelectionOptionLabel.setAttribute("for", "editor-mode-select");
        modeSelectionOptionLabel.setAttribute("class", "editor-mode-label");
        modeSelectionOptionLabel.textContent = "Mode";
        modeSelectionContainer.appendChild(modeSelectionOptionLabel);

        const modeSelectionSelect: HTMLSelectElement = document.createElement("select");
        modeSelectionSelect.setAttribute("name", "editor-mode");
        modeSelectionSelect.setAttribute("id", "editor-mode-select");
        modeSelectionContainer.appendChild(modeSelectionSelect);

        //advanced mode option
        const advancedModeOption: HTMLOptionElement = document.createElement("option");
        advancedModeOption.setAttribute("value", "advanced-mode");
        advancedModeOption.setAttribute("class", "advanced-mode-option");
        advancedModeOption.textContent = "Markdown";
        advancedModeOption.style.display = "";
        (document.getElementById("editor-mode-select") as HTMLElement).appendChild(advancedModeOption);

        //reading mode option
        const readingModeOption: HTMLOptionElement = document.createElement("option");
        readingModeOption.setAttribute("value", "reading-mode");
        readingModeOption.setAttribute("class", "reading-mode-option");
        readingModeOption.textContent = "Reading";
        (document.getElementById("editor-mode-select") as HTMLElement).appendChild(readingModeOption);

        //if advanced mode is true
        if (Settings.getSettings.advancedMode) {
            advancedModeOption.setAttribute("selected", "");
        } else if (Settings.getSettings.readingMode) {
            readingModeOption.setAttribute("selected", "");
        }
    }

    public showModeSelectionUI(): void {
        (document.getElementById("mode-selection-container") as HTMLElement).style.display = "";
    }

    public static modeSelection: ModeSelectionUI = new ModeSelectionUI();
}
