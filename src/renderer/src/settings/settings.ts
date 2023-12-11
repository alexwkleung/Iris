import { fsMod } from "../utils/alias"
//https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
//https://vitejs.dev/guide/assets.html#importing-asset-as-url
//?inline: to prevent auto injection
//?url: get url of named import
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { CMEditorState } from "../codemirror/editor/cm-editor-state"
import { cursors } from "../codemirror/extensions/cursors"

import editorDark from '../../assets/editor-dark.css?inline?url'
import highlightDark from '../../assets/classic-dark.min.css?inline?url'

/**
 * Settings interface
 */
interface ISettingsData<T extends boolean> {
    "lightTheme": T,
    "darkTheme": T,
    "basicMode": T,
    "advancedMode": T,
    "readingMode": T,
    "defaultCursor": T,
    "blockCursor": T
}

type TSettings = ISettingsData<boolean>;

export class Settings {    
    /**
     * Get local settings
     * 
     * @static
     * @readonly
     */
    static readonly getSettings: TSettings = JSON.parse(fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/.settings.json"))
}

export class EditorThemes {
    /**
     * Dark theme
     * 
     * @static
     */
    static darkTheme(): void {
        const linkNode: HTMLLinkElement = document.createElement('link');
        linkNode.setAttribute("rel", "stylesheet");
        linkNode.setAttribute("href", editorDark);
        linkNode.setAttribute("class", "editor-dark-theme");
        document.body.appendChild(linkNode);

        const highlightDarkTheme: HTMLLinkElement = document.createElement('link');
        highlightDarkTheme.setAttribute("rel", "stylesheet");
        highlightDarkTheme.setAttribute("href", highlightDark);
        highlightDarkTheme.setAttribute("class", "highlight-dark-theme");
        document.body.appendChild(highlightDarkTheme);
    }   
}

export class AdvancedModeSettings {
    static defaultCursor(theme: string): void {
        if(theme === "light") {
            CMEditorView.editorView.dispatch({
                effects: CMEditorState.cursorCompartment.reconfigure(cursors[0])
            })
        } else if(theme === "dark") {
            CMEditorView.editorView.dispatch({
                effects: CMEditorState.cursorCompartment.reconfigure(cursors[1])
            })
        }
    }

    static blockCursor(): void {
        CMEditorView.editorView.dispatch({
            effects: CMEditorState.cursorCompartment.reconfigure(cursors[2])
        })
    }
}