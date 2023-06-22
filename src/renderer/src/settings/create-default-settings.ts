import irisSettings from './iris-default-settings.json'
import { fsMod } from '../../../preload/mod/fs-mod'

/**
 * Create default settings
 */
export function createDefaultSettings(): void {
    fsMod._createFile(fsMod._baseDir("home") + "/Iris/iris-settings.json", JSON.stringify(irisSettings));
}