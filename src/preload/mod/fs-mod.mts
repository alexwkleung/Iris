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
    walkNoExt,
    writeToFile,
    createFile,
    createDir,
    isPathDir,
    isPathFile,
    deletePath,
    renameFile,
} from "fs-mod";

//fsMod API
export const fsMod = {
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
        console.log(baseDir("home") + "/Iris/Notes/" + folder + "/" + file);

        return readFile(baseDir("home") + "/Iris/Notes/" + folder + "/" + file);
    },
    _writeToFile(path: string, content: string): void {
        return writeToFile(baseDir("home") + "/Iris/Notes/" + path, content);
    },
    _writeToFileAlt(path: string, content: string): void {
        return writeToFile(path, content);
    },
    _createFile(path: string, content: string): void {
        return createFile(path, content);
    },
    _createDir(path: string): void {
        return createDir(path);
    },
    _isPathDir(path: string): boolean {
        return isPathDir(path);
    },
    _isPathFile(path: string): boolean {
        return isPathFile(path);
    },
    _deletePath(path: string): void {
        return deletePath(path);
    },
    _renameFile(oldPath: string, newPath: string): void {
        return renameFile(oldPath, newPath);
    },
};
