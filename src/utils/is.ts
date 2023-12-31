import { App } from "../renderer/app";
import { fsMod } from "./alias";

/**
 * Is mode advanced
 *
 * check if the mode is advanced
 *
 * @returns `true` or `false`
 */
export function isModeAdvanced(): boolean {
    let isActive: boolean = false;

    if (App.appNode.classList.contains("advanced-mode-is-active")) {
        isActive = true;
    } else if (!App.appNode.classList.contains("advanced-mode-is-active")) {
        isActive = false;
    }

    return isActive;
}

/**
 * Is mode reading
 *
 * Check if the mode is reading
 *
 * @returns `true` or `false`
 */
export function isModeReading(): boolean {
    let isActive: boolean = false;

    if (App.appNode.classList.contains("reading-mode-is-active")) {
        isActive = true;
    } else if (!App.appNode.classList.contains("reading-mode-is-active")) {
        isActive = false;
    }

    return isActive;
}

/**
 *
 * @param baseDir Base directory
 * @param dirPropName Directory property name
 * @returns Boolean
 */
export function isFolderNode(baseDir: string, dirPropName: string): boolean {
    return fsMod.fs._isDirectory(baseDir, dirPropName);
}
