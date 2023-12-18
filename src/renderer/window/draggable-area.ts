//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace windowNs {
    export function draggableArea(): void {
        const draggableAreaWindowTop: HTMLDivElement = document.createElement('div');
        draggableAreaWindowTop.setAttribute("id", "draggable-area-window-top");
        document.body.insertBefore(draggableAreaWindowTop, document.body.firstChild);
    }
}