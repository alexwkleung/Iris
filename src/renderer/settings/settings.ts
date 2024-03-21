import { fsMod } from "../../utils/alias";
import editorDark from "../../assets/editor-dark.css?inline?url";
import githubLight from "../../assets/github-light-highlight.css?inline?url";
import githubDark from "../../assets/github-dark-highlight.css?inline?url";

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
    static lightTheme(): void {
        const highlightLight: HTMLLinkElement = document.createElement("link");
        highlightLight.setAttribute("rel", "stylesheet");
        highlightLight.setAttribute("href", githubLight);
        highlightLight.setAttribute("class", "highlight-light-theme");
        document.body.appendChild(highlightLight);
    }

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

        const highlightDark: HTMLLinkElement = document.createElement("link");
        highlightDark.setAttribute("rel", "stylesheet");
        highlightDark.setAttribute("href", githubDark);
        highlightDark.setAttribute("class", "highlight-dark-theme");
        document.body.appendChild(highlightDark);
    }
}
