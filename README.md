<h1 align="center">✨ Iris</h1>

![Platforms](https://img.shields.io/badge/Platforms-macOS-lightgrey) ![Architecture](https://img.shields.io/badge/Architecture-x64%20%7C%20arm64-lightgrey)

<p align="center">Iris is a WYSIWYG Markdown note-taking app. Created with TypeScript and Tauri.</p>

> <p align="center">"Inspired by my favourite note-taking apps and made with magical intelligence."</p>

<p align="center">Currently a work-in-progress application. I have released a public stable build for users to try.</p> 

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

5. [Limitations](#limitations)

6. [Submitting Bugs, Issues, and Concerns](#submitting-bugs-issues-and-concerns)

7. [Contributions](#contributions)

8. [License](#license)

# Features

1. Mode switching. Switch between WYSIWYG, Markdown, and Reading mode views. 

2. Auto saving. You will never have to press Cmd/Ctrl+S to save your notes.

3. [Milkdown (ProseMirror)](https://milkdown.dev/) and [CodeMirror](https://codemirror.net/) as the editors. 

    - Milkdown is the WYSIWYG editor, which is a framework based off of ProseMirror. It does the heavy lifting to make the out of the box WYSIWYG Markdown experience nice and easy to use.

    - CodeMirror is the editor used for the Markdown mode of the app. You can write in pure Markdown syntax in plain-text style if you don't like WYSIWYG. 

# Why

*Why did I create Iris?*

I created Iris because as a person who enjoys Markdown and nice note-taking apps, I always wanted to create my own. Also being inspired by my favourite note-taking apps, I wanted to take my dream into reality. Pushing through many hours, I am finally here now - living the reality. In the short period of creating this, I never imagined how quick I got things pieced together and working to the extent that it is currently.

While it isn't the best written code, bug-free, or 100% usable/stable by any means, I know that with time and patience, I can improve further. I'm glad that I learned a few things while doing this project (such as a simple file directory tree), and it was really cool when I figured it out!

Enjoy! ✨

# Installation and Setup (User/Client)

Go to [releases](https://github.com/alexwkleung/Iris/releases) and find the latest version available.

**Note for Intel/Apple Silicon Mac users:** A universal dmg is supplied for best compatibility.

**For convenience**, here is the universal dmg for the latest public stable build (v0.1.0):

[macOS (Intel/Apple Silicon Universal)]()

# Installation and Setup (Development)

Make sure you have [Rust](https://www.rust-lang.org/tools/install) installed. 

Clone the repository.

```bash 
git clone <SSH/HTTPS URL of the repo>
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

# Utilities (Development)

I created some utilities that are used in the app (in separate repositories), which are codenamed "Eva". 

I recommend that you fork the repositories, uninstall my versions, and install your forked ones. This is so you can have full control over the utilities because what I modify/add in these repositories might break your development build.

1. [Eva-DOM-Builder-Util](https://github.com/alexwkleung/Eva-DOM-Builder-Util)

    - The Eva DOM Builder Util is a utility that mainly helped create the file directory. This isn't limited to creating file directories, so you can create pretty much any element node you want given that the function(s) are set up correctly.

2. [Eva-ST-Util](https://github.com/alexwkleung/Eva-ST-Util)

    - The Eva ST (Syntax Tree) Util is a wrapper utility around unist syntax tree utils to convert between mdast/hast trees (and vice versa) for Markdown/HTML. This is used in the Reader mode of the app, which you can think of as the preview mode in other note-taking apps without WYSIWYG.

    - This utility is nice to use for your own projects, as it's simple to use. I myself may use this in future projects since installing only 1 dependency instead of multiple is a plus when you just want to convert between Markdown/HTML quickly and efficiently.

# Limitations

1. No cross-platform support at the moment. If I decided to add cross-platform support, I would have to manually compile and test different WebViews on three platforms (two of them using Virtual Machines), which is slightly too time consuming. 

2. Fixed directory path. Unfortunately, Iris only supports the `Desktop/Iris_Notes` path for now. I'm not familiar with how multiple directories/scopes work in Tauri, since most of the `fs` functions in the TypeScript API only allows a one `baseDirectory` path.

3. Large notes (not exactly sure how large) cause the app to become very slow (as in freezing/slow motion). From my limited testing, the memory usage spikes to at least 100-200mb+ depending on how bad it affects the app. When you switch to a smaller note, it goes away. My code is not optimized for performance, so that is most likely the reason.

# Submitting Bugs, Issues, and Concerns

You can submit a [new issue](https://github.com/alexwkleung/Iris/issues) or a [discussion post](https://github.com/alexwkleung/Iris/discussions) regarding any bugs, issues, concerns, and the related. 

# Contributions

Contributions are welcomed, but is 100% optional. 

If there are any improvements you would like to share, feel free to send a [Pull Request](https://github.com/alexwkleung/Iris/pulls).

# License 

[MIT License](LICENSE).

Take a peek at the code, fork it, and/or just do what you want with it!

If you want to give credit, you can do so via adding a link to this repository within your projects' README. No hard restrictions. It's okay if you don't want to, but it would be appreciated.