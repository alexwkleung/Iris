import { DirectoryTree, FileDirectoryTreeNode } from "./src/file-directory-tree/file-directory.js"

export function directory(): void {
    FileDirectoryTreeNode.createFileDirectoryInit();

    const dirTree = new DirectoryTree();

    dirTree.createDirTreeParentNodes();
}