import irisSettings from './iris-settings.json'

export function createSettings(): void {
    console.log(JSON.stringify(irisSettings, null, 4));
}