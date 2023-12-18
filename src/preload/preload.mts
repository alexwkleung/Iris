import { contextBridge } from 'electron'
import { electronAPI } from './electron/electron.mjs'
import { fsMod } from './mod/fs-mod.mjs'
import { settingFiles } from '../renderer/settings/create-default-settings.mjs'

namespace PreloadProcess {
  class PreloadScripts {
    /**
     * App start directory check
     * 
     * @private
     */
    private appStartDirectoryCheck(): void {
      if(!fsMod._isPathDir(fsMod._baseDir("home") + "/Iris") && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Notes") && !fsMod._isPathDir(fsMod._baseDir("home") + "/Iris/Images")) {
          console.log("directories don't exist");
    
          //create iris directory
          fsMod._createDir(fsMod._baseDir("home") + "/Iris");
    
          //create notes directory
          fsMod._createDir(fsMod._baseDir("home") + "/Iris/Notes");
    
          //create images directory
          fsMod._createDir(fsMod._baseDir("home") + "/Iris/Images");
    
          //create default settings
          settingFiles.createSettingFile('default');
        }
    }

    /**
     * Context isolation
     * 
     * @private
     */
    private contextIsolation(): void {
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
    }

    /**
     * Preload scripts
     * 
     * @public
     */
    public preloadScripts(): void {
      this.appStartDirectoryCheck();
      this.contextIsolation();
    }
  }

  /**
   * PreloadScripts object
   */
  export const execute: PreloadScripts = new PreloadScripts();
}

//execute preload scripts
PreloadProcess.execute.preloadScripts();