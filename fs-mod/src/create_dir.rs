use std::fs;
use std::io::Error;

#[napi]
pub fn create_dir(path: String) -> () {
    let c_dir: Result<(), Error> = fs::create_dir(&path);

    //error handling
    match c_dir {
        Ok(o) => o,
        Err(error) => panic!("Unable to create directory {:} ", error)
    }
}