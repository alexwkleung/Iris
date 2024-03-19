import { setWindowTitle } from "./window/window-title";
import prosemirror from "../assets/prosemirror.css?inline?url";

import "../assets/default-fonts/Inter-Bold.ttf";
import "../assets/default-fonts/Inter-Regular.ttf";
import "../assets/default-fonts/Inter-Medium.ttf";

export class App {
    /**
     * App node
     *
     * Reference variable for app node
     */
    public static appNode: HTMLDivElement;

    public static pmStylesheet(): void {
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

            if (!isConnected) {
                throw console.error("App node is not connected");
            } else {
                console.log("App node is connected");
            }
        } else {
            App.appNode = document.createElement("div") as HTMLDivElement;
            App.appNode.setAttribute("id", "app");

            App.appNode.classList.add("default-mode-is-active");

            document.body.insertBefore(App.appNode, document.body.firstChild);

            const isConnected: boolean = App.appNode.isConnected;

            if (!isConnected) {
                throw console.error("App node is not connected");
            } else {
                console.log("App node is connected");
            }
        }
    }
}

export function createApp(): void {
    document.addEventListener("DOMContentLoaded", () => {
        App.app();

        App.pmStylesheet();
    });
}
