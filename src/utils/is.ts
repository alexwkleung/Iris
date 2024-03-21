import { App } from "../renderer/app";
import { fsMod } from "./alias";

export function isDefaultMode(): boolean {
    let isActive: boolean = false;

    if (App.appNode.classList.contains("default-mode-is-active")) {
        isActive = true;
    } else if (!App.appNode.classList.contains("default-mode-is-active")) {
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
