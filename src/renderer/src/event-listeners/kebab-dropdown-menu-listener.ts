import { KebabDropdownMenu } from "../misc-ui/kebab-dropdown-menu"

export function kebabDropdownMenuListener(): void {
    KebabDropdownMenu.kebabDropdownMenuContainerNode.addEventListener('click', (e) => {
        e.stopImmediatePropagation();

        console.log("clicked kebab");

        (document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.toggle('is-active');

        if((document.getElementById('kebab-after-click-menu-container') as HTMLElement).classList.contains('is-active')) {
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "";
        } else {
            (document.getElementById('kebab-after-click-menu-container') as HTMLElement).style.display = "none";
        }
    })
}