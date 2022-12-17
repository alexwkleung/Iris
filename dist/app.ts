/*
* file: `app.ts`
*
* this file contains the creation of the app div within the DOM
*
*/

import './styles/override.css'

//App class
class App {
    static appDivFn() {
        const appDiv = document.createElement('div') as HTMLDivElement;
        appDiv.setAttribute("id", "app");

        return document.body.prepend(appDiv) as void;
    }
}

//appMain function
function appMain(): void {
    App.appDivFn();
}
appMain();