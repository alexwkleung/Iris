import { directoryNs } from "./directory-main";
import { EditorNs } from "./editor-main";
import { windowNs } from "./window/draggable-area";
import { Settings, EditorThemes } from "./settings/settings";
import { AdvancedModeSettings } from "./settings/settings";
import mermaid from "mermaid";
import { GenericEvent } from "./event-listeners/event";
import { createApp } from "./app";
import { invokeListeners } from "./listener-main";
import { fsMod } from "./utils/alias";

namespace RendererProcess {
    class Renderer {
        /**
         * Coupled namespace function
         *
         * @private
         */
        private coupleNs(): void {
            //draggable area
            windowNs.draggableArea();

            //directory
            directoryNs.directory();

            //editor
            EditorNs.editor();
        }

        /**
         * Load theme
         *
         * @private
         */
        private loadTheme(): void {
            //load themes
            if (Settings.getSettings.lightTheme) {
                //if dark theme exists in dom
                if ((document.querySelector(".editor-dark-theme") as HTMLElement) !== null) {
                    //remove stylesheet node
                    document.querySelectorAll(".editor-dark-theme").forEach((el) => {
                        el.remove();
                    });

                    document.querySelectorAll(".highlight-dark-theme").forEach((el) => {
                        el.remove();
                    });
                }
                //dark theme
            } else if (Settings.getSettings.darkTheme) {
                EditorThemes.darkTheme();

                document.querySelectorAll(".highlight-light-theme").forEach((el) => {
                    el.remove();
                });
            }

            //initialize mermaid
            mermaid.initialize({
                theme: "forest",
                startOnLoad: true,
            });
        }

        /**
         * Load mode
         *
         * @private
         */
        private loadMode(): void {
            //load mode selection
            if (!Settings.getSettings.showBasicInSelection) {
                (document.querySelector(".basic-mode-option") as HTMLElement).style.display = "none";

                if (!Settings.getSettings.showAdvancedInSelection) {
                    (document.querySelector(".advanced-mode-option") as HTMLElement).style.display = "none";
                }
            } else if (Settings.getSettings.showBasicInSelection && Settings.getSettings.showAdvancedInSelection) {
                (document.querySelector(".basic-mode-option") as HTMLElement).style.display = "";
                (document.querySelector(".advanced-mode-option") as HTMLElement).style.display = "";
            }

            if (Settings.getSettings.showBasicInSelection && !Settings.getSettings.showAdvancedInSelection) {
                (document.querySelector(".basic-mode-option") as HTMLElement).style.display = "";

                (document.querySelector(".advanced-mode-option") as HTMLElement).style.display = "none";
            } else if (Settings.getSettings.showAdvancedInSelection && !Settings.getSettings.showBasicInSelection) {
                (document.querySelector(".advanced-mode-option") as HTMLElement).style.display = "";

                (document.querySelector(".basic-mode-option") as HTMLElement).style.display = "none";
            }

            //load mode
            if (Settings.getSettings.basicMode) {
                console.log("basic mode active");

                if ((document.getElementById("app") as HTMLElement).classList.contains("advanced-mode-is-active")) {
                    (document.getElementById("app") as HTMLElement).classList.remove("advanced-mode-is-active");
                }

                (document.getElementById("app") as HTMLElement).classList.add("basic-mode-is-active");
                //advanced mode
            } else if (Settings.getSettings.advancedMode) {
                console.log("advanced mode active");

                if ((document.getElementById("app") as HTMLElement).classList.contains("basic-mode-is-active")) {
                    (document.getElementById("app") as HTMLElement).classList.remove("basic-mode-is-active");
                }

                (document.getElementById("app") as HTMLElement).classList.add("advanced-mode-is-active");

                //check block cursor
                if (Settings.getSettings.defaultCursor && Settings.getSettings.lightTheme) {
                    AdvancedModeSettings.defaultCursor("light");
                } else if (Settings.getSettings.defaultCursor && Settings.getSettings.darkTheme) {
                    AdvancedModeSettings.defaultCursor("dark");
                } else if (
                    (Settings.getSettings.blockCursor && Settings.getSettings.lightTheme) ||
                    (Settings.getSettings.blockCursor && Settings.getSettings.darkTheme)
                ) {
                    AdvancedModeSettings.blockCursor();
                }
            } else if (Settings.getSettings.readingMode) {
                console.log("reading mode active");

                if ((document.getElementById("app") as HTMLElement).classList.contains("basic-mode-is-active")) {
                    (document.getElementById("app") as HTMLElement).classList.remove("basic-mode-is-active");
                } else if (
                    (document.getElementById("app") as HTMLElement).classList.contains("advanced-mode-is-active")
                ) {
                    (document.getElementById("app") as HTMLElement).classList.remove("advanced-mode-is-active");
                }

                (document.getElementById("app") as HTMLElement).classList.add("reading-mode-is-active");
            }
        }

        /**
         * Attach window event
         *
         * @private
         */
        private attachWindowEvent(): void {
            GenericEvent.use.createDisposableEvent(window, "DOMContentLoaded", () => {
                this.coupleNs();
                this.loadTheme();
                this.loadMode();
            });
        }

        /**
         * Initialize renderer
         *
         * @public
         */
        public initializeRenderer(): void {
            this.attachWindowEvent();
        }
    }

    /**
     * Renderer object
     */
    export const execute: Renderer = new Renderer();
}

createApp();
RendererProcess.execute.initializeRenderer();
invokeListeners();
