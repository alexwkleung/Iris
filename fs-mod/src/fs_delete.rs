use trash::delete;
use trash::Error;
use std::path::Path;

#[napi]
pub fn delete_path(path: String) -> () {
    let del_path: Result<(), Error> = delete(Path::new(&path));

    //error handling
    match del_path {
        Ok(o) => o,
        Err(err) => panic!("Unable to delete non-existent path {:} ", err)
    }
}