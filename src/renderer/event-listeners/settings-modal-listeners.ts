import { SettingsModal } from "../settings/settings-modal";
import { Settings, EditorThemes } from "../settings/settings";
import { fsMod } from "../../utils/alias";
import { GenericEvent } from "./event";
import { KeyBinds } from "../keybinds/keybinds";

/**
 * @extends SettingsModal
 */
export class SettingsModalListeners extends SettingsModal {
    /**
     * Theme select callback
     *
     * @public
     */
    public themeSelectCb: (e: Event) => void = (e: Event): void => {
        const currentSelection = e.currentTarget as HTMLSelectElement;

        if ((document.querySelector(".editor-dark-theme") as HTMLElement) !== null) {
            document.querySelectorAll(".editor-dark-theme").forEach((el) => {
                el.remove();
            });
        }

        //if selection is light theme
        if (currentSelection.value === "editor-light") {
            //log
            console.log("selected editor light");

            (document.querySelector(".dark-option") as HTMLElement).removeAttribute("selected");

            (document.querySelector(".light-option") as HTMLElement).setAttribute("selected", "");

            EditorThemes.lightTheme();

            Settings.getSettings.lightTheme = true;
            Settings.getSettings.darkTheme = false;

            if (!Settings.getSettings.lightTheme) {
                fsMod.fs._writeToFileAlt(
                    fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                    JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                );
            } else {
                fsMod.fs._writeToFileAlt(
                    fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                    JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                );
            }
        } else if (currentSelection.value === "editor-dark") {
            (document.querySelector(".light-option") as HTMLElement).removeAttribute("selected");
            (document.querySelector(".dark-option") as HTMLElement).setAttribute("selected", "");

            EditorThemes.darkTheme();

            Settings.getSettings.lightTheme = false;
            Settings.getSettings.darkTheme = true;

            if (!Settings.getSettings.darkTheme) {
                fsMod.fs._writeToFileAlt(
                    fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                    JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                );
            } else {
                fsMod.fs._writeToFileAlt(
                    fsMod.fs._baseDir("home") + "/Iris/.settings.json",
                    JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2)
                );
            }
        }
    };

    /**
     * Theme settings listener
     *
     * @private
     */
    private themeSettingsListener(): void {
        if (
            (document.querySelector(".light-option") as HTMLElement).hasAttribute("selected") &&
            (document.querySelector(".editor-dark-theme") as HTMLElement) !== null
        ) {
            //remove dark stylesheet node
            document.querySelectorAll(".editor-dark-theme").forEach((el) => {
                el.remove();
            });

            document.querySelectorAll(".highlight-dark-theme").forEach((el) => {
                el.remove();
            });
        } else {
            GenericEvent.use.createDisposableEvent(
                document.getElementById("theme-select") as HTMLElement,
                "change",
                this.themeSelectCb,
                undefined,
                "Create disposable event for theme select (change)"
            );
        }
    }

    /**
     * Settings modal exit callback
     *
     * @public
     */
    public settingsModalExitCb: () => void = (): void => {
        SettingsModal.settingsModalContainerNode.remove();

        GenericEvent.use.setEventCallbackTimeout(() => {
            //dispose theme select cb
            GenericEvent.use.disposeEvent(
                document.body,
                "change",
                this.themeSelectCb,
                undefined,
                "Disposed event for theme select (change)"
            );

            //dispose settings modal exit cb
            GenericEvent.use.disposeEvent(
                SettingsModal.settingsModalExitButton,
                "click",
                this.settingsModalExitCb,
                undefined,
                "Disposed event for settings modal exit (click)"
            );

            //dispose bind cb
            GenericEvent.use.disposeEvent(
                window,
                "keydown",
                KeyBinds.map.bindCb,
                undefined,
                "Disposed event for bind (keydown escape)"
            );
        }, 150);

        //reset map list
        KeyBinds.map.resetMapList();
    };

    /**
     * Settings modal exit listener
     */
    public settingsModalExitListener(): void {
        KeyBinds.map.bind(this.settingsModalExitCb, "Escape", true);

        GenericEvent.use.createDisposableEvent(
            SettingsModal.settingsModalExitButton,
            "click",
            this.settingsModalExitCb,
            undefined,
            "Created disposable event for settings modal exit (click)"
        );
    }

    /**
     * Settings modal callback
     *
     * @public
     */
    public settingsModalCb: () => void = (): void => {
        console.log("clicked settings node");

        GenericEvent.use.setEventCallbackTimeout(() => {
            //create settings modal container
            this.settingsModalContainer();

            //theme settings listener
            this.themeSettingsListener();

            //invoke settings modal exit listener
            this.settingsModalExitListener();

            //dispose settings modal cb
            GenericEvent.use.disposeEvent(
                document.getElementById("settings-node") as HTMLElement,
                "click",
                () => GenericEvent.use.setEventCallbackTimeout(this.settingsModalCb, 50),
                undefined,
                "Disposed event for settings modal (click)"
            );
        }, 50);
    };

    /**
     * Settings modal listener
     */
    public settingsModalListener(): void {
        GenericEvent.use.createDisposableEvent(
            document.getElementById("settings-node") as HTMLElement,
            "click",
            () => GenericEvent.use.setEventCallbackTimeout(this.settingsModalCb, 50),
            undefined,
            "Create disposable event for settings modal (click)"
        );
    }
}
