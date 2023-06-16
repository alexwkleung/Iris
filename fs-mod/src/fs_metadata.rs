use std::fs;
use std::path::Path;
use std::io::Error;

#[napi]
pub fn is_path_dir(path: String) -> bool {
    let metadata: bool = fs::metadata(Path::new(&path)).is_ok();

    return metadata;
}

#[napi]
pub fn is_path_file(path: String) -> bool {
    let metadata: Result<fs::Metadata, Error> = fs::metadata(Path::new(&path));

    match metadata {
        Ok(o) => o.is_file(),
        Err(err) => panic!("Specified path is not a file {:} ", err)
    }
}