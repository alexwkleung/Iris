import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { fsMod } from './mod/fs-mod'
import { createDefaultSettings, createDefaultDotSettings } from '../renderer/src/settings/create-default-settings'

function appStartDirectoryCheck(): void {
  if(
    !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris") 
    && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Basic") 
    /* && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Advanced") */ 
    ) {
      console.log("directories don't exist");

      //create iris directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris");

      //create basic directory
      fsMod._createDir(fsMod._baseDir("home") + "/Iris/Basic");

      //create advanced directory

      //create default settings
      createDefaultSettings();

      //create default dot settings 
      createDefaultDotSettings();
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