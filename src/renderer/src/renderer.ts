import { directoryNs } from '../directory-main'
import { EditorNs } from '../editor-main'
import { windowNs } from './window/draggable-area'
import { Settings, EditorThemes } from '../src/settings/settings'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', () => {     
        //draggable area
        windowNs.draggableArea();

        //directory
        directoryNs.directory();

        //editor
        EditorNs.editor();

        //load themes
        if(Settings.parseThemeSettings().lightTheme) {
          //if dark theme exists in dom
          if((document.querySelector('.editor-dark-theme') as HTMLElement) !== null) {
            //remove stylesheet node
            document.querySelectorAll('.editor-dark-theme').forEach((el) => {
              el.remove();
            })
          }
        //dark theme
        } else if(Settings.parseThemeSettings().darkTheme) {
          EditorThemes.darkTheme();
        }
  });
}
initRenderer();

//log test
console.log(window.fsMod._getDirectoryName("/Users/alex/Iris"));