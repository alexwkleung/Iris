import { fsMod } from "../../utils/alias";
import editorDark from "../../assets/editor-dark.css?inline?url";

/**
 * Settings interface
 */
interface ISettingsData<T extends boolean> {
    lightTheme: T;
    darkTheme: T;
}

type TSettings = ISettingsData<boolean>;

export class Settings {
    /**
     * Get local settings
     *
     * @static
     * @readonly
     */
    static readonly getSettings: TSettings = JSON.parse(
        fsMod.fs._readFile(fsMod.fs._baseDir("home") + "/Iris/.settings.json")
    );
}

export class EditorThemes {
    /**
     * Dark theme
     *
     * @static
     */
    static darkTheme(): void {
        const linkNode: HTMLLinkElement = document.createElement("link");
        linkNode.setAttribute("rel", "stylesheet");
        linkNode.setAttribute("href", editorDark);
        linkNode.setAttribute("class", "editor-dark-theme");
        document.body.appendChild(linkNode);
    }
}
