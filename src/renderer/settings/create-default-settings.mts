import { fsMod } from '../../preload/mod/fs-mod.mjs'
import settings from './.settings.json' assert { type: 'json' }

interface ISettingFiles<T, K> {
    createSettingFile(type: T): K
}

class SettingFiles implements ISettingFiles<any, void> {
    /**
     * Create default settings
     */
    private createDefaultSettings(): void {
        fsMod._createFile(fsMod._baseDir("home") + "/Iris/.settings.json", JSON.stringify(settings, null, 2));
    }

    /**
     * Create default setting file 
     * 
     * @param type The type of setting file to create (`default`)
     */
    public createSettingFile(type: string): void {
        switch(type) {
            case 'default':
                this.createDefaultSettings();
                break;
        } 
    }
}

export const settingFiles = new SettingFiles();