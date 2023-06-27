import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { fsMod } from './mod/fs-mod'
import { createDefaultSettings, createDefaultDotSettings, createDefaultAdvancedModeSettings } from '../renderer/src/settings/create-default-settings'

function appStartDirectoryCheck(): void {
  if(
    !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris") 
    && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Notes") 
    ) {
      console.log("directories don't exist");

      //create iris directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris");

      //create notes directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris/Notes");

      //create default settings
      createDefaultSettings();

      //create default dot settings 
      createDefaultDotSettings();

      //create default advanced mode settings
      createDefaultAdvancedModeSettings();
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