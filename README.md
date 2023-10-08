<h1 align="center">✨ Iris</h1>

<p align="center">Iris is a comfortable Markdown note-taking app. Written in TypeScript and Rust.</p>

<p align="center">
    <img src="https://img.shields.io/github/downloads/alexwkleung/Iris/total"></img>
    <img src="https://img.shields.io/github/stars/alexwkleung/Iris"></img>
    <img src="https://img.shields.io/github/package-json/v/alexwkleung/Iris"></img>
</p>

<img align="center" src="./screenshots/current-dev-v0.2.0-42.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-43.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-44.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-45.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-46.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-47.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-48.png"></img>

<img align="center" src="./screenshots/current-dev-v0.2.0-49.png"></img>

# Release date 

There is no set release date for v0.2.0 at the moment.  

This release will mark the first official build for Iris. There will be a few dev builds that users can install to get a feel of the application before release.

You can use the [GitHub Discussions](https://github.com/alexwkleung/Iris/discussions) for communication.

# Installation

You can install the latest dev builds from [releases](https://github.com/alexwkleung/Iris/releases).

If you want to build the app directly from source, follow the instructions in [Development](#development).
 
# Development 

Install [Rust](https://www.rust-lang.org/tools/install)

If you are cross-compiling the native modules for other platforms (i.e., compile to MSVC on macOS), you'll need to install the corresponding target:

```bash
# check target list
rustc --print target-list

# install target
rustup target install <target>

# some targets might require clang or llvm as a dependency 
# for example, install llvm dependency via brew if you don't have it
brew install llvm
```

The recommended build tool for Iris is [GNU Make](https://www.gnu.org/software/make/). All important build steps or commands will be reflected in the `makefile`. At the moment, only a small set of commands have a `npm run` script counterpart.

Clone the repository

```bash 
git clone <SSH/HTTPS URL>
```

Change directory 

```bash
cd <...>/Iris
```

Install npm dependencies

```bash
npm install 
```

Build native modules

```bash
# change directory to native module
cd fs-mod

# execute one of the build commands below:

# build native module for your platform (automatic)
npm run build
# build native module for macOS x64
npm run build-x64
# build native module for macOS arm64
npm run build-arm64

# go back to previous directory (assuming Iris root)
cd -
```

Run development build

```bash
# via make 
make dev

# via npm
npm run dev
```

Build the installer 

```bash
# via make
make build-mac

# via npm
npm run build:mac

# windows and linux not tested
npm run build:win
npm run build:linux
```

# Contributing 

Here are a list of ways you can contribute to Iris:

1. [Submit a Pull Request](https://github.com/alexwkleung/Iris/pulls)
2. [Create or answer issues](https://github.com/alexwkleung/Iris/issues)
3. [Create or answer discussion posts](https://github.com/alexwkleung/Iris/discussions)
4. Show your interest by sharing Iris to others :)

# License 

[MIT License.](https://github.com/alexwkleung/Iris/blob/main/LICENSE)