/*
* file: `app.ts`
*
* this file contains the creation of the app node
*
* there shouldn't be any major changes to this file besides implementing more efficient mounting methods
*
*/

import { appWindow } from '@tauri-apps/api/window'

//stylesheets
import './styles/override.css'
import './styles/mainwindow.css'
import './styles/material.css'
import './styles/katex.min.css'

//App class
export class App {
    static appNode: HTMLDivElement;

    static appDivFn() {
        App.appNode = document.createElement('div') as HTMLDivElement;
        App.appNode.setAttribute("id", "app");

        document.body.prepend(App.appNode) as void;

        //check if app node is connected
        if(App.appNode.isConnected) {
            console.log("App is connected to the DOM!");
        } else {
            console.error("App is not connected to the DOM!");
        }
    }
}

//appMain function
async function appMain() {
    const app = new App() as App;

    App.appDivFn();

    //set default app title on startup 
    await appWindow.setTitle("Eva-dev-build");
}
appMain();
