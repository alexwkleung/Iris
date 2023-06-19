import { App } from "../../app"

export class KebabDropdownMenu {
    static kebabDropdownMenuContainerNode: HTMLDivElement;

    static createKebabDropdownMenuContainer(): void {
        //kebab dropdown menu container node
        KebabDropdownMenu.kebabDropdownMenuContainerNode = document.createElement('div');
        KebabDropdownMenu.kebabDropdownMenuContainerNode.setAttribute("id", "kebab-dropdown-menu-container");
        App.appNode.insertBefore(KebabDropdownMenu.kebabDropdownMenuContainerNode, document.querySelector('#editor-container'));

        for(let i = 0; i < 3; i++) {
            const kebabDropdownMenuShapeContainerNode: HTMLDivElement = document.createElement('div');
            kebabDropdownMenuShapeContainerNode.setAttribute("id", "kebab-dropdown-shape-container");
            KebabDropdownMenu.kebabDropdownMenuContainerNode.appendChild(kebabDropdownMenuShapeContainerNode);

            //kebab dropdown menu shape node
            const kebabDropdownMenuShapeNode: HTMLDivElement = document.createElement('div');
            kebabDropdownMenuShapeNode.setAttribute("class", "kebab-dropdown-shape-node num-" + i.toString());
            kebabDropdownMenuShapeContainerNode.appendChild(kebabDropdownMenuShapeNode);    

            //hide kebab dropdown menu container node
            KebabDropdownMenu.kebabDropdownMenuContainerNode.style.display = "none";
        }

        //kebab after click menu container
        const kebabAfterClickMenuContainer: HTMLDivElement = document.createElement('div');
        kebabAfterClickMenuContainer.setAttribute("id", "kebab-after-click-menu-container");
        App.appNode.insertBefore(kebabAfterClickMenuContainer, document.getElementById('editor-container'));

        //hide kebab after click menu container
        kebabAfterClickMenuContainer.style.display = "none";

        //kebab delete file button node
        const kebabDeleteFileButtonNode: HTMLDivElement = document.createElement('div');
        kebabDeleteFileButtonNode.setAttribute("id", "kebab-delete-file-button-node");
        kebabAfterClickMenuContainer.appendChild(kebabDeleteFileButtonNode);

        //kebab delete file button text node
        const kebabDeleteFileButtonTextNode: Text = document.createTextNode("Delete File");
        kebabDeleteFileButtonNode.appendChild(kebabDeleteFileButtonTextNode);

        

    }
}