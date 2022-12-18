/*
* file: `app.ts`
*
* this file contains the creation of the app div within the DOM
*
* there shouldn't be any major changes to this file besides implementing more efficient mounting methods
*
*/

import './styles/override.css'
import './styles/mainwindow.css'

//App class
class App {
    public appDivFn() {
        const appDiv = document.createElement('div') as HTMLDivElement;
        appDiv.setAttribute("id", "app");

        document.body.prepend(appDiv) as void;

        //check if app div node is connected
        if(appDiv.isConnected) {
            console.log("App is connected to the DOM!");
        } else {
            console.error("App is not connected to the DOM!");
        }
    }
}

//appMain function
function appMain(): void {
    const app = new App() as App;

    app.appDivFn();
}
appMain();

export const app = document.querySelector('#app') as HTMLElement;