import { fsMod } from '../../../preload/mod/fs-mod'
import irisSettings from './.iris-default-settings.json'
import irisDotSettings from './.iris-default-dot-settings.json'
import irisAdvancedModeDotSettings from './.iris-default-advanced-editor-dot-settings.json'

interface ISettingFiles<T, K> {
    createSettingFile(type: T): K
}

class SettingFiles implements ISettingFiles<any, void> {
    /**
     * Create default settings
     */
    private createDefaultSettings(): void {
        fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-settings.json", JSON.stringify(irisSettings));
    }

    /**
     * Create dot settings
     */
    private createDefaultDotSettings(): void {
        fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-dot-settings.json", JSON.stringify(irisDotSettings));
    }

    /**
     * Create default advanced mode settings
     */
    private createDefaultAdvancedModeSettings(): void {
        fsMod._createFile(fsMod._baseDir("home") + "/Iris/.iris-advanced-editor-dot-settings.json", JSON.stringify(irisAdvancedModeDotSettings));
    }

    /**
     * Create default setting file 
     * 
     * @param type The type of setting file to create (`default`, `dot`, `advanced`)
     */
    public createSettingFile(type: string): void {
        switch(type) {
            case 'default':
                this.createDefaultSettings();
                break;
            case 'dot':
                this.createDefaultDotSettings();
                break;
            case 'advanced':
                this.createDefaultAdvancedModeSettings();
                break;
        } 
    }
}

export const settingFiles = new SettingFiles();