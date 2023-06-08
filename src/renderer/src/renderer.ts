import { directoryNs } from '../directory-main'
import { EditorNs } from '../editor-main'
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