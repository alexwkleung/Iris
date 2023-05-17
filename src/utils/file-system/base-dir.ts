import { invoke } from "@tauri-apps/api"

export async function baseDir(base: string): Promise<unknown> {
    return await invoke('base_dir', { base: base }).then(
        (v) => v
    ).catch((e) => { throw console.error(e) });
}