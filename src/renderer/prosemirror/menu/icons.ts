//base taken from: https://github.com/ProseMirror/prosemirror-menu/blob/master/src/icons.ts
//disabling eslint is a temp workaround
//the code will properly adhere to eslint rules at a later time

const SVG = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

const prefix = "ProseMirror-icon";

//eslint-disable-next-line
function hashPath(path: string) {
    let hash = 0;
    for (let i = 0; i < path.length; i++) hash = ((hash << 5) - hash + path.charCodeAt(i)) | 0;
    return hash;
}

export function getIcon(
    icon: { path: string; width: number; height: number } | { text: string; css?: string } | { dom: Node }
): HTMLElement {
    const node = document.createElement("div");
    node.className = prefix;
    if ((icon as any).path) {
        const { path, width, height } = icon as { path: string; width: number; height: number };
        const name = "pm-icon-" + hashPath(path).toString(16);
        if (!document.getElementById(name)) buildSVG(name, icon as { path: string; width: number; height: number });
        const svg = node.appendChild(document.createElementNS(SVG, "svg"));
        svg.style.width = width / height + "em";
        const use = svg.appendChild(document.createElementNS(SVG, "use"));
        use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(document.location.toString())![1] + "#" + name);
    } else if ((icon as any).dom) {
        node.appendChild((icon as any).dom.cloneNode(true));
    } else {
        const { text, css } = icon as { text: string; css?: string };
        node.appendChild(document.createElement("span")).textContent = text || "";
        if (css) (node.firstChild as HTMLElement).style.cssText = css;
    }
    return node;
}

//eslint-disable-next-line
function buildSVG(name: string, data: { width: number; height: number; path: string }) {
    let collection = document.getElementById(prefix + "-collection") as Element;
    if (!collection) {
        collection = document.createElementNS(SVG, "svg");
        collection.id = prefix + "-collection";
        (collection as HTMLElement).style.display = "none";
        document.body.insertBefore(collection, document.body.firstChild);
    }
    const sym = document.createElementNS(SVG, "symbol");
    sym.id = name;
    sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);
    const path = sym.appendChild(document.createElementNS(SVG, "path"));
    path.setAttribute("d", data.path);
    collection.appendChild(sym);
}
