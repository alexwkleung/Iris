import { directory } from '../directory'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', () => {
        directory();
  });
}

initRenderer();

console.log(window.fsMod._baseDir("home"));
