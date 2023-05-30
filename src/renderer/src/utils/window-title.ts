/**
 * Set window title function
 * 
 * Window title is based on the `document.title` value
 * 
 * @param defaultTitle Option to set the default window title
 * @param dash Option to add a dash (`'-'`) after the default title
 * @param leadingText Option to add custom leading text
 * 
 * @returns Updated document title 
 */
export function setWindowTitle(defaultTitle: string, dash: boolean, leadingText: string | null): string {
    let docTitle: string | null = "";

    if(defaultTitle && dash && leadingText !== null) {
        docTitle = (document.title = defaultTitle + " - " + leadingText);
    } else if(!defaultTitle && !dash && leadingText !== null) {
        docTitle = (document.title = leadingText);
    } else if(defaultTitle && !dash && leadingText === null) { 
        docTitle = (document.title = defaultTitle);
    } else {
        //default is empty title
        docTitle = (document.title = "");
    }

    //return doc title
    return docTitle;
}