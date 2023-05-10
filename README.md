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

5. [Utilities (Development)](#utilities-development)

6. [Contributions](#contributions)

7. [License](#license)

# Features

1. Mode switching. Switch between WYSIWYG, Markdown, and Reading mode views. 

2. Auto saving. You will never have to press Cmd/Ctrl+S to save your notes. It magically saves on its own!

3. [Milkdown (ProseMirror)](https://milkdown.dev/) and [CodeMirror](https://codemirror.net/) as the editors. 

    - Milkdown is the WYSIWYG editor, which is a framework based off of ProseMirror. It does the heavy lifting to make the out of the box WYSIWYG Markdown experience nice and easy to use.

    - CodeMirror is the editor used for Markdown mode. You can write in pure Markdown syntax, similar to plain-text style if you don't like WYSIWYG. 

4. A simple and comfortable user interface.

# Why

*Why did I create Iris?*

I created Iris because as a person who enjoys Markdown and nice note-taking apps, I imagined of creating my own. Also being inspired by my favourite Markdown note-taking apps, I wanted to turn that dream into a reality. Pushing through many hours, I am finally here now - living the reality. In the short period of creating this, I never imagined how quick I got things pieced together and working to the extent that it is currently.

While this isn't the best written code, bug-free, or 100% usable/stable by any means, I know that with time and patience, I can improve further. I'm glad that I learned a few things while doing this project, such as creating a basic working file directory tree and switching between different views.

Enjoy! ✨

# Installation and Setup (User/Client)

Go to [releases](https://github.com/alexwkleung/Iris/releases) and find the latest version available. The naming scheme for the installer is `Iris_0.x.x_universal.dmg`.

# Installation and Setup (Development)

Make sure you have [Rust](https://www.rust-lang.org/tools/install) installed. 

Clone the repository.

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
