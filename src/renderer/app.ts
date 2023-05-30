import { setWindowTitle } from "./src/utils/window-title"

export class App {
    /**
     * App node
     * 
     * Reference variable for app node
     */
    public static appNode: HTMLDivElement;

    public static app(): void {
        //set window title
        setWindowTitle("Iris", false, null);

        //check if any app nodes exist in document
        if(document.querySelector('#app')) {
            //remove the app node
            (document.querySelector('#app') as HTMLDivElement).remove();

            //create app node
            App.appNode = document.createElement('div') as HTMLDivElement;
            App.appNode.setAttribute("id", "app");
            document.body.prepend(App.appNode);
            
            const isConnected: boolean = App.appNode.isConnected;
    
            //check if app node is connected
            if(isConnected) {
                //console.log("App node is connected");
                return;
            } else if(!isConnected) {
                throw console.error("App node is not connected");
            }
        } else {
            App.appNode = document.createElement('div') as HTMLDivElement;
            App.appNode.setAttribute("id", "app");
    
            //use insertBefore instead of prepend
            document.body.insertBefore(App.appNode, document.body.firstChild);
    
            const isConnected: boolean = App.appNode.isConnected;
    
            //check if app node is connected
            if(isConnected) {
                //console.log("App node is connected");
                return;
            } else if(!isConnected) {
                throw console.error("App node is not connected");
            }
        }
    }
}

function createApp(): void {
    //call app
    App.app();
}
createApp();