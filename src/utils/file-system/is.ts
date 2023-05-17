import { invoke } from "@tauri-apps/api"

/**
 * isFile function
 * @param fileDir The directory of the file to pass into invoked `is_file` function from `is.rs`
 * @returns A boolean value if path is a file
 */
export async function isFile(baseDir: string, fileDir: string): Promise<unknown> {
    const isFile: boolean | unknown = await invoke(
        "is_file", { base_dir: baseDir, file_dir: fileDir }
    ).then((v) => v).catch((e) => { throw console.error(e) });

    return isFile;
}
 
/**
 * isDirectory function
 * 
 * @param dir The directory to pass into invoked `is_directory` function from `is.rs`
 * @returns A boolean value if path is a directory (folder)
 */
export async function isDirectory(baseDir: string, dir: string): Promise<unknown> {
    const isDirectory: boolean | unknown = await invoke(
        "is_directory", { base_dir: baseDir, dir: dir }
    ).then((v) => v).catch((e) => { throw console.error(e) });

    return isDirectory;
}

export async function isDirectoryCanonical(dir: string): Promise<unknown> {
    const isDirCanonical: boolean | unknown = await invoke('get_canonical_path', { dir: dir }).then(
        async (v) => {
            return await invoke('is_directory_canonical', { canonical_path: v }).then(
                (vv) => vv
            ).catch((e) => { throw console.error(e) });
        }
    ).catch((e) => { throw console.error(e) });

    return isDirCanonical;
}

export async function isFileCanonical(dirOfFile: string): Promise<unknown> {
    const isFileCanonical: boolean | unknown = await invoke('get_canonical_path', { dir: dirOfFile}).then(
        async (v) => {
            return await invoke('is_file_canonical', { canonical_path: v }).then(
                (vv) => vv
            ).catch((e) => { throw console.error(e) });
        }
    )

    return isFileCanonical;
}