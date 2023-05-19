#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

pub mod base_dir;
pub mod file;
pub mod get_canonical_path;
pub mod is;
pub mod readfile;
pub mod walkdir;