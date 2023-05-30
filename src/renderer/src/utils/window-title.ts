/**
 * Window title function
 * 
 * @param includeDefaultText Option to include the default title
 * @param dash Option to add a dash after default title
 * @param leadingText Custom leading text for document title
 * @returns Updated document title 
 */
export function windowTitle(includeDefaultTitle: boolean, dash: boolean, leadingText: string | null): string {
    let docTitle: string = "";

    //check if includeDefaultText and dash is true and leading isn't null
    if(includeDefaultTitle && dash && leadingText !== null) {
        docTitle = (document.title = "Iris" + " - " + leadingText);
    } else if(!includeDefaultTitle && !dash && leadingText !== null) {
        docTitle = (document.title = leadingText);
    } else { 
        docTitle = (document.title = "Iris");
    }

    //return doc title
    return docTitle;
}