import { DirectoryTree } from "./file-directory-tree/file-directory.js"
import { DirectoryTreeListeners } from "./event-listeners/listeners.js"

//main function
async function main() {
    const dirTree = new DirectoryTree();
    const dirTreeListeners = new DirectoryTreeListeners();

    await dirTree.createDirTreeParentNodes()

    dirTreeListeners.parentRootListener();
}
main();