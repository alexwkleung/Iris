import { App } from "../../app"
import { fsMod } from "./alias"

export function isModeBasic(): boolean {
    let isActive: boolean = false;

    if(App.appNode.classList.contains('basic-mode-is-active')) {
        isActive = true;
    } else if(!App.appNode.classList.contains('basic-mode-is-active')) {
        isActive = false;
    }

    return isActive;
}

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