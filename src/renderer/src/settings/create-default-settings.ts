import irisSettings from './iris-settings.json'
import { fsMod } from '../../../preload/mod/fs-mod'

export function createDefaultSettings(): void {
    fsMod._createFile(fsMod._baseDir("home") + "/Iris/iris-settings.json", JSON.stringify(irisSettings, null, 4));
}