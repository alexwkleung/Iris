import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { 
    baseDir, 
    getName, 
    getDirectoryName, 
    getNameVec, 
    getCanonicalPath, 
    isFile, 
    isDirectory, 
    isFileCanonical, 
    isDirectoryCanonical, 
    readFile, 
    walk, 
    walkNoExt 
} from 'fs-mod'

//fsMod API
const fsMod = {
    _baseDir(base: string): string {
        return baseDir(base);
    },
    _getName(dir: string): string {
        return getName(dir);
    },
    _getDirectoryName(dir: string): string {
        return getDirectoryName(dir);
    }, 
    _getNameVec(dir: string): string[] {
        return getNameVec(dir);
    },
    _getCanonicalPath(dir: string): string {
        return getCanonicalPath(dir);
    },
    _isFile(baseDir: string, fileDir: string): boolean {
        return isFile(baseDir, fileDir);
    },
    _isDirectory(baseDir: string, dir: string): boolean {
        return isDirectory(baseDir, dir);
    },
    _isFileCanonical(canonicalPath: string): boolean {
        return isFileCanonical(canonicalPath);
    },
    _isDirectoryCanonical(canonicalPath: string): boolean {
        return isDirectoryCanonical(canonicalPath);
    },
    _readFile(dir: string): string {
        return readFile(dir);
    },
    _walk(dir: string): string[] {
        return walk(dir);
    },
    _walkNoExt(dir: string): string[] {
        return walkNoExt(dir);
    },
    _readFileRoot(file: string): string {
        return readFile(baseDir("home") + "/Iris/Notes/" + file);
    },
    _readFileFolder(folder: string, file: string): string {
        return readFile(baseDir("home") + "/Iris/Notes/"+ folder + "/" + file);
    }
}

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