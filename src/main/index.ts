import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
//import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      //...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
  });

  //set min window size 
  mainWindow.setMinimumSize(1200, 800);

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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});