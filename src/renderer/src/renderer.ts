import { directoryNs } from '../directory-main'
import { EditorNs } from '../editor-main'
import { windowNs } from './window/draggable-area'
import { Settings, EditorThemes } from '../src/settings/settings'
import { AdvancedModeSettings } from '../src/settings/settings'

export function initRenderer(): void {
    window.addEventListener('DOMContentLoaded', () => {     
        //draggable area
        windowNs.draggableArea();

        //directory
        directoryNs.directory();

        //editor
        EditorNs.editor();

        //log
        console.log(Settings.parseThemeSettings());

        //load themes
        if(Settings.parseThemeSettings().lightTheme) {
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
        //dark theme
        } else if(Settings.parseThemeSettings().darkTheme) {
          EditorThemes.darkTheme();
        }

        if(Settings.parseThemeSettings().darkTheme) {
          document.querySelectorAll('.highlight-light-theme').forEach((el) => {
            el.remove();
          })
        }
        
        //log
        console.log(Settings.parseDotSettings());

        //load mode
        if(Settings.parseDotSettings().basicMode) {
          if((document.getElementById('app') as HTMLElement).classList.contains('advanced-mode-is-active')) {
            (document.getElementById('app') as HTMLElement).classList.remove('advanced-mode-is-active');
          } 

          (document.getElementById('app') as HTMLElement).classList.add('basic-mode-is-active');
        //advanced mode
        } else if(Settings.parseDotSettings().advancedMode) {
          if((document.getElementById('app') as HTMLElement).classList.contains('basic-mode-is-active')) {
            (document.getElementById('app') as HTMLElement).classList.remove('basic-mode-is-active');
          } 

          (document.getElementById('app') as HTMLElement).classList.add('advanced-mode-is-active');

          //check block cursor
          if(Settings.parseAdvancedModeSettings().defaultCursor && Settings.parseThemeSettings().lightTheme) {
            AdvancedModeSettings.defaultCursor("light");
          } else if(Settings.parseAdvancedModeSettings().defaultCursor && Settings.parseThemeSettings().darkTheme) {
            AdvancedModeSettings.defaultCursor("dark");
          } else if(
            Settings.parseAdvancedModeSettings().blockCursor && Settings.parseThemeSettings().lightTheme 
            || Settings.parseAdvancedModeSettings().blockCursor && Settings.parseThemeSettings().darkTheme
          ) {
            AdvancedModeSettings.blockCursor();
          }
        } else if(Settings.parseDotSettings().readingMode) {
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