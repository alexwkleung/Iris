/*
* file: `app.ts`
*
* this file contains the function that creates/appends the app div within the DOM
*
*/

function app() {
    const appDiv = document.createElement('div');
    appDiv.setAttribute("id", "app");

    document.body.appendChild(appDiv);
}
app();