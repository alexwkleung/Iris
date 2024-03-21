import { DirectoryTree, FileDirectoryTreeNode } from "./file-directory-tree/file-directory.js";

export namespace directoryNs {
    export function directory(): void {
        FileDirectoryTreeNode.createFileDirectoryInit();

        const dirTree = new DirectoryTree();

        dirTree.createDirTreeParentNodes();

        dirTree.createFolderNode();

        dirTree.settingsNode();
    }
}
