import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { fsMod } from "../../utils/alias";
import { Settings } from "../settings/settings";
import { RefsNs } from "./directory-tree-listeners";
import { EditorListeners } from "./editor-listeners";
import { wordCountListener } from "./word-count-listener";
import { AdvancedModeSettings } from "../settings/settings";
import { EditorView } from "@codemirror/view";
import { isModeAdvanced, isModeReading } from "../../utils/is";
import { ReadingMode } from "../misc-ui/reading-mode";
import { markdownParser } from "../../utils/markdown-parser";

import highlightLight from "../../assets/github-light.css?inline?url";
import highlightDark from "../../assets/github-dark.css?inline?url";

export class ModeSelectionListeners extends EditorListeners {
    public modeSelectListener(): void {
        (document.getElementById("editor-mode-select") as HTMLElement).addEventListener("change", (e) => {
            const currentSelection = e.target as HTMLSelectElement;

            if (currentSelection.value === "advanced-mode") {
                console.log("advanced selected");

                if (isModeReading()) {
                    (document.getElementById("app") as HTMLElement).classList.remove("reading-mode-is-active");
                }

                if ((document.getElementById("reading-mode-container") as HTMLElement) !== null) {
                    (document.getElementById("reading-mode-container") as HTMLElement).remove();
                }

                if ((document.querySelector(".reading-mode-option") as HTMLElement).hasAttribute("selected")) {
                    (document.querySelector(".reading-mode-option") as HTMLElement).removeAttribute("selected");
                }

                (document.querySelector(".advanced-mode-option") as HTMLElement).setAttribute("selected", "");

                (document.getElementById("app") as HTMLElement).classList.add("advanced-mode-is-active");

                Settings.getSettings.advancedMode = true;
                Settings.getSettings.readingMode = false;

                fsMod.fs._writeToFileAlt(
                    fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                    JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                );

                RefsNs.currentParentChildData.map((props) => {
                    CMEditorView.reinitializeEditor(
                        fsMod.fs._readFileFolder(props.parentFolderName, props.childFileName + ".md")
                    );
                });

                CMEditorView.setContenteditable(true);

                if (Settings.getSettings.lightTheme) {
                    AdvancedModeSettings.defaultCursor("light");

                    AdvancedModeSettings.highlightLight();
                } else if (Settings.getSettings.darkTheme) {
                    AdvancedModeSettings.defaultCursor("dark");

                    AdvancedModeSettings.highlightDark();
                }

                if (Settings.getSettings.defaultCursor && Settings.getSettings.lightTheme) {
                    AdvancedModeSettings.defaultCursor("light");

                    AdvancedModeSettings.highlightLight();
                } else if (Settings.getSettings.defaultCursor && Settings.getSettings.darkTheme) {
                    AdvancedModeSettings.defaultCursor("dark");

                    AdvancedModeSettings.highlightDark();
                } else if (Settings.getSettings.blockCursor && Settings.getSettings.lightTheme) {
                    AdvancedModeSettings.blockCursor();

                    AdvancedModeSettings.highlightLight();
                } else if (Settings.getSettings.blockCursor && Settings.getSettings.darkTheme) {
                    AdvancedModeSettings.blockCursor();

                    AdvancedModeSettings.highlightDark();
                }

                //set scroll position to the beginning of the view
                CMEditorView.editorView.dispatch({
                    effects: EditorView.scrollIntoView(0),
                });

                this.autoSaveListener("codemirror");

                wordCountListener("codemirror");

                (document.getElementById("kebab-dropdown-menu-container") as HTMLElement).style.display = "";
            } else if (currentSelection.value === "reading-mode") {
                if (isModeAdvanced()) {
                    (document.getElementById("app") as HTMLElement).classList.remove("advanced-mode-is-active");
                    (document.getElementById("app") as HTMLElement).classList.add("reading-mode-is-active");

                    Settings.getSettings.advancedMode = false;
                    Settings.getSettings.readingMode = true;

                    fsMod.fs._writeToFileAlt(
                        fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                        JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                    );

                    if ((document.querySelector(".cm-content") as HTMLElement) !== null) {
                        CMEditorView.editorView.destroy();
                    }
                }

                if ((document.querySelector(".advanced-mode-option") as HTMLElement).hasAttribute("selected")) {
                    (document.querySelector(".advanced-mode-option") as HTMLElement).removeAttribute("selected");
                }

                (document.querySelector(".reading-mode-option") as HTMLElement).setAttribute("selected", "");

                (document.getElementById("word-count-container") as HTMLElement).style.display = "none";
                (document.getElementById("kebab-dropdown-menu-container") as HTMLElement).style.display = "none";

                ReadingMode.readingModeNode();

                RefsNs.currentParentChildData.map(async (props) => {
                    const content: string = await markdownParser(
                        fsMod.fs._readFileFolder(props.parentFolderName, props.childFileName + ".md")
                    ).catch((e) => {
                        throw console.error(e);
                    });

                    const rangeContextFragment = new Range().createContextualFragment(content);
                    (document.getElementById("reading-mode-content") as HTMLElement).appendChild(rangeContextFragment);
                });
            }

            if ((document.querySelector(".highlight-light-theme") as HTMLElement) !== null) {
                (document.querySelector(".highlight-light-theme") as HTMLElement).remove();
            }

            if ((document.querySelector(".highlight-dark-theme") as HTMLElement) !== null) {
                (document.querySelector(".highlight-dark-theme") as HTMLElement).remove();
            }

            if (Settings.getSettings.lightTheme) {
                const highlightTheme: HTMLLinkElement = document.createElement("link");
                highlightTheme.setAttribute("rel", "stylesheet");
                highlightTheme.setAttribute("href", highlightLight);
                highlightTheme.setAttribute("class", "highlight-light-theme");
                document.body.appendChild(highlightTheme);
            } else if (Settings.getSettings.darkTheme) {
                const highlightDarkTheme: HTMLLinkElement = document.createElement("link");
                highlightDarkTheme.setAttribute("rel", "stylesheet");
                highlightDarkTheme.setAttribute("href", highlightDark);
                highlightDarkTheme.setAttribute("class", "highlight-dark-theme");
                document.body.appendChild(highlightDarkTheme);
            }
        });
    }

    public invokeModeSelectListeners(): void {
        this.modeSelectListener();
    }

    public static modeSelectListeners: ModeSelectionListeners = new ModeSelectionListeners();
}
