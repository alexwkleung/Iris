import { contextBridge } from 'electron'
import { electronAPI } from '../preload/electron/electron'
import { fsMod } from './mod/fs-mod'
import { settingFiles } from '../renderer/src/settings/create-default-settings'

function appStartDirectoryCheck(): void {
  if(
    !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris") 
    && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Notes") 
    && !fsMod._isPathDir(fsMod._baseDir("home") + "/Images")
    ) {
      console.log("directories don't exist");

      //create iris directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris");

      //create notes directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris/Notes");

      //create images directory
      fsMod._createDir(fsMod._baseDir("home") + "/Images");

      //create default settings
      settingFiles.createSettingFile('default');
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