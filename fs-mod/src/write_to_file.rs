use std::fs;
use std::io::Error;

#[napi]
pub fn write_to_file(path: String, content: String) -> () {
    let write_file: Result<(), Error> = fs::write(&path, content);

    //handle error
    match write_file {
        Ok(file) => file,
        Err(error) => panic!("Unable to write to file {:} ", error)
    }
}