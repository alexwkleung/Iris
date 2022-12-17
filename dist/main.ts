/*
* file: `main.ts`
*
* this file will call imported functions necessary to run Iris. 
*
* the majority of functions will be contained within classes
* 
*/

//import { ProseMirrorEditorDiv } from './editor/editor'
//import { ProseMirrorView } from './editor/editor'
import { MainObjects } from './utils/main-objects'

//temporary styles
import './styles/menubar.css'
import './styles/style.css'
import './styles/prosemirror.css'

/*
interface FnTypes {
    helloWorld(): HTMLHeadingElement;
    byeWorld(): HTMLHeadingElement;
}

class MainFns implements FnTypes {
    helloWorld() {
        const app = document.querySelector('#app') as HTMLElement;
        const h1 = document.createElement('h1') as HTMLHeadingElement;
        const text = (document.createTextNode("Hello World") as Text);
        h1.appendChild(text) as Text;
    
       return app.appendChild(h1) as HTMLHeadingElement;
    }

    byeWorld() {
        const app = document.querySelector('#app') as HTMLElement;
        const h1 = document.createElement('h2') as HTMLHeadingElement;
        const text = (document.createTextNode("Bye World") as Text);
        h1.appendChild(text) as Text;
    
       return app.appendChild(h1) as HTMLHeadingElement;
    }
}

mainFns object
const mainFnsObj = new MainFns() as MainFns;
*/

function objectFns(): void {
    MainObjects.PMEditorDiv.editorDivFn();

    MainObjects.PMEditorView.PMView();

    //mainFnsObj.helloWorld();
    //mainFnsObj.byeWorld();
}   
objectFns();
