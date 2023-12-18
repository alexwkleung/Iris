import { app } from 'electron'

/**
 * Check if platform is macOS 
 *  
 * @returns `true` if platform is macOS, `false` otherwise
 */
export function isMacOS(): boolean {
    let bool: boolean = false;

    process.platform === 'darwin' ? bool = true : bool = false;

    return bool;
}

/**
* Check if platform is Windows
* 
* @returns `true` if platform is Windows, `false` otherwise
*/
export function isWindows(): boolean {
    let bool: boolean = false;

    process.platform === 'win32' ? bool = true : bool = false;

    return bool;
}

/**
* Check if platform is Linux
* 
* @returns `true` if platform is Linux, `false` otherwise
*/
export function isLinux(): boolean {
    let bool: boolean = false;
    
    process.platform === 'linux' ? bool = true : bool = false;

    return bool;
}

/**
* Check if Electron is in dev
* 
* @returns `true` or `false` if app is packaged
*/
export function isDev(): boolean {
    return !app.isPackaged ? true : false;
}