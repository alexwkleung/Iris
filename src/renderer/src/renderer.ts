import { directoryNs } from '../directory'
import { EditorNs } from '../editor'
import { windowNs } from './window/draggable-area'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', async () => {
        //draggable area
        windowNs.draggableArea();

        //directory
        directoryNs.directory();

        //editor
        await EditorNs.editor();
  });
}
initRenderer();

//log test
console.log(window.fsMod._getDirectoryName("/Users/alex/Iris"));