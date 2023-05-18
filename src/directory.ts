import { DirectoryTree, FileDirectoryTreeNode } from "./file-directory-tree/file-directory.js"

FileDirectoryTreeNode.createFileDirectoryInit();

async function directory() {
    const dirTree = new DirectoryTree();

    await dirTree.createDirTreeParentNodes();
}
directory();