use std::fs;

#[napi]
pub fn create_file(path: String, content: String) {
    let write_file = fs::write(&path, content);

    //error handling
    match write_file {
        Ok(o) => o,
        Err(error) => panic!("Unable to create file {:} ", error)
    }
}