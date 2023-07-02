import { CMEditorView } from "../codemirror/editor/cm-editor-view"
import { PMEditorView } from "../prosemirror/editor/editor-view"
import { PMEditorState } from "../prosemirror/editor/editor-state"
import { fsMod } from "../utils/alias"
import { Settings } from "../settings/settings"
import { RefsNs } from "./directory-tree-listeners"
import { defaultMarkdownParser } from "prosemirror-markdown"
import { Node } from "prosemirror-model"
import { EditorListeners } from "./editor-listeners"
import { EditorKebabDropdownMenuListeners } from "./kebab-dropdown-menu-listener"
import { CMEditorState } from "../codemirror/editor/cm-editor-state"
import { cursors } from "../codemirror/extensions/cursors"
import { wordCountListener } from "./word-count-listener"
import { AdvancedModeSettings } from "../settings/settings"
import { EditorView } from "@codemirror/view"
import { isModeBasic, isModeAdvanced, isModeReading } from "../utils/is"
import { ReadingMode } from "../mode/reading-mode"
import { markdownParser } from "../utils/markdown-parser"

import highlightLight from '../../assets/classic-light.min.css?inline?url'
import highlightDark from '../../assets/classic-dark.min.css?inline?url'

interface IEditorModeJSONRef<T extends string> {
    updatedSettings: T
}

const editorModeJSONRef: IEditorModeJSONRef<string> = {
    updatedSettings: JSON.stringify(Settings.parseDotSettings())
}

export class DirectoryTreeKebabDropdownListeners extends EditorListeners {
    /**
     * 
     * Editor kebab dropdown listeners 
     * 
     * @private
     * @protected
     */
    private readonly editorKebabDropdownListeners = new EditorKebabDropdownMenuListeners();

    /**
     * Kebab dropdown button listener
     */
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
            
            (document.getElementById("file-directory-kebab-after-click-menu-container") as HTMLElement).classList.remove('is-active');
        })
    }    

    /**
     * Kebab dorpdown select listener
     */
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
                
                if(isModeReading()) {
                    (document.getElementById('app') as HTMLElement).classList.remove('reading-mode-is-active');    
                }

                if(document.getElementById('reading-mode-container') as HTMLElement !== null) {
                    (document.getElementById('reading-mode-container') as HTMLElement).remove();
                }

                if((document.querySelector('.advanced-mode-option') as HTMLElement).hasAttribute('selected')) {
                    (document.querySelector('.advanced-mode-option') as HTMLElement).removeAttribute('selected');
                } else if((document.querySelector('.reading-mode-option') as HTMLElement).hasAttribute('selected')) {
                    (document.querySelector('.reading-mode-option') as HTMLElement).removeAttribute('selected');
                }

                (document.querySelector('.basic-mode-option') as HTMLElement).setAttribute('selected', "");

                //add basic-mode-is-active class 
                (document.getElementById('app') as HTMLElement).classList.add('basic-mode-is-active');

                if(document.querySelector('.cm-editor') as HTMLElement !== null) {
                    CMEditorView.editorView.destroy();
                    //(document.querySelector('.cm-editor') as HTMLElement).remove();
                }

                PMEditorView.createEditorView();

                PMEditorView.setContenteditable(true);

                //show prosemirror menubar
                (document.querySelector('.ProseMirror-menubar') as HTMLElement).style.display = "";

                //show kebab dropdown 
                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "";

                editorModeJSONRef.updatedSettings = '{"basicMode":true,"advancedMode":false,"readingMode":false}';

                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json", editorModeJSONRef.updatedSettings)

                //log
                console.log("basic selected");

                //if(document.querySelector('.child-file-name is-active-child') as HTMLElement !== null) {
                    RefsNs.currentParentChildData.map((props) => {
                        //update editor view state
                        PMEditorView.editorView.updateState(
                            //apply transaction
                            PMEditorView.editorView.state.apply(
                                PMEditorState.editorState.tr.replaceRangeWith(
                                    0, 
                                    0,
                                    defaultMarkdownParser.parse(
                                    fsMod.fs._readFileFolder(props.parentFolderName,
                                        props.childFileName + ".md"
                                    )
                                ) as Node
                            )));
        
                        //invoke auto save listener
                        this.autoSaveListener("prosemirror");
        
                        //invoke insert tab listener
                        this.insertTabListener((document.querySelector(".ProseMirror") as HTMLElement), 2);

                        wordCountListener("prosemirror");

                        //kebab dropdown menu listener
                        this.editorKebabDropdownListeners.kebabDropdownMenuListener();
                    })
                //} else {
                    //return;
                //}
            } else if(currentSelection.value === 'advanced-mode') {
                //log
                console.log("advanced selected");

                //if basic mode is active
                if((document.getElementById('app') as HTMLElement).classList.contains('basic-mode-is-active')) {
                    //remove it
                    (document.getElementById('app') as HTMLElement).classList.remove('basic-mode-is-active');    
                } 

                //if reading mode is active
                if(isModeReading()) {
                    (document.getElementById('app') as HTMLElement).classList.remove('reading-mode-is-active');    
                }

                //check if reading mode node is present in dom
                if(document.getElementById('reading-mode-container') as HTMLElement !== null) {
                    //remove it
                    (document.getElementById('reading-mode-container') as HTMLElement).remove();
                }

                //check attributes and remove them
                if((document.querySelector('.basic-mode-option') as HTMLElement).hasAttribute('selected')) {
                    (document.querySelector('.basic-mode-option') as HTMLElement).removeAttribute('selected');
                } else if((document.querySelector('.reading-mode-option') as HTMLElement).hasAttribute('selected')) {
                    (document.querySelector('.reading-mode-option') as HTMLElement).removeAttribute('selected');
                }

                //set correct attribute
                (document.querySelector('.advanced-mode-option') as HTMLElement).setAttribute('selected', "");

                //add advanced-mode-is-active class
                (document.getElementById('app') as HTMLElement).classList.add('advanced-mode-is-active');

                if((document.querySelector('.ProseMirror') as HTMLElement) !== null) {
                    PMEditorView.editorView.destroy();
                }

                editorModeJSONRef.updatedSettings = '{"basicMode":false,"advancedMode":true,"readingMode":false}';

                fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json", editorModeJSONRef.updatedSettings)

                CMEditorView.createEditorView();
                CMEditorView.setContenteditable(true);

               //if(document.querySelector('.child-file-name is-active-child') as HTMLElement !== null) {
                    //insert active file content into editor
                    
                    RefsNs.currentParentChildData.map((props) => {
                        //dispatch text insertion tr
                        CMEditorView.editorView.dispatch({
                            changes: {
                                from: 0,
                                to: 0,
                                insert: fsMod.fs._readFileFolder(props.parentFolderName, 
                                props.childFileName + ".md")
                            }
                        });
                    })
                    
                    if(Settings.parseThemeSettings().lightTheme) {
                        CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[0]) })
                    } else if(Settings.parseThemeSettings().darkTheme) {
                        CMEditorView.editorView.dispatch({ effects: CMEditorState.cursorCompartment.reconfigure(cursors[1]) })
                    }

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
                    
                    //set scroll position to the beginning of the view 
                    CMEditorView.editorView.dispatch({
                        effects: EditorView.scrollIntoView(0)
                    })

                    this.autoSaveListener("codemirror");

                    wordCountListener("codemirror");

                    //kebab dropdown menu listener
                    this.editorKebabDropdownListeners.kebabDropdownMenuListener();
                //} else {
                    //return;
                //}
            } else if(currentSelection.value === 'reading-mode') {
                //if mode is basic
                if(isModeBasic()) {
                    (document.getElementById('app') as HTMLElement).classList.remove('basic-mode-is-active');
                    (document.getElementById('app') as HTMLElement).classList.add('reading-mode-is-active');

                    //update settings
                    editorModeJSONRef.updatedSettings = '{"basicMode":false,"advancedMode":false,"readingMode":true}';
                    fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json", editorModeJSONRef.updatedSettings)

                    //destroy corresponding editorview
                    PMEditorView.editorView.destroy();
                //if mode is advanced
                } else if(isModeAdvanced()) {
                    (document.getElementById('app') as HTMLElement).classList.remove('advanced-mode-is-active');
                    (document.getElementById('app') as HTMLElement).classList.add('reading-mode-is-active');

                    editorModeJSONRef.updatedSettings = '{"basicMode":false,"advancedMode":false,"readingMode":true}';
                    fsMod.fs._writeToFileAlt(fsMod.fs._baseDir("home") + "/Iris/.iris-dot-settings.json", editorModeJSONRef.updatedSettings)

                    CMEditorView.editorView.destroy();
                }

                if((document.querySelector('.basic-mode-option') as HTMLElement).hasAttribute('selected')) {
                    (document.querySelector('.basic-mode-option') as HTMLElement).removeAttribute('selected');
                } else if((document.querySelector('.advanced-mode-option') as HTMLElement).hasAttribute('selected')) {
                    (document.querySelector('.advanced-mode-option') as HTMLElement).removeAttribute('selected');
                }

                (document.querySelector('.reading-mode-option') as HTMLElement).setAttribute('selected', "");

                //hide word count
                (document.getElementById('word-count-container') as HTMLElement).style.display = "none";

                //hide kebab dropdown menu
                (document.getElementById('kebab-dropdown-menu-container') as HTMLElement).style.display = "none";

                ReadingMode.readingModeNode();

                RefsNs.currentParentChildData.map(async (props) => {
                    //create fragment from content and append fragment
                    const content: string = await markdownParser(fsMod.fs._readFileFolder(props.parentFolderName, props.childFileName + ".md"))
                    const rangeContextFragment = new Range().createContextualFragment(content);
                    (document.getElementById('reading-mode-content') as HTMLElement).appendChild(rangeContextFragment);

                    //link behaviour
                    document.querySelectorAll('#reading-mode-container a').forEach((el) => {
                        el.addEventListener('click', (e) => {
                            e.preventDefault();
                        })
                    })
                })
            }

            if((document.querySelector('.highlight-light-theme') as HTMLElement) !== null) {
                (document.querySelector('.highlight-light-theme') as HTMLElement).remove();
            }

            if((document.querySelector('.highlight-dark-theme') as HTMLElement) !== null) {
                (document.querySelector('.highlight-dark-theme') as HTMLElement).remove();
            }

            if(Settings.parseThemeSettings().lightTheme) {
                const highlightTheme: HTMLLinkElement = document.createElement('link');
                highlightTheme.setAttribute("rel", "stylesheet");
                highlightTheme.setAttribute("href", highlightLight);
                highlightTheme.setAttribute("class", "highlight-light-theme");
                document.body.appendChild(highlightTheme);
            } else if(Settings.parseThemeSettings().darkTheme) {
                const highlightDarkTheme: HTMLLinkElement = document.createElement('link');
                highlightDarkTheme.setAttribute("rel", "stylesheet");
                highlightDarkTheme.setAttribute("href", highlightDark);
                highlightDarkTheme.setAttribute("class", "highlight-dark-theme");
                document.body.appendChild(highlightDarkTheme);
            }                            
        })
    }

    /**
     * Directory tree kebab dropdown listeners
     */
    public directoryTreeKebabDropdownListeners(): void {
        //kebab dropdown button listener
        this.kebabDropdownButtonListener();

        //kebab dropdown select listener
        this.kebabDropdownSelectListener();
    }
}