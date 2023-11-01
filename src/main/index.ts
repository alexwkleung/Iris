import { app, shell, BrowserWindow, protocol, net, ipcMain, dialog } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import contextMenu from 'electron-context-menu'
//import icon from '../../resources/icon.png?asset'
import { isMacOS, isWindows, isLinux, isDev } from './is-main'
import windowStateKeeper from 'electron-window-state'

namespace MainProcess {
  class AppWindow {
    /**
     * Browser window 
     * 
     * @protected
     */
    protected mainWindow: BrowserWindow = {} as BrowserWindow;

    /**
     * Window state
     * 
     * @private
     */
    private windowState: windowStateKeeper.State = {} as windowStateKeeper.State;

    /**
     * App instance 
     *  
     * @private
     */
    private appInstance(): void {
      //prevent multiple instances of Iris running
      if(!app.requestSingleInstanceLock()) {
        console.log("Another instance of Iris is running. Exiting.");

        dialog.showErrorBox("Iris", "Another instance of Iris is running. Closing current instance.");

        app.quit();
      }
    }

    /**
     * ipcMain handlers
     *  
     * @private
     */
    private ipcMainHandlers(): void {
      ipcMain.handle('error-dialog', (_: Electron.IpcMainInvokeEvent, title: string, content: string) => {
        dialog.showErrorBox(title, content);
      })

      ipcMain.handle('show-message-box', (_: Electron.IpcMainInvokeEvent, message: string) => {
        dialog.showMessageBox(this.mainWindow, {
          message: message
        })
      })
    }

    /**
     * Call this after registering `windowState` listener
     * 
     * @internal
     * @private
     */
    private mainProcLogger(): void {
      console.log("Current window dimensions: " + this.windowState.width + "x" + this.windowState.height);
      console.log("Current window coordinates: " + "(" + this.windowState.x + ", " + this.windowState.y + ")");
    }

    /**
     * Initialize main window
     * 
     * @private
     */
    private initializeMainWindow(): void {
      //esm version of __dirname 
      const _dirname: string = dirname(fileURLToPath(import.meta.url));
    
      //isomorphic version of __dirname for both cjs/esm compatibility (https://antfu.me/posts/isomorphic-dirname)
      //const _dirname: string = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));
    
      this.windowState = windowStateKeeper({
        defaultWidth: 1200,
        defaultHeight: 900,
      });

      this.mainWindow = new BrowserWindow({
        width: this.windowState.width,
        height: this.windowState.height,
        x: this.windowState.x,
        y: this.windowState.y,
        minWidth: 800,
        minHeight: 600,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: isMacOS() ? 'hiddenInset' : 'default', //only check macOS
        webPreferences: {
          preload: join(_dirname, '../preload/index.js'),
          sandbox: false,
          contextIsolation: true,
          webviewTag: false,
          spellcheck: false
        }
      });
    
      //register windowState listener
      this.windowState.manage(this.mainWindow);
    
      //main process logger
      this.mainProcLogger();

      //check if platform is darwin
      if(isMacOS()) {
          //log
          console.log("Platform is darwin (macOS)");
        //check if platform is linux
      } else if(isLinux()) {
          //log
          console.log("Platform is Linux");
        //check if platform is windows
      } else if(isWindows()) {
          //log
          console.log("Platform is Windows");
      }
    
      //set min window size 
      this.mainWindow.setMinimumSize(800, 600);
    
      //for now, use electron-context-menu and extend it if necessary.
      //later on, I will implement my own custom context menu so it can be
      //fine-tuned based on the needs of Iris
      contextMenu();
    
      this.mainWindow.on('ready-to-show', () => {
          this.mainWindow.show();
      });
    
      this.mainWindow.webContents.setWindowOpenHandler((details) => {
          shell.openExternal(details.url)
          return { 
            action: 'deny' 
          }
      });
    
      if(isDev()) {
          //load dev server url in main window
          this.mainWindow.loadURL('http://localhost:5173/');
    
          //open dev tools undocked by default
          this.mainWindow.webContents.openDevTools({
            mode: 'undocked'
          });
      } else {
          //this is supposed to be production build
          //path might change once electron-vite is removed
          this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
      }
    }

    /**
     * Initialize Electron app
     * 
     * @private
     */
    private initializeElectronApp(): void {
      app.whenReady().then(() => {
        //initialize main window
        this.initializeMainWindow();
      
        app.on('activate', () => {
          if(BrowserWindow.getAllWindows().length === 0) {
              this.initializeMainWindow();
            }
        });
      
        //custom protocol to handle local file system absolute paths
        protocol.handle('local', (request): Promise<Response> => {
          return net.fetch('file://' + request.url.slice('local://'.length)).catch((e) => console.error(e)) as Promise<Response> 
        })
      });
      
      app.on('window-all-closed', () => {
        if(isLinux() || isWindows()) {
          app.quit();
        } else if(isMacOS()) {
          return;
        }
      });
    }

    /**
     * Build main window
     * 
     * @public
     */
    public buildMainWindow(): void {
      this.appInstance();
      this.ipcMainHandlers();
      this.initializeElectronApp();
    }
  }

  //AppWindow object
  export const ElectronWindow: AppWindow = new AppWindow();
}

//build window
MainProcess.ElectronWindow.buildMainWindow();

