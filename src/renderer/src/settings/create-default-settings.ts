import { fsMod } from '../../../preload/mod/fs-mod'
import irisSettings from './.iris-default-settings.json'
import irisDotSettings from './.iris-default-dot-settings.json'
import irisAdvancedModeDotSettings from './.iris-default-advanced-editor-dot-settings.json'

/**
 * Create default settings
 */
export function createDefaultSettings(): void {
    fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-settings.json", JSON.stringify(irisSettings));
}

/**
 * Create dot settings
 */
export function createDefaultDotSettings(): void {
    fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-dot-settings.json", JSON.stringify(irisDotSettings));
}

/**
 * Create default advanced mode settings
 */
export function createDefaultAdvancedModeSettings(): void {
    fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-advanced-editor-dot-settings.json", JSON.stringify(irisAdvancedModeDotSettings));
}

/*
export function createDefaultStartupDotSettings(): void {
    fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-startup-dot-settings.json", JSON.stringify(irisStartupDotSettings));
}
*/