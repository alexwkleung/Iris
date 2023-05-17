use std::path::Path;

#[tauri::command(rename_all = "snake_case")]
pub fn get_canonical_path(dir: String) -> String {
    /*
    let current_dir: String = String::from(
        dirs::desktop_dir()
        .unwrap()
        .to_string_lossy()
        + "/"
    );
    */

    //let arg_dir: String = String::from(&dir);

    //let directory_path: String = current_dir + &arg_dir;

    let path: &Path = Path::new(&dir);

    match path.canonicalize() {
        Ok(canonical_path) => return canonical_path.into_os_string().into_string().unwrap(),
        Err(_) => return String::from("Unable to canonicalize path")
    }
}