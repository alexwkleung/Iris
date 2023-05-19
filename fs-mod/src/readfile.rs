use std::fs;

#[napi]
pub fn read_file(dir: String) -> String {
    let file_content: String = fs::read_to_string(&dir).expect("the file from the path to be read");

    return file_content;
}