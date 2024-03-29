import { setWindowTitle } from "./window/window-title";
import prosemirror from "../assets/prosemirror.css?inline?url";
import highlightLight from "../assets/classic-light.min.css?inline?url";

import "../assets/default-fonts/Inter-Bold.ttf";
import "../assets/default-fonts/Inter-Regular.ttf";
import "../assets/default-fonts/Inter-Medium.ttf";

import "../assets/katex.min.css";

export class App {
    /**
     * App node
     *
     * Reference variable for app node
     */
    public static appNode: HTMLDivElement;

    public static async app(): Promise<void> {
        //set window title
        await setWindowTitle("Iris", false, null).catch((e) => {
            throw console.error(e);
        });

        //check if any app nodes exist in document
        if (document.querySelector("#app")) {
            //remove the app node
            (document.querySelector("#app") as HTMLDivElement).remove();

            //create app node
            App.appNode = document.createElement("div") as HTMLDivElement;
            App.appNode.setAttribute("id", "app");
            document.body.prepend(App.appNode);

            const isConnected: boolean = App.appNode.isConnected;

            //check if app node is connected
            if (isConnected) {
                //console.log("App node is connected");
                return;
            } else if (!isConnected) {
                throw console.error("App node is not connected");
            }
        } else {
            App.appNode = document.createElement("div") as HTMLDivElement;
            App.appNode.setAttribute("id", "app");

            //default mode
            App.appNode.classList.add("basic-mode-is-active");

            //use insertBefore instead of prepend
            document.body.insertBefore(App.appNode, document.body.firstChild);

            const isConnected: boolean = App.appNode.isConnected;

            //check if app node is connected
            if (isConnected) {
                //console.log("App node is connected");
                return;
            } else if (!isConnected) {
                throw console.error("App node is not connected");
            }
        }
    }

    static pmStylesheet(): void {
        //remove any duplicate pm stylesheets in dom
        document.querySelectorAll(".pm-stylesheet").forEach((el) => {
            if (el !== null) {
                el.remove();
            }
        });

        const pmStylesheet: HTMLLinkElement = document.createElement("link");
        pmStylesheet.setAttribute("rel", "stylesheet");
        pmStylesheet.setAttribute("href", prosemirror);
        pmStylesheet.setAttribute("class", "pm-stylesheet");
        document.body.appendChild(pmStylesheet);
    }

    static highlightLightTheme(): void {
        if ((document.querySelector(".highlight-light-theme") as HTMLElement) !== null) {
            document.querySelectorAll(".highlight-light-theme").forEach((el) => {
                el.remove();
            });
        }

        const highlightTheme: HTMLLinkElement = document.createElement("link");
        highlightTheme.setAttribute("rel", "stylesheet");
        highlightTheme.setAttribute("href", highlightLight);
        highlightTheme.setAttribute("class", "highlight-light-theme");
        document.body.appendChild(highlightTheme);
    }
}

export function createApp(): void {
    document.addEventListener("DOMContentLoaded", () => {
        //call app
        App.app();

        //prosemirror stylesheet
        App.pmStylesheet();

        App.highlightLightTheme();
    });
}
