import { invoke } from "@tauri-apps/api"

export async function walk(dir: string): Promise<unknown> {
    return await invoke('walk', { dir: dir }).then(
        (v) => v
    ).catch((e) => { throw console.error(e) });
}