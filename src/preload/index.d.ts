import { ElectronAPI } from '@electron-toolkit/preload'

//global type declaration for Window and preload API's
declare global {
    interface Window {
        electron: ElectronAPI
        fsMod: {
            _baseDir(base: string): string,
            _getName(dir: string): string,
            _getDirectoryName(dir: string): string,
            _getNameVec(dir: string): string[],
            _getCanonicalPath(dir: string): string,
            _isFile(baseDir: string, dir: string): boolean,
            _isDirectory(baseDir: string, dir: string): boolean,
            _isFileCanonical(canonicalPath: string): boolean,
            _isDirectoryCanonical(canonicalPath: string): boolean,
            _readFile(dir: string): string,
            _walk(dir: string): string[],
            _walkNoExt(dir: string): string[],
            _readFileRoot(file: string): string,
            _readFileFolder(folder: string, file: string): string
        }
    }
}
