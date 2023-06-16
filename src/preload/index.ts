import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { fsMod } from './mod/fs-mod'

function appStartDirectoryCheck(): void {
  if(!fsMod._isPathDir(fsMod._baseDir("home") + "/Iris") && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Basic")) {
      console.log("directories don't exist");

      //create iris directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris");

      //create basic directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris/Basic");

      //create advanced directory

      //create default settings file
    }
}
appStartDirectoryCheck();

if(process.contextIsolated) {
  try {
    //expose electron 
    contextBridge.exposeInMainWorld('electron', electronAPI)
      
    //expose fsMod
    contextBridge.exposeInMainWorld('fsMod', fsMod)
  } catch(e) {
      throw console.error(e);
  }
} else {
    //eslint-disable-next-line
    //@ts-ignore
    window.electron = electronAPI

    //eslint-disable-next-line
    //@ts-ignore
    window.fsMod = fsMod
}