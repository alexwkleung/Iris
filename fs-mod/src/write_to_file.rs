use std::fs;

#[napi]
pub fn write_to_file(path: String, content: String) {
    let write_file = fs::write(&path, content);

    //handle error
    match write_file {
        Ok(file) => file,
        Err(error) => panic!("Unable to write to file {:} ", error)
    }
}