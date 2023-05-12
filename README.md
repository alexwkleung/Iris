<h1 align="center">✨ Iris</h1>

<p align="center">
<img src="https://img.shields.io/badge/Platforms-macOS-lightgrey">
</p>

<p align="center">
<img src="https://img.shields.io/badge/Architecture-x64%20%7C%20arm64-lightgrey">
</p>

<p align="center">Iris is a WYSIWYG Markdown note-taking app. Created with TypeScript and Tauri.</p>

> <p align="center">"Inspired by my favourite Markdown note-taking apps"</p>

<p align="center">Currently a work-in-progress application.</p> 

![WYSIWYG](/screenshots/wysiwyg.png)

<p align="center"><i>^^ WYSIWYG Mode ^^ </i></p>

![Markdown](/screenshots/markdown.png)

<p align="center"><i>^^ Markdown Mode ^^ </i></p>

![Reading](/screenshots/reading.png)

<p align="center"><i>^^ Reading Mode ^^ </i></p>

# Table of Contents

1. [Features](#features)

2. [Why](#why)

3. [Installation and Setup (User/Client)](#installation-and-setup-userclient)

4. [Installation and Setup (Development)](#installation-and-setup-development)

5. [Contributions](#contributions)

6. [License](#license)

# Features

1. Mode switching. Switch between WYSIWYG, Markdown, and Reading mode views. 

2. Auto saving. You will never have to press Cmd/Ctrl+S to save your notes. It magically saves on its own!

3. [Milkdown v6 (ProseMirror)](https://milkdown.dev/) and [CodeMirror](https://codemirror.net/) as the editors. 

    - Milkdown is the WYSIWYG editor, which is a framework based off of ProseMirror. It does the heavy lifting to make the out of the box WYSIWYG Markdown experience nice and easy to use.

    - CodeMirror is the editor used for Markdown mode. You can write in pure Markdown syntax, similar to plain-text style if you don't like WYSIWYG. 

4. A simple and comfortable user interface.

# Why

*Why did I create Iris?*

I created Iris because as a person who enjoys Markdown and note-taking apps, I imagined of creating my own. Being inspired by my favourite Markdown note-taking apps encouraged me to make that dream into a reality.

While this isn't the best written code or 100% usable/stable by any means, I know that with time and patience, Iris can be further improved.

Enjoy! ✨

# Installation (User/Client)

Go to [releases](https://github.com/alexwkleung/Iris/releases) and find the latest version available. The current naming scheme for the installer is `Iris_0.x.x_universal.dmg`.

# Installation (Development)

Install [Rust](https://www.rust-lang.org/tools/install)

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

Run development build

```bash
# via make 
make tauri

# via npm
npm run tauri-dev
```

Building for production

```bash
# via make 
make build
```

If you need to use the dev tools in the production build

```bash
# via make
make build-debug
```

# Contributions

Contributions are welcomed, but it's 100% optional. 

Feel free to submit a [new issue](https://github.com/alexwkleung/Iris/issues) or a [pull request](https://github.com/alexwkleung/Iris/pulls) if you have any improvements or concerns.

# License 

[MIT License](LICENSE).
