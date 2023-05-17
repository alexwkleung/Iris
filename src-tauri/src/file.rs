use std::{path::Path, ffi::OsString, fs::ReadDir};

#[tauri::command(rename_all = "snake_case")]
pub fn get_name(dir: String) -> String {  
    let path: &Path = Path::new(&dir);

    let path_name: String = String::from(
        path.file_name()
        .unwrap_or(&OsString::from(""))
        .to_str()
        .unwrap_or("")
    );

    return path_name;
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_directory_name(dir: String) -> String {
    let path: &Path = Path::new(&dir);

    let path_parent: String = String::from(
        path.parent()
        .unwrap()
        .to_string_lossy()
    );

    return path_parent;
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_name_vec(dir: String) -> Vec<String> {
    //https://stackoverflow.com/questions/31225745/iterate-over-stdfsreaddir-and-get-only-filenames-from-paths

    let read_dir: ReadDir = std::fs::read_dir(&Path::new(&dir)).unwrap();

    let name_vec: Vec<String> = read_dir.filter_map(|entry| {
      entry.ok().and_then(|e|
        e.path().file_name()
        .and_then(|n| n.to_str().map(|s| String::from(s)))
      )
    })
    .collect::<Vec<String>>();

    return name_vec;
}