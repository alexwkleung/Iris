import { fsMod } from "../utils/alias"
//https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
//https://vitejs.dev/guide/assets.html#importing-asset-as-url
//?inline: to prevent auto injection
//?url: get url of named import
import editorDark from '../../assets/editor-dark.css?inline?url'

export class Settings {
    static themeSettings(): any {
        const irisSettings: string = fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/iris-settings.json")
        const parseIrisSettings: any = JSON.parse(JSON.stringify(irisSettings));
        
        return parseIrisSettings;
    }
}

export class EditorThemes {
    static darkTheme(): void {
        const linkNode: HTMLLinkElement = document.createElement('link');
        linkNode.setAttribute("rel", "stylesheet");
        linkNode.setAttribute("href", editorDark);
        linkNode.setAttribute("class", "editor-dark-theme");
        document.body.appendChild(linkNode);
    }
    
}