import { DirectoryTree, FileDirectoryTreeNode } from "./src/file-directory-tree/file-directory.js"

//eslint-disable-next-line @typescript-eslint/no-namespace
export namespace directoryNs {
    export function directory(): void {
        FileDirectoryTreeNode.createFileDirectoryInit();
        
        const dirTree = new DirectoryTree();

        dirTree.createDirTreeParentNodes();
    }
}