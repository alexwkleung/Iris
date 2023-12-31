import { IFileData, ICurrentNoteData } from "../interfaces/file-path-interfaces";
import { fsMod } from "./alias";

/**
 * note 1:
 *
 * add watcher for paths
 *
 */

/**
 * note 2:
 *
 * last opened note should be persisted using json
 *
 */

/**
 * note 3:
 *
 * sort parent and child paths
 *
 * handle deletion and insertion of paths (goes hand-in-hand with path watcher)
 *
 */

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
        private childFiles: string[][] = [];

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

        private populateParentFolder(): void {
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

        private populateChildFiles(): void {
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
            console.log(this.childFilePaths);

            //append child file names to this.childFiles
        }

        public populateFileData(): void {
            this.populateParentFolder();
            this.populateChildFiles();

            //populate file data with initial objects + parent folder properties
            for (let i = 0; i < this.parentFolderPaths.length && this.parentFolders.length; i++) {
                if (this.parentFolderPaths.length === this.parentFolders.length) {
                    this.fileData.push({
                        noteDirectory: {
                            parentFolderPath: this.parentFolderPaths[i],
                            childFilePaths: [], //get from this.childFilePaths
                            parentFolderName: this.parentFolders[i],
                            childFileNames: [], //get from this.childFiles -> fsMod.fs_.getName(...)
                        },
                    });
                } else {
                    throw console.error("Length of parent paths and names do not match.");
                }
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
