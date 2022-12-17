/*
* file: `app.ts`
*
* this file contains the creation of the app div within the DOM
*
* there shouldn't be any major changes to this file besides implementing more efficient mounting methods
*
*/

import './styles/override.css'

//App class
class App {
    public appDivFn() {
        const appDiv = document.createElement('div') as HTMLDivElement;
        appDiv.setAttribute("id", "app");

        return document.body.prepend(appDiv) as void;
    }
}

//appMain function
function appMain(): void {
    const app = new App();

    app.appDivFn();
}
appMain();