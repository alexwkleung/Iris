use std::path::Path;
use std::fs;
use std::io::Error;

#[napi]
pub fn rename_file(old_path: String, new_path: String) -> () {
    let from_old_path: &Path = Path::new(&old_path);
    let from_new_path: &Path = Path::new(&new_path);

    let rename_path: Result<(), Error> = fs::rename(from_old_path, from_new_path);

    match rename_path {
        Ok(o) => o,
        Err(err) => panic!("Unable to rename new path. Check old_path and new_path arguments. {:} ", err)
    }
}