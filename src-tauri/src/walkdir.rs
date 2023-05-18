use walkdir::{WalkDir, DirEntry};
use std::path::{Path, PathBuf};
use std::vec::Vec;


pub fn is_hidden(entry: &DirEntry) -> bool {
    //return a boolean value if the entry starts with a '.' (dotfiles)
    return entry.file_name()
                .to_str()
                .map(|s| s.starts_with("."))
                .unwrap_or(false);
}

pub fn is_ext_hidden(entry: &DirEntry) -> bool {
    return entry.file_name()
                .to_str()
                .map(|s| s.ends_with(".md"))
                .unwrap_or(false);
}

#[tauri::command(rename_all = "snake_case")]
pub fn walk(dir: String) -> Vec<String> {
    let path: &Path = Path::new(&dir);

    let walkdir_vec: Vec<PathBuf> = WalkDir::new(path)
        .into_iter()
        .filter_entry(|e| !is_hidden(e)) //ignore dotfiles
        .filter_map(|e| e.ok())
        .map(|x| x.path().to_owned())
        .collect();

    let mut path_vec: Vec<String> = Vec::new();

    for entry in walkdir_vec {
        path_vec.push(
            entry
            .into_os_string()
            .into_string()
            .unwrap()
        );
    }

    return path_vec;
}   

#[tauri::command(rename_all = "snake_case")]
pub fn walk_no_ext(dir: String) -> Vec<String> {
    let path: &Path = Path::new(&dir);

    let walkdir_vec: Vec<PathBuf> = WalkDir::new(path)
        .into_iter()
        .filter_entry(|e| !is_ext_hidden(e)) 
        .filter_map(|e| e.ok())
        .map(|x| x.path().to_owned())
        .collect();

    let mut path_vec: Vec<String> = Vec::new();

    for entry in walkdir_vec {
        path_vec.push(
            entry
            .into_os_string()
            .into_string()
            .unwrap()
        );
    }

    return path_vec;
}