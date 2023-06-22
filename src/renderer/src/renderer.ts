import { directoryNs } from '../directory-main'
import { EditorNs } from '../editor-main'
import { windowNs } from './window/draggable-area'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', () => {     
        //draggable area
        windowNs.draggableArea();

        //directory
        directoryNs.directory();

        //editor
        EditorNs.editor();

        //load theme here?
  });
}
initRenderer();

//log test
console.log(window.fsMod._getDirectoryName("/Users/alex/Iris"));