/*
* file: `main.ts`
*
* this file will call all exported functions necessary to run Iris. 
*
* the main function(s) can be split into multiple to avoid wrapping
* the function calls into one single function
*/

function mainFnCalls(): void {
    const app = document.querySelector('#app') as HTMLElement;
    const h1 = document.createElement('h1');
    const text = document.createTextNode("Hello World");
    h1.appendChild(text);
    app.appendChild(h1);
}
mainFnCalls();