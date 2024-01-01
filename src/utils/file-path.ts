import { IFileData, ICurrentNoteData } from "../renderer/interfaces/file-path-interfaces";
import { fsMod } from "./alias";
import { GenericArray } from "./array";

export namespace FilePath {
    class PathUtil {
        /**
         * Base directory to look in for notes
         */
        public baseNotes: string = fsMod.fs._baseDir("home") + "/Iris/Notes";

        /**
         * Array to hold parent folder paths
         */
        private parentFolderPaths: string[] = [];

        /**
         * Array to hold parent folder names
         */
        private parentFolders: string[] = [];

        /**
         * Array to hold child file paths
         */
        private childFilePaths: string[][] = [];

        /**
         * Array to hold child file names
         */
        private childFiles: string[] = [];

        /**
         * Array containing object of file data
         */
        public fileData: IFileData[] = [];

        public currentNoteData: ICurrentNoteData = {
            currentNote: {
                parentFolder: "",
                childFile: "",
                notePath: "",
            },
        };

        /**
         * @private
         */
        private populateParentFolderPaths(): void {
            try {
                fsMod.fs._getNameVec(this.baseNotes).map((folders) => {
                    if (folders !== ".DS_Store") {
                        this.parentFolderPaths.push(this.baseNotes + "/" + folders);

                        this.parentFolders.push(folders);
                        console.log(folders);
                    }
                });

                console.log(this.parentFolderPaths);
            } catch (e) {
                throw console.error(e);
            }
        }

        /**
         * @private
         */
        private populateChildFilePaths(): void {
            for (let i = 0; i < this.parentFolders.length; i++) {
                try {
                    const parentContentTemp: string[] = Array.from(
                        fsMod.fs._walk(this.baseNotes + "/" + this.parentFolders[i])
                    );

                    console.log(parentContentTemp);

                    //note:
                    //first index of each array in matrix contains the parent folder path
                    this.childFilePaths.push(parentContentTemp);
                } catch (e) {
                    throw console.error(e);
                }
            }

            //https://stackoverflow.com/questions/43674164/delete-first-element-from-each-array-in-javascript
            //remove directory name from first index of each array in matrix
            this.childFilePaths.forEach((childPaths) => {
                childPaths.splice(0, 1);
            });

            console.log(this.childFilePaths);
        }

        /**
         * @public
         */
        public populateFileData(): void {
            this.populateParentFolderPaths();
            this.populateChildFilePaths();

            //populate file data with initial objects + parent folder properties
            for (
                let i = 0;
                i < this.parentFolderPaths.length && this.parentFolders.length && this.childFilePaths.length;
                i++
            ) {
                if (
                    this.parentFolderPaths.length === this.parentFolders.length &&
                    this.childFilePaths.length === this.parentFolderPaths.length &&
                    this.childFilePaths.length === this.parentFolders.length
                ) {
                    this.childFiles = GenericArray.use.deepCopy(this.childFilePaths[i]);

                    //push file data object, exclude value of childFileNames and childFileNamesWithExt
                    this.fileData.push({
                        noteDirectory: {
                            parentFolderPath: this.parentFolderPaths[i],
                            childFilePaths: this.childFilePaths[i],
                            parentFolderName: this.parentFolders[i],
                            childFileNames: [],
                            childFileNamesWithExt: [],
                        },
                    });
                } else {
                    throw console.error("Length of parent paths and names do not match.");
                }

                //populate child file names
                this.childFiles.forEach((filePaths) => {
                    //child file names (no extension)
                    this.fileData[i].noteDirectory.childFileNames.push(
                        (filePaths.split("/").pop() as string).split(".md")[0]
                    );

                    //child file names (with extension)
                    this.fileData[i].noteDirectory.childFileNamesWithExt.push(filePaths.split("/").pop() as string);
                });
            }
            console.log(this.fileData);
        }

        public populateCurrentNoteData(parentFolder: string, childFile: string): void {
            //
        }
    }

    /**
     * PathUtil object
     */
    export const use: PathUtil = new PathUtil();
}
