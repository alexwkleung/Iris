import { invoke } from "@tauri-apps/api"

export async function getName(dir: string): Promise<unknown> {
    return await invoke('get_name', { dir: dir }).then(
        (v) => v
    ).catch((e) => { throw console.error(e) });
}

export async function getDirectoryName(dir: string): Promise<unknown> {
    return await invoke('get_directory_name', { dir: dir }).then(
        (v) => v
    ).catch((e) => { console.error(e) });
}

export async function getNameVec(dir: string): Promise<unknown> {
    return await invoke('get_name_vec', { dir: dir }).then(
        (v) => v
    ).catch((e) => { throw console.error(e)});
}