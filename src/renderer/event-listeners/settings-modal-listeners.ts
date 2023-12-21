import { SettingsModal } from "../settings/settings-modal"
import { Settings, EditorThemes } from "../settings/settings"
import { fsMod } from "../utils/alias"
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { CMEditorState } from "../codemirror/editor/cm-editor-state"
import { cursors } from "../codemirror/extensions/cursors"
import { AdvancedModeSettings } from "../settings/settings"
import { GenericEvent } from "./event"
import { KeyBinds } from "../keybinds/keybinds"

import highlightLight from '../../assets/classic-light.min.css?inline?url'

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
            console.log("selected editor light");

            (document.querySelector('.dark-option') as HTMLElement).removeAttribute("selected");

            (document.querySelector('.light-option') as HTMLElement).setAttribute("selected", "");

            //check highlight light
            if((document.querySelector('.highlight-light-theme') as HTMLElement) !== null) {
                document.querySelectorAll('.highlight-light-theme').forEach((el) => {
                    el.remove();
                })
            }

            //check highlight dark
            if((document.querySelector('.highlight-dark-theme') as HTMLElement) !== null) {
                document.querySelectorAll('.highlight-dark-theme').forEach((el) => {
                    el.remove();
                })
            }
                    
            const highlightTheme: HTMLLinkElement = document.createElement('link');
            highlightTheme.setAttribute("rel", "stylesheet");
            highlightTheme.setAttribute("href", highlightLight);
            highlightTheme.setAttribute("class", "highlight-light-theme");
            document.body.appendChild(highlightTheme);

            Settings.getSettings.lightTheme = true;
            Settings.getSettings.darkTheme = false;

            if(!Settings.getSettings.lightTheme) {
                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            } else {                        
                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            }

            //check mode
            if(Settings.getSettings.basicMode) {
                CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) })
            } else if(Settings.getSettings.advancedMode) {
                CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) })
            }

            //check block cursor
            if(Settings.getSettings.defaultCursor && Settings.getSettings.lightTheme) {
                AdvancedModeSettings.defaultCursor("light");
            } else if(Settings.getSettings.defaultCursor && Settings.getSettings.darkTheme) {
                AdvancedModeSettings.defaultCursor("dark");
            } else if(Settings.getSettings.blockCursor && Settings.getSettings.lightTheme || Settings.getSettings.blockCursor && Settings.getSettings.darkTheme) {
                AdvancedModeSettings.blockCursor();
            }
        //if selection is dark theme
        } else if(currentSelection.value === 'editor-dark') {
            //log
            console.log("selected editor dark");

            (document.querySelector('.light-option') as HTMLElement).removeAttribute("selected");

            (document.querySelector('.dark-option') as HTMLElement).setAttribute("selected", "");

            //check highlight light
            if((document.querySelector('.highlight-light-theme') as HTMLElement) !== null) {
                document.querySelectorAll('.highlight-light-theme').forEach((el) => {
                    el.remove();
                })
            }

            //check highlight dark
            if((document.querySelector('.highlight-dark-theme') as HTMLElement) !== null) {
                document.querySelectorAll('.highlight-dark-theme').forEach((el) => {
                    el.remove();
                })
            }

            //apply dark theme
            EditorThemes.darkTheme();

            Settings.getSettings.lightTheme = false;
            Settings.getSettings.darkTheme = true;

            if(!Settings.getSettings.darkTheme) {
                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            } else {
                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            }

            //check mode 
            if(Settings.getSettings.basicMode) {
                CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]) })
            } else if(Settings.getSettings.advancedMode) {
                CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]) })
            }

            //check block cursor
            if(Settings.getSettings.defaultCursor && Settings.getSettings.lightTheme) {
                AdvancedModeSettings.defaultCursor("light");
            } else if(Settings.getSettings.defaultCursor && Settings.getSettings.darkTheme) {
                AdvancedModeSettings.defaultCursor("dark");
            } else if(Settings.getSettings.blockCursor && Settings.getSettings.lightTheme || Settings.getSettings.darkTheme && Settings.getSettings.darkTheme) {
                AdvancedModeSettings.blockCursor();
            }
        }
    }

    /**
     * Cursor settings callback
     * 
     * @public
     */
    public cursorSettingsCb: (e: Event) => void = (e: Event): void => {
        const currentSelection: HTMLSelectElement = (e.currentTarget as HTMLSelectElement);
        
        //if current selection is default-cursor and theme is light
        if(currentSelection.value === 'default-cursor' && Settings.getSettings.lightTheme) {
            //log
            console.log("selected default cursor and theme is light");
            
            (document.querySelector('.block-cursor-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.default-cursor-option') as HTMLElement).setAttribute("selected", "");

            Settings.getSettings.defaultCursor = true;
            Settings.getSettings.blockCursor = false;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            //dispatch cursor compartment reconfiguration
            CMEditorView.editorView.dispatch({
                effects: CMEditorState.cursorCompartment.reconfigure(cursors[0])
            })
        //if current selection is default-cursor and theme is dark 
        } else if(currentSelection.value === 'default-cursor' && Settings.getSettings.darkTheme) {
            //log
            console.log("selected default cursor and theme is dark");

            (document.querySelector('.block-cursor-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.default-cursor-option') as HTMLElement).setAttribute("selected", "");

            Settings.getSettings.defaultCursor = true;
            Settings.getSettings.blockCursor = false;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            CMEditorView.editorView.dispatch({
                effects: CMEditorState.cursorCompartment.reconfigure(cursors[1])
            })
        //if current selection is block-cursor
        } else if(currentSelection.value === 'block-cursor') {
            //log
            console.log("selected block cursor");

            (document.querySelector('.default-cursor-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.block-cursor-option') as HTMLElement).setAttribute("selected", "");

            Settings.getSettings.defaultCursor = false;
            Settings.getSettings.blockCursor = true;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            CMEditorView.editorView.dispatch({
                effects: CMEditorState.cursorCompartment.reconfigure(cursors[2])
            })
        }
    }

    /**
     * Theme settings listener
     * 
     * @private
     */
    private themeSettingsListener(): void {
        if((document.querySelector('.light-option') as HTMLElement).hasAttribute("selected") && (document.querySelector('.editor-dark-theme') as HTMLElement) !== null) {
            //remove dark stylesheet node
            document.querySelectorAll('.editor-dark-theme').forEach((el) => {
                el.remove();
            });

            return;
        } else {
            GenericEvent.use.createDisposableEvent((document.getElementById("theme-select") as HTMLElement), 'change', this.themeSelectCb, undefined, "Create disposable event for theme select (change)");
        }
    }

    /**
     * Cursor settings listener
     * 
     * @private
     */
    private cursorSettingsListener(): void {
        GenericEvent.use.createDisposableEvent((document.getElementById('advanced-mode-options-select') as HTMLElement), 'change', this.cursorSettingsCb, undefined, "Created disposable event for cursor settings (change)");
    }

    /**
     * Basic mode dropdown settings callback
     * 
     * @param e Event
     * 
     * @private
     */
    private basicModeDropdownSettingsCb: (e: Event) => void = (e: Event): void => {
        const currentSelection: HTMLSelectElement = (e.currentTarget as HTMLSelectElement);

        if(currentSelection.value === 'basic-mode-toggle-true') {
            console.log("basic mode toggle true");

            (document.querySelector('.basic-mode-toggle-false-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.basic-mode-toggle-true-option') as HTMLElement).setAttribute("selected", "");
            
            (document.querySelector('.basic-mode-option') as HTMLElement).style.display = "";

            Settings.getSettings.showBasicInSelection = true;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            if(!Settings.getSettings.basicMode && Settings.getSettings.showBasicInSelection) {
                Settings.getSettings.basicMode = true;
                Settings.getSettings.advancedMode = false;
                
                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            }
        } else if(currentSelection.value === 'basic-mode-toggle-false') {
            console.log("basic mode toggle false");

            (document.querySelector('.basic-mode-toggle-true-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.basic-mode-toggle-false-option') as HTMLElement).setAttribute("selected", "");
            
            (document.querySelector('.basic-mode-option') as HTMLElement).style.display = "none";

            Settings.getSettings.showBasicInSelection = false;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            if(!Settings.getSettings.advancedMode && Settings.getSettings.showAdvancedInSelection) {
                Settings.getSettings.basicMode = false;
                Settings.getSettings.advancedMode = true;

                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            }
        }

        if(Settings.getSettings.readingMode) {
            Settings.getSettings.basicMode = false;
            Settings.getSettings.advancedMode = false;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
        }
    }

    /**
     * Advanced mode dropdown settings callback
     * 
     * @param e Event
     * 
     * @private
     */
    private advancedModeDropdownSettingsCb: (e: Event) => void = (e: Event): void => {
        const currentSelection: HTMLSelectElement = (e.currentTarget as HTMLSelectElement);

        if(currentSelection.value === 'advanced-mode-toggle-true') {
            console.log("advanced mode toggle true");

            (document.querySelector('.advanced-mode-toggle-false-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.advanced-mode-toggle-true-option') as HTMLElement).setAttribute("selected", "");

            (document.querySelector('.advanced-mode-option') as HTMLElement).style.display = "";

            Settings.getSettings.showAdvancedInSelection = true;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            if(!Settings.getSettings.advancedMode && Settings.getSettings.showAdvancedInSelection) {
                Settings.getSettings.basicMode = false;
                Settings.getSettings.advancedMode = true;

                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            }
        } else if(currentSelection.value === 'advanced-mode-toggle-false') {
            console.log("advanced mode toggle false");

            (document.querySelector('.advanced-mode-toggle-true-option') as HTMLElement).removeAttribute("selected");
            (document.querySelector('.advanced-mode-toggle-false-option') as HTMLElement).setAttribute("selected", "");

            (document.querySelector('.advanced-mode-option') as HTMLElement).style.display = "none";

            Settings.getSettings.showAdvancedInSelection = false;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));

            if(!Settings.getSettings.basicMode && Settings.getSettings.showBasicInSelection) {
                Settings.getSettings.basicMode = true;
                Settings.getSettings.advancedMode = false;
                
                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
            }
        }

        if(Settings.getSettings.readingMode) {
            Settings.getSettings.basicMode = false;
            Settings.getSettings.advancedMode = false;

            fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.settings.json", JSON.stringify(JSON.parse(JSON.stringify(Settings.getSettings, null, 2)), null, 2));
        }
    }

    /**
     * Mode dropdown settings listener
     * 
     * @private
     */
    private modeDropdownSettingsListener(): void {
        GenericEvent.use.createDisposableEvent((document.getElementById('basic-mode-toggle-options-select') as HTMLElement), 'change', this.basicModeDropdownSettingsCb, undefined, "Create disposable event for basic mode select (change)");

        GenericEvent.use.createDisposableEvent((document.getElementById('advanced-mode-toggle-options-select') as HTMLElement), 'change', this.advancedModeDropdownSettingsCb, undefined, "Create disposable event for advanced mode select (change)");
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
            GenericEvent.use.disposeEvent(document.body, 'change', this.themeSelectCb, undefined, "Disposed event for theme select (change)");

            //dispose cursor settings cb
            GenericEvent.use.disposeEvent(document.body, 'change', this.cursorSettingsCb, undefined, "Disposed event for cursor settings (change)");
            
            GenericEvent.use.disposeEvent(document.body, 'change', this.basicModeDropdownSettingsCb, undefined, "Disposed event for basic mode dropdown settings (change)");
            
            GenericEvent.use.disposeEvent(document.body, 'change', this.advancedModeDropdownSettingsCb, undefined, "Disposed event for advanced mode dropdown settings (change)");

            //dispose settings modal exit cb
            GenericEvent.use.disposeEvent(SettingsModal.settingsModalExitButton, 'click', this.settingsModalExitCb, undefined, "Disposed event for settings modal exit (click)");

            //dispose bind cb
            GenericEvent.use.disposeEvent(window, 'keydown', KeyBinds.map.bindCb, undefined, "Disposed event for bind (keydown escape)");
        }, 150)

        //reset map list
        KeyBinds.map.resetMapList();
    }

    /**
     * Settings modal exit listener
     */
    public settingsModalExitListener(): void {
        KeyBinds.map.bind(this.settingsModalExitCb, 'Escape', true);

        GenericEvent.use.createDisposableEvent(SettingsModal.settingsModalExitButton, 'click', this.settingsModalExitCb, undefined, "Created disposable event for settings modal exit (click)");
    }

    /**
     * Settings modal callback
     * 
     * @public
     */
    public settingsModalCb: () => void = (): void => {
        console.log("clicked settings node");

        GenericEvent.use.setEventCallbackTimeout(
            () => {
                //create settings modal container
                this.settingsModalContainer();
        
                //theme settings listener
                this.themeSettingsListener();
                
                //cursor settings listener
                this.cursorSettingsListener();
                
                //mode dropdown settings listener
                this.modeDropdownSettingsListener();

                //invoke settings modal exit listener
                this.settingsModalExitListener();

                //dispose settings modal cb
                GenericEvent.use.disposeEvent((document.getElementById("settings-node") as HTMLElement), 'click', () => GenericEvent.use.setEventCallbackTimeout(this.settingsModalCb, 50), undefined, "Disposed event for settings modal (click)");
            }, 50
        )
    }


    /**
     * Settings modal listener
     */
    public settingsModalListener(): void {
        GenericEvent.use.createDisposableEvent((document.getElementById("settings-node") as HTMLElement), 'click', () => GenericEvent.use.setEventCallbackTimeout(this.settingsModalCb, 50), undefined, "Create disposable event for settings modal (click)");
    }
}