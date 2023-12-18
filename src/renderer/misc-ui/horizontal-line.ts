/**
 * Append horizontal line node
 * 
 * @param el Element to append horizontal line to
 */
export function appendHorizontalLineNode(el: HTMLElement): void {
    const horizontalLine: HTMLHRElement = document.createElement('hr');
    horizontalLine.setAttribute("class", "horizontal-line-settings");

    el.appendChild(horizontalLine);
}