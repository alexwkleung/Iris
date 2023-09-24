import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import contextMenu from 'electron-context-menu'
//import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  //esm version of __dirname 
  const _dirname: string = dirname(fileURLToPath(import.meta.url));

  //isomorphic version of __dirname for both cjs/esm compatibility (https://antfu.me/posts/isomorphic-dirname)
  //const _dirname: string = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));

  let mainWindow: BrowserWindow = {} as BrowserWindow;

  //check if platform is darwin
  if(process.platform === 'darwin') {
      //log
      console.log("Platform is darwin (macOS)");

      mainWindow = new BrowserWindow({
          width: 1200,
          height: 750,
          show: false,
          autoHideMenuBar: true,
          titleBarStyle: 'hiddenInset',
          webPreferences: {
          preload: join(_dirname, '../preload/index.js'),
          sandbox: false
        }
    });
    //check if platform is linux
  } else if(process.platform === 'linux') {
      //log
      console.log("Platform is Linux");

      mainWindow = new BrowserWindow({
        width: 1200,
        height: 750,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: 'default',
        //...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
        preload: join(_dirname, '../preload/index.js'),
        sandbox: false
      }
    });
    //check if platform is windows
  } else if(process.platform === 'win32') {
      //log
      console.log("Platform is Windows");

      mainWindow = new BrowserWindow({
          width: 1200,
          height: 750,
          show: false,
          autoHideMenuBar: true,
          titleBarStyle: 'default',
          webPreferences: {
          preload: join(_dirname, '../preload/index.js'),
          sandbox: false
        }
    });
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

  if(is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
  });

  //custom protocol to handle local file system absolute paths
  protocol.handle('image', (request): Promise<Response> => {
    return net.fetch('file://' + request.url.slice('image://'.length)).catch((e) => console.error(e)) as Promise<Response> 
  })
});

app.on('window-all-closed', () => {
  if(process.platform === 'linux' || process.platform === 'win32') {
    app.quit();
  } else if(process.platform === 'darwin') {
    return;
  }
});