import { App } from "../../app"
import { fsMod } from "./alias"

/**
 * Is mode basic 
 * 
 * Check if the mode is basic 
 * 
 * @returns `true` or `false`
 */
export function isModeBasic(): boolean {
    let isActive: boolean = false;

    if(App.appNode.classList.contains('basic-mode-is-active')) {
        isActive = true;
    } else if(!App.appNode.classList.contains('basic-mode-is-active')) {
        isActive = false;
    }

    return isActive;
}

/**
 * Is mode advanced 
 * 
 * check if the mode is advanced 
 * 
 * @returns `true` or `false`
 */
export function isModeAdvanced(): boolean {
    let isActive: boolean = false;

    if(App.appNode.classList.contains('advanced-mode-is-active')) {
        isActive = true;
    } else if(!App.appNode.classList.contains('advanced-mode-is-active')) {
        isActive = false;
    }

    return isActive;
}

export function isFolderNode(baseDir: string, dirPropName: string): boolean {
    return fsMod.fs._isDirectory(baseDir, dirPropName);
}