// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Window;
use tauri::Manager;

use app::{
  __cmd__is_file, 
  __cmd__is_directory,
  __cmd__is_file_canonical,
  __cmd__is_directory_canonical,
  is::{is_directory, is_file, is_file_canonical, is_directory_canonical},
  __cmd__get_canonical_path, 
  get_canonical_path::get_canonical_path,
  __cmd__walk,
  __cmd__walk_no_ext,
  walkdir::{walk, walk_no_ext},
  __cmd__get_name,
  __cmd__get_directory_name,
  __cmd__get_name_vec,
  file::{get_name, get_directory_name, get_name_vec},
  __cmd__base_dir,
  base_dir::base_dir,
  __cmd__read_file,
  readfile::read_file
};

fn main() {
  tauri::Builder::default()
  .setup(|app| {
      let main_window: Window = app.get_window("main").unwrap();
    
      main_window.set_min_size(Some(tauri::Size::Logical(tauri::LogicalSize { width: 1200.0, height: 800.0 })));

      main_window.set_resizable(true);

      main_window.set_title("Iris");

      Ok(())
    })
  //create invoke handler for tauri so functions can be invoked in front-end
    .invoke_handler(tauri::generate_handler![
      is_file, 
      is_directory, 
      get_canonical_path, 
      walk, 
      is_file_canonical, 
      is_directory_canonical, 
      get_name, 
      get_directory_name,
      base_dir,
      walk_no_ext,
      get_name_vec,
      read_file
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
