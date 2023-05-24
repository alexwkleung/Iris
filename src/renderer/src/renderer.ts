import { directoryNs } from '../directory'
import { EditorNs } from '../editor'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', async () => {
        directoryNs.directory();
        await EditorNs.editor();
  });
}
initRenderer();

//log test
//console.log(window.fsMod._baseDir("home"));