import { fsMod } from "../utils/alias"
//https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
//https://vitejs.dev/guide/assets.html#importing-asset-as-url
//?inline: to prevent auto injection
//?url: get url of named import
import editorDark from '../../assets/editor-dark.css?inline?url'

/**
 * Theme interface 
 */
interface IThemeInterface<T extends boolean> {
    lightTheme: T,
    darkTheme: T
}

export class Settings {    
    /**
     * Parse theme settings
     * 
     * @returns JSON object of Iris settings
     */
    static parseThemeSettings(): IThemeInterface<boolean> {
        const irisSettings: string = fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/iris-settings.json")
        const parseIrisSettings: IThemeInterface<boolean> = JSON.parse(irisSettings);

        //log
        console.log(parseIrisSettings);
        //log
        console.log(typeof parseIrisSettings);

        return parseIrisSettings;
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