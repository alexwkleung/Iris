import { directoryNs } from '../directory-main'
import { EditorNs } from '../editor-main'
import { windowNs } from './window/draggable-area'
import { Settings, EditorThemes } from '../src/settings/settings'
import { AdvancedModeSettings } from '../src/settings/settings'
import mermaid from 'mermaid'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', () => {     
        //draggable area
        windowNs.draggableArea();

        //directory
        directoryNs.directory();

        //editor
        EditorNs.editor();

        //load themes
        if(Settings.getSettings.lightTheme) {
          //if dark theme exists in dom
          if((document.querySelector('.editor-dark-theme') as HTMLElement) !== null) {
            //remove stylesheet node
            document.querySelectorAll('.editor-dark-theme').forEach((el) => {
              el.remove();
            })

            document.querySelectorAll('.highlight-dark-theme').forEach((el) => {
              el.remove();
            })
          }

          //initialize mermaid
          mermaid.initialize({
            theme: 'forest'
          })
        //dark theme
        } else if(Settings.getSettings.darkTheme) {
          EditorThemes.darkTheme();
        }

        if(Settings.getSettings.darkTheme) {
          document.querySelectorAll('.highlight-light-theme').forEach((el) => {
            el.remove();
          })

          //initialize mermaid
          mermaid.initialize({
            theme: 'forest'
          })
        }
        
        //log
        //console.log(Settings.parseDotSettings());

        //load mode
        if(Settings.getSettings.basicMode) {
          console.log("basic mode active");

          if((document.getElementById('app') as HTMLElement).classList.contains('advanced-mode-is-active')) {
            (document.getElementById('app') as HTMLElement).classList.remove('advanced-mode-is-active');
          } 

          (document.getElementById('app') as HTMLElement).classList.add('basic-mode-is-active');
        //advanced mode
        } else if(Settings.getSettings.advancedMode) {
          console.log("advanced mode active");

          if((document.getElementById('app') as HTMLElement).classList.contains('basic-mode-is-active')) {
            (document.getElementById('app') as HTMLElement).classList.remove('basic-mode-is-active');
          } 

          (document.getElementById('app') as HTMLElement).classList.add('advanced-mode-is-active');

          //check block cursor
          if(Settings.getSettings.defaultCursor && Settings.getSettings.lightTheme) {
            AdvancedModeSettings.defaultCursor("light");
          } else if(Settings.getSettings.defaultCursor && Settings.getSettings.darkTheme) {
            AdvancedModeSettings.defaultCursor("dark");
          } else if(
            Settings.getSettings.blockCursor && Settings.getSettings.lightTheme
            || Settings.getSettings.blockCursor && Settings.getSettings.darkTheme
          ) {
            AdvancedModeSettings.blockCursor();
          }
        } else if(Settings.getSettings.readingMode) {
          console.log("reading mode active");

          if((document.getElementById('app') as HTMLElement).classList.contains('basic-mode-is-active')) {
            (document.getElementById('app') as HTMLElement).classList.remove('basic-mode-is-active');
          } else if((document.getElementById('app') as HTMLElement).classList.contains('advanced-mode-is-active')) {
            (document.getElementById('app') as HTMLElement).classList.remove('advanced-mode-is-active');
          }

          (document.getElementById('app') as HTMLElement).classList.add('reading-mode-is-active');
        }
  });
}
initRenderer();

//log test
console.log(window.fsMod._getDirectoryName("/Users/alex/Iris"));