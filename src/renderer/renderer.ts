import { directoryNs } from "./directory-main";
import { EditorNs } from "./editor-main";
import { windowNs } from "./window/draggable-area";
import { Settings, EditorThemes } from "./settings/settings";
import { GenericEvent } from "./event-listeners/event";
import { createApp } from "./app";
import { invokeListeners } from "./listener-main";

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
                EditorThemes.lightTheme();
                //dark theme
            } else if (Settings.getSettings.darkTheme) {
                if ((document.querySelector(".highlight-light-theme") as HTMLElement) !== null) {
                    document.querySelectorAll(".highlight-light-theme").forEach((el) => {
                        el.remove();
                    });
                }
                EditorThemes.darkTheme();
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
            });
        }

        /**
         * Initialize renderer
         *
         * @public
         */
        public initializeRenderer(): void {
            createApp();
            this.attachWindowEvent();
            invokeListeners();
        }
    }

    /**
     * Renderer object
     */
    export const execute: Renderer = new Renderer();
}

RendererProcess.execute.initializeRenderer();
