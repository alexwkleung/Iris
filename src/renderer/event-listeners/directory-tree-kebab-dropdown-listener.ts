import { CMEditorView } from "../codemirror/editor/cm-editor-view";
import { fsMod } from "../utils/alias";
import { Settings } from "../settings/settings";
import { RefsNs } from "./directory-tree-listeners";
import { EditorListeners } from "./editor-listeners";
import { EditorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener";
import { CMEditorState } from "../codemirror/editor/cm-editor-state";
import { cursors } from "../codemirror/extensions/cursors";
import { wordCountListener } from "./word-count-listener";
import { AdvancedModeSettings } from "../settings/settings";
import { EditorView } from "@codemirror/view";
import { isModeAdvanced, isModeReading } from "../utils/is";
import { ReadingMode } from "../misc-ui/reading-mode";
import { markdownParser } from "../utils/markdown-parser";

import highlightLight from "../../assets/classic-light.min.css?inline?url";
import highlightDark from "../../assets/classic-dark.min.css?inline?url";

export class DirectoryTreeKebabDropdownListeners extends EditorListeners {
    /**
     *
     * Editor kebab dropdown listeners
     *
     * @private
     * @protected
     */
    private readonly editorKebabDropdownListeners = new EditorKebabDropdownMenuListeners();

    /**
     * Kebab dropdown button listener
     */
    public kebabDropdownButtonListener(): void {
        (document.getElementById("file-directory-kebab-dropdown-menu-container") as HTMLElement).addEventListener(
            "click",
            () => {
                //toggle is-active class
                (
                    document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement
                ).classList.toggle("is-active");

                //check if file-directory-kebab-after-click-menu-container contains is-active class
                if (
                    (
                        document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement
                    ).classList.contains("is-active")
                ) {
                    //show menu container
                    (
                        document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement
                    ).style.display = "";
                } else {
                    //hide menu container
                    (
                        document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement
                    ).style.display = "none";
                }
            }
        );

        //hide file directory kebab after click menu container when file directory tree container inner region is clicked
        (document.getElementById("file-directory-tree-container-inner") as HTMLElement).addEventListener(
            "click",
            () => {
                (
                    document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement
                ).style.display = "none";

                (
                    document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement
                ).classList.remove("is-active");
            }
        );
    }

    /**
     * Kebab dorpdown select listener
     */
    public kebabDropdownSelectListener(): void {
        (document.getElementById("editor-mode-select") as HTMLElement).addEventListener("change", (e) => {
            const currentSelection = e.target as HTMLSelectElement;

            if (currentSelection.value === "advanced-mode") {
                //log
                console.log("advanced selected");

                //if reading mode is active
                if (isModeReading()) {
                    (document.getElementById("app") as HTMLElement).classList.remove("reading-mode-is-active");
                }

                //check if reading mode node is present in dom
                if ((document.getElementById("reading-mode-container") as HTMLElement) !== null) {
                    //remove it
                    (document.getElementById("reading-mode-container") as HTMLElement).remove();
                }

                //check attributes and remove them
                if ((document.querySelector(".reading-mode-option") as HTMLElement).hasAttribute("selected")) {
                    (document.querySelector(".reading-mode-option") as HTMLElement).removeAttribute("selected");
                }

                //set correct attribute
                (document.querySelector(".advanced-mode-option") as HTMLElement).setAttribute("selected", "");

                //add advanced-mode-is-active class
                (document.getElementById("app") as HTMLElement).classList.add("advanced-mode-is-active");

                Settings.getSettings.advancedMode = true;
                Settings.getSettings.readingMode = false;

                fsMod.fs._writeToFileAlt(
                    fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                    JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                );

                CMEditorView.createEditorView();
                CMEditorView.setContenteditable(true);

                RefsNs.currentParentChildData.map((props) => {
                    //dispatch text insertion tr
                    CMEditorView.editorView.dispatch({
                        changes: {
                            from: 0,
                            to: 0,
                            insert: fsMod.fs._readFileFolder(props.parentFolderName, props.childFileName + ".md"),
                        },
                    });
                });

                if (Settings.getSettings.lightTheme) {
                    AdvancedModeSettings.defaultCursor("light");

                    AdvancedModeSettings.highlightLight();
                } else if (Settings.getSettings.darkTheme) {
                    AdvancedModeSettings.defaultCursor("dark");

                    AdvancedModeSettings.highlightDark();
                }

                //check block cursor
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

                //kebab dropdown menu listener
                this.editorKebabDropdownListeners.kebabDropdownMenuListener();
            } else if (currentSelection.value === "reading-mode") {
                //if mode is advanced
                if (isModeAdvanced()) {
                    (document.getElementById("app") as HTMLElement).classList.remove("advanced-mode-is-active");
                    (document.getElementById("app") as HTMLElement).classList.add("reading-mode-is-active");

                    Settings.getSettings.advancedMode = false;
                    Settings.getSettings.readingMode = true;

                    fsMod.fs._writeToFileAlt(
                        fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                        JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                    );

                    CMEditorView.editorView.destroy();
                }

                if ((document.querySelector(".advanced-mode-option") as HTMLElement).hasAttribute("selected")) {
                    (document.querySelector(".advanced-mode-option") as HTMLElement).removeAttribute("selected");
                }

                (document.querySelector(".reading-mode-option") as HTMLElement).setAttribute("selected", "");

                //hide word count
                (document.getElementById("word-count-container") as HTMLElement).style.display = "none";

                //hide kebab dropdown menu
                (document.getElementById("kebab-dropdown-menu-container") as HTMLElement).style.display = "none";

                ReadingMode.readingModeNode();

                RefsNs.currentParentChildData.map(async (props) => {
                    const content: string = await markdownParser(
                        fsMod.fs._readFileFolder(props.parentFolderName, props.childFileName + ".md")
                    ).catch((e) => {
                        throw console.error(e);
                    });

                    //create fragment
                    const rangeContextFragment = new Range().createContextualFragment(content);
                    (document.getElementById("reading-mode-content") as HTMLElement).appendChild(rangeContextFragment);

                    //link behaviour
                    document.querySelectorAll("#reading-mode-container a").forEach((el) => {
                        el.addEventListener("click", (e) => {
                            e.preventDefault();
                        });
                    });
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

    /**
     * Directory tree kebab dropdown listeners
     */
    public directoryTreeKebabDropdownListeners(): void {
        //kebab dropdown button listener
        this.kebabDropdownButtonListener();

        //kebab dropdown select listener
        this.kebabDropdownSelectListener();
    }
}
