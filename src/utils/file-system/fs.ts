import { invoke } from '@tauri-apps/api'
import { baseDir } from './base-dir'

export async function readFile(dir: string) {
    return await invoke('read_file', { dir: dir }).then(
        (v) => v
    ).catch((e) => { throw console.error(e) });
}

export async function readFileRoot(file: string) {
    return await readFile(await baseDir("home").then((v) => v) + "/Iris/Notes/" + file).then(
        (v) => v
    ).catch((e) => { throw console.error(e) })
}

export async function readFileFolder(folder: string, file: string) {
    return await readFile(await baseDir("home").then((v) => v) + "/Iris/Notes/" + folder + "/" + file).then(
        (v) => v
    ).catch((e) => { throw console.error(e) })
}