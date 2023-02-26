/* 
* file: `contants.ts`
*
* this file holds all the constants within enums
*
*/

/**
 * FileSystemConstants
 * 
 * Constants for file system
 * 
 * @type enum
 */
export enum FileSystemConstants {
    OpenFile = "File Opened",
    SaveFile = "File Saved",
    CloseDialog = "Dialog Closed",
    OpenFolder = "Folder Opened",
}

/**
 * EditorModeConstants
 * 
 * Constants for editor modes
 * 
 * @type enum
 */
export enum EditorModeConstants {
    WYSIWYG_Active = "WYSIWYG Active",
    WYSIWYG_Inactive = "WYSIWYG Inactive",
    Markdown_Active = "Markdown Active",
    Markdown_Inactive = "Markdown Inactive",
    Reading_Active = "Reading Active",
    Reading_Inactive = "Reading Inactive"
}