/*
* file: `app.ts`
*
* this file contains the creation of the app node in the DOM
*
*/

import { appWindow, PhysicalSize, /* LogicalSize */ } from '@tauri-apps/api/window'

//stylesheets
import './styles/override.css'
import './styles/mainwindow.css'
import './styles/material.css'
import './styles/katex.min.css'

/**
 * @class App
 * 
 * @file `app.ts`
 */
export class App {
    //appNode ref
    /**
     * app node container variable 
     * 
     * @member static
     * @returns HTMLDivElement
     */
    static appNodeContainer: HTMLDivElement;

    //app node
    /**
     * App node function
     * 
     * Appends app node to the DOM.
     * 
     * @member static
     * @returns void
     */
    static appNode(): void {
        App.appNodeContainer = document.createElement('div') as HTMLDivElement;
        App.appNodeContainer.setAttribute("id", "app");

        document.body.prepend(App.appNodeContainer) as void;

        const isConnected: boolean = App.appNodeContainer.isConnected;

        //check if app node is connected
        if(isConnected) {
            //console.log("App is connected to the DOM!");
            return;
        } else {
            throw console.error("App is not connected to the DOM!");
        }
    }
}

/**
 * @function app. 
 * 
 * 1) Calls `App.appNode`
 * 2) Set WebviewWindow config using `appWindow`
 * 
 * @async function
 * @returns Promise<void\>
 */
async function app(): Promise<void> {
    App.appNode();

    //set min window size
    await appWindow.setMinSize(new PhysicalSize(1200, 800));

    //set max window size 
    //await appWindow.setMaxSize(new LogicalSize(1200, 800));

    //disable resizable window
    await appWindow.setResizable(true);

    //set default app title on startup 
    return await appWindow.setTitle("Iris");
}
app();