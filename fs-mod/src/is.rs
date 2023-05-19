use std::path::Path;
use crate::base_dir::dir_vec;

#[napi]
pub fn is_file(base_dir: String, file_dir: String) -> bool {
    let current_dir: String;
    let arg_dir: String;
    let file_path: String;
    let path: &Path;

    let mut is_file_bool: bool = false;

    if base_dir == "desktop" && dir_vec(String::from("desktop")) {    
        //create current directory to look in
        current_dir = String::from(
            dirs::desktop_dir()
            .unwrap()
            .to_string_lossy() 
            + "/"
        );
            
        //create string from passed argument
        arg_dir = String::from(&file_dir);
            
        //create file path
        file_path = current_dir + &arg_dir;
            
        //create a path using the reference of file_path
        path = Path::new(&file_path);
                   
        is_file_bool = path.is_file();
    } else if base_dir == "home" && dir_vec(String::from("home")) {
        //create current directory to look in
        current_dir = String::from(
            dirs::home_dir()
            .unwrap()
            .to_string_lossy() 
            + "/"
        );
                    
        //create string from passed argument
        arg_dir = String::from(&file_dir);
                    
        //create file path
        file_path = current_dir + &arg_dir;
                    
        //create a path using the reference of file_path
        path = Path::new(&file_path);
                           
        is_file_bool = path.is_file();
    }

    //return boolean value if path is a file
    return is_file_bool; 
}

#[napi]
pub fn is_directory(base_dir: String, dir: String) -> bool {
    let current_dir: String;
    let arg_dir: String;
    let directory_path: String;
    let path: &Path;

    let mut _is_directory_bool: bool = false;

    if base_dir == "desktop" && dir_vec(String::from("desktop")) {
        //create current directory to look in
        current_dir = String::from(
            dirs::desktop_dir()
            .unwrap()
            .to_string_lossy() 
            + "/"
        );

        //create string from passed argument
        arg_dir = String::from(&dir);

        //create directory path
        directory_path = current_dir + &arg_dir;

        //create a new path using the reference of directory_path
        path = Path::new(&directory_path);

        _is_directory_bool = path.is_dir();
    } else if base_dir == "home" && dir_vec(String::from("home")) {
        //create current directory to look in
        current_dir = String::from(
            dirs::home_dir()
            .unwrap()
            .to_string_lossy() 
            + "/"
        );

        //create string from passed argument
        arg_dir = String::from(&dir);

        //create directory path
        directory_path = current_dir + &arg_dir;

        //create a new path using the reference of directory_path
        path = Path::new(&directory_path);

        _is_directory_bool = path.is_dir();
    } else {
        _is_directory_bool = false;
    }

    //return boolean value if path is a directory (folder)
    return _is_directory_bool;

    //https://stackoverflow.com/questions/71566768/path-always-returning-false-when-trying-to-manually-put-a-path-with-rust
    //https://stackoverflow.com/questions/30511331/getting-the-absolute-path-from-a-pathbuf
}

#[napi]
pub fn is_file_canonical(canonical_path: String) -> bool {
    let path: &Path = Path::new(&canonical_path);

    return path.is_file();
}

#[napi]
pub fn is_directory_canonical(canonical_path: String) -> bool {
    let path: &Path = Path::new(&canonical_path);

    return path.is_dir();
}
