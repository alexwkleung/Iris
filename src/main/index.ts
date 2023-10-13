import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import contextMenu from 'electron-context-menu'
//import icon from '../../resources/icon.png?asset'
import { isMacOS, isWindows, isLinux, isDev } from './is-main'
import windowStateKeeper from 'electron-window-state'

//prevent multiple instances of Iris running
if(!app.requestSingleInstanceLock()) {
  console.log("Another instance of Iris is running. Exiting.");

  app.quit();
}

function createWindow(): void {
  //esm version of __dirname 
  const _dirname: string = dirname(fileURLToPath(import.meta.url));

  //isomorphic version of __dirname for both cjs/esm compatibility (https://antfu.me/posts/isomorphic-dirname)
  //const _dirname: string = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));

  //create window state keeper
  const windowState: windowStateKeeper.State = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 900,
  })

  let mainWindow: BrowserWindow = {} as BrowserWindow;

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: isMacOS() ? 'hiddenInset' : 'default', //only check macOS
    webPreferences: {
      preload: join(_dirname, '../preload/index.js'),
      sandbox: false,
      spellcheck: false
    }
  });

  //register windowState listener
  windowState.manage(mainWindow);

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
  mainWindow.setMinimumSize(800, 600);

  //for now, use electron-context-menu and extend it if necessary.
  //later on, I will implement my own custom context menu so it can be
  //fine-tuned based on the needs of Iris
  contextMenu();

  mainWindow.on('ready-to-show', () => {
      mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { 
        action: 'deny' 
      }
  });

  if(isDev()) {
      //load dev server url in main window
      mainWindow.loadURL('http://localhost:5173/');

      //open dev tools undocked by default
      mainWindow.webContents.openDevTools({
        mode: 'undocked'
      });
  } else {
      //this is supposed to be production build
      //path might change once electron-vite is removed
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
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