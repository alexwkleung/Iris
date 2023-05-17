import { invoke } from "@tauri-apps/api"

/**
 * getCanonicalPath function
 * 
 * @param dir The directory to pass into invoked `get_canonical_path` function from `get_canonical_path.rs`.
 * Currently the path resolves to the Desktop directory as its root by default.
 * @returns A string representation of the canonical path
 */
export async function getCanonicalPath(dir: string): Promise<unknown> { 
    const canonicalPath: string | unknown = await invoke(
        "get_canonical_path", { dir: dir }
    ).then(
        (v) => {
            if(v) {
                return v;    
            }
        }
    ).catch((e) => { throw console.error(e) });

    return canonicalPath;
}