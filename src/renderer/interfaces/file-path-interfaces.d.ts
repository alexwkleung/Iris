export interface IFileData {
    noteDirectory: {
        parentFolderPath: string;
        childFilePaths: string[];
        parentFolderName: string;
        childFileNames: string[];
        childFileNamesWithExt: string[];
    };
}

export interface ICurrentNoteData {
    currentNote: {
        parentFolder: string;
        childFile: string;
        notePath: string;
    };
}
