import { directory } from '../directory'
import { editor } from '../editor'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', async () => {
        directory();
        await editor();
  });
}
initRenderer();

//log test
//console.log(window.fsMod._baseDir("home"));