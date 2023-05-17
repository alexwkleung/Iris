export class App {
    static appNode: HTMLDivElement = document.createElement('div') as HTMLDivElement;

    static async app() {
        //check if any app nodes exist in document
        if(document.querySelector('#app')) {
            //remove the app node
            document.querySelector('#app').remove();

            //create app node
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
    
            document.body.prepend(App.appNode);
    
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

function createApp() {
    //call app
    App.app();
}
createApp();