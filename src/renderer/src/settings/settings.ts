import { fsMod } from "../utils/alias"
//https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
//https://vitejs.dev/guide/assets.html#importing-asset-as-url
//?inline: to prevent auto injection
//?url: get url of named import
import editorDark from '../../assets/editor-dark.css?inline?url'
import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { CMEditorState } from "../codemirror/editor/cm-editor-state"
import { cursors } from "../codemirror/extensions/cursors"

/**
 * Theme interface 
 */
interface IThemeInterface<T extends boolean> {
    lightTheme: T,
    darkTheme: T
}

/**
 * Mode interface
 */
interface IModeInterface<T extends boolean> {
    basicMode: T,
    advancedMode: T
}

interface IAdvancedModeInterface<T extends boolean> {
    defaultCursor: T,
    blockCursor: T
}

export class Settings {    
    /**
     * Parse theme settings
     * 
     * @returns JSON object of Iris settings
     */
    static parseThemeSettings(): IThemeInterface<boolean> {
        const irisSettings: string = fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/.iris-settings.json")
        const parseIrisSettings: IThemeInterface<boolean> = JSON.parse(irisSettings);

        //log
        console.log(parseIrisSettings);
        //log
        console.log(typeof parseIrisSettings);

        return parseIrisSettings;
    }

    /**
     * Parse dot settings 
     * 
     * @returns JSON object of Iris dot settings
     */
    static parseDotSettings(): IModeInterface<boolean> {
        const modeSettings: string = fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json");
        const parseDotSettings: IModeInterface<boolean> = JSON.parse(modeSettings);

        //log
        console.log(parseDotSettings);

        //log
        console.log(typeof parseDotSettings);

        return parseDotSettings;
    }

    static parseAdvancedModeSettings(): IAdvancedModeInterface<boolean> {
        const advancedModeSettings: string = fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/.iris-advanced-editor-dot-settings.json");
        const parseAdvancedModeSettings: IAdvancedModeInterface<boolean> = JSON.parse(advancedModeSettings);

        console.log(parseAdvancedModeSettings);
        
        return parseAdvancedModeSettings;
    }
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