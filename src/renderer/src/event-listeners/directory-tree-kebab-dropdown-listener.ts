import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { fsMod } from "../utils/alias"
import { Settings } from "../settings/settings"
interface IEditorModeJSONRef<T extends string> {
    updatedSettings: T
}

const editorModeJSONRef: IEditorModeJSONRef<string> = {
    updatedSettings: JSON.stringify(Settings.parseDotSettings())
}

export class DirectoryTreeKebabDropdownListeners {
    public kebabDropdownButtonListener(): void {
        (document.getElementById("file-directory-kebab-dropdown-menu-container") as HTMLElement).addEventListener('click', () => {
            //toggle is-active class
            (document.getElementById('file-directory-kebab-after-click-menu-container') as HTMLElement).classList.toggle('is-active');
            
            //check if file-directory-kebab-after-click-menu-container contains is-active class
            if((document.getElementById('file-directory-kebab-after-click-menu-container') as HTMLElement).classList.contains('is-active')) {
                //show menu container
                (document.getElementById('file-directory-kebab-after-click-menu-container') as HTMLElement).style.display = "";
            } else {
                //hide menu container
                (document.getElementById('file-directory-kebab-after-click-menu-container') as HTMLElement).style.display = "none";
            }
        });

        //hide file directory kebab after click menu container when file directory tree container inner region is clicked
        (document.getElementById("file-directory-tree-container-inner") as HTMLElement).addEventListener('click', () => {
            (document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement).style.display = "none";
        })
    }    

    public kebabDropdownSelectListener(): void {
        (document.getElementById("editor-mode-select") as HTMLElement).addEventListener('change', (e) => {
            e.stopImmediatePropagation();

            const currentSelection = (e.target as HTMLSelectElement);
            
            if(currentSelection.value === 'basic-mode') {
                //check if app node contains advanced-mode-is-active class
                if((document.getElementById('app') as HTMLElement).classList.contains('advanced-mode-is-active')) {
                    //remove it
                    (document.getElementById('app') as HTMLElement).classList.remove('advanced-mode-is-active');    
                }

                //add basic-mode-is-active class 
                (document.getElementById('app') as HTMLElement).classList.add('basic-mode-is-active');

                if(document.querySelector('.cm-editor') as HTMLElement !== null) {
                    CMEditorView.editorView.destroy();
                    //(document.querySelector('.cm-editor') as HTMLElement).remove();
                }

                PMEditorView.createEditorView();

                PMEditorView.setContenteditable(false);

                //hide prosemirror menubar
                (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "none";

                editorModeJSONRef.updatedSettings = '{"basicMode":true,"advancedMode":false}';

                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json", editorModeJSONRef.updatedSettings)

                //log
                console.log("basic selected");

            } else if(currentSelection.value === 'advanced-mode') {
                //log
                console.log("advanced selected");

                if((document.getElementById('app') as HTMLElement).classList.contains('basic-mode-is-active')) {
                    //remove it
                    (document.getElementById('app') as HTMLElement).classList.remove('basic-mode-is-active');    
                }

                //add advanced-mode-is-active class
                (document.getElementById('app') as HTMLElement).classList.add('advanced-mode-is-active');

                if((document.querySelector('.ProseMirror') as HTMLElement) !== null) {
                    PMEditorView.editorView.destroy();
                    //(document.querySelector('.ProseMirror') as HTMLElement).remove();
                }

                editorModeJSONRef.updatedSettings = '{"basicMode":false,"advancedMode":true}';

                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json", editorModeJSONRef.updatedSettings)

                CMEditorView.createEditorView();

                //check if child file is open 
            }
        })
    }

    public directoryTreeKebabDropdownListeners(): void {
        //kebab dropdown button listener
        this.kebabDropdownButtonListener();

        //kebab dropdown select listener
        this.kebabDropdownSelectListener();
    }
}