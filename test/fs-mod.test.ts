import { describe, it, expect } from 'vitest'

import { 
    baseDir, 
    getName, 
    getDirectoryName, 
    getNameVec, 
    getCanonicalPath, 
    isFile, 
    isDirectory, 
    isFileCanonical, 
    isDirectoryCanonical, 
    readFile, 
    walk, 
    walkNoExt, 
    writeToFile
} from 'fs-mod'

import path from 'path';

/**
 * NOTE: 
 * 
 * currently, majority of the test data is based on my own hard coded values
 * 
 * others won't be able to run these test cases properly without modifying the values
 * 
 * I plan on replacing the hard coded values at a later time
 */

const baseHome: string = "home";
//const baseDesktop: string = "desktop";

const eqTruthy: boolean = true;
const eqFalsy: boolean = false;

//base directory
describe('base directory', () => {
    const username: string = "alex";

    const base: string[] = ["home", "desktop"];

    //home
    it('should return the home directory path', () => {
        expect(baseDir(base[0])).toStrictEqual("/Users/" + username);
    })

    //desktop
    it('should return the desktop directory path', () => {
        expect(baseDir(base[1])).toStrictEqual("/Users/" + username + "/Desktop");
    })
})

//get name
describe('get name', () => {
    it("should return the root directory name of the path only", () => {
        const dir: string = "/Users/alex/Iris";

        const eq: string = "Iris";

        expect(getName(dir)).toStrictEqual(eq);
    })
})

//get directory name
describe('get directory name', () => {
    it('should return the directory name of the path', () => {
        const dir: string = "/Users/alex/Iris";

        const eq: string = "/Users/alex";
        
        expect(getDirectoryName(dir)).toStrictEqual(eq);
    })
})

//get name vector
describe('get name vector', () => {
    it('should return an array containing all directory names of the path', () => {
        const dir: string = "/Users/alex/Iris/Notes";
        const eq: string[] = [".DS_Store", "Test", "Very long long long long integer", "A Folder", "Sample Notes"];

        expect(getNameVec(dir)).toStrictEqual(eq);
    })
})

//get canonical path
describe('get canonical path', () => {
    const dir: string = "/Users/alex/Iris";

    const eq: string = "/Users/alex/Iris";

    it('should return the canonical path', () => {
        expect(getCanonicalPath(dir)).toStrictEqual(eq);
    })
})

//is file 
describe('is file', () => {
    const pathTruthy: string = "/Iris/Notes/Sample Notes/Sample Note 1.md";

    const pathFalsy: string = "/Foo/Bar.md";

    //home (truthy)
    it('should return true if the path is a file (home)', () => {
        expect(isFile(baseHome, pathTruthy)).toStrictEqual(eqTruthy);
    })

    //home (falsy)
    it('should return false if the path is not a file (does not exist)', () => {
        expect(isFile(baseHome, pathFalsy)).toStrictEqual(eqFalsy);
    })
})

//is directory
describe('is directory', () => {
    const dir: string = "/Iris/Notes/Test";

    //truthy
    it('should return true if the path is a directory', () => {
        expect(isDirectory(baseHome, dir)).toStrictEqual(eqTruthy);
    })

    //falsy
    it('should return false if the path is not a directory (does not exist)', () => {
        expect(isDirectory(baseHome, "/Bar/Foo/")).toStrictEqual(eqFalsy);
    })
})

//is file canonical
describe('is file canonical', () => {
    const pathTruthy: string = baseDir("home") + "/Iris/Notes/Very long long long long integer/Some Random Long Note.md";
    
    const pathFalsy: string = "/Foo/bar/baz.md";

    it('should return true if the file path is canonical', () => {
        expect(isFileCanonical(pathTruthy)).toStrictEqual(eqTruthy);
    })

    it('should return false if the file path is not canonical', () => {
        expect(isFileCanonical(pathFalsy)).toStrictEqual(eqFalsy);
    })
})

//is directory canonical
describe('is directory canonical', () => {
    const pathTruthy: string = baseDir("home") + "/Iris/Notes/Sample Notes";

    const pathFalsy: string = "/Foo/foo2/bar/bar3/baz/baz4";

    it('should return true if the directory path is canonical', () => {
        expect(isDirectoryCanonical(pathTruthy)).toStrictEqual(eqTruthy);
    })

    it('should return false if the directory path is not canonical', () => {
        expect(isDirectoryCanonical(pathFalsy)).toStrictEqual(eqFalsy);
    })
})

//read file
describe('read file', () => {
    const dir: string = path.join(__dirname + "/fixtures/fs-mod/Iris/Test/Test.md");
 
    //the string that is read may contain leading spaces or new lines
    //so it can cause the test to fail
    const eq: string = `# Note\n\nThis is a note!`;

    it('should return a string value of the read file', () => {
        expect(readFile(dir)).toStrictEqual(eq);
        expect(readFile(dir)).toBeTypeOf("string");
    })
})

//walk
describe('walk', () => {
    const dir: string = path.join(__dirname + "/fixtures/fs-mod/Iris");
    
    const eq: string[] = [
        '/Users/alex/Desktop/Git/Iris/test/fixtures/fs-mod/Iris',
        '/Users/alex/Desktop/Git/Iris/test/fixtures/fs-mod/Iris/Test',
        '/Users/alex/Desktop/Git/Iris/test/fixtures/fs-mod/Iris/Test/foo.md',
        '/Users/alex/Desktop/Git/Iris/test/fixtures/fs-mod/Iris/Test/Test.md'
    ];
    
    it('should return an array with elements containing the files/folder paths of the directory being recursively walked on', () => {
        expect(walk(dir)).toStrictEqual(eq);
    })
})

//walk no extension
describe('walk no extension', () => {
    const dir: string = path.join(__dirname + "/fixtures/fs-mod/Iris");
    
    const eq: string[] = [
        '/Users/alex/Desktop/Git/Iris/test/fixtures/fs-mod/Iris',
        '/Users/alex/Desktop/Git/Iris/test/fixtures/fs-mod/Iris/Test'
    ]

    it('should return an array with elements containing the folder paths of the directory being recursively walked on (including dotfiles)', () => {
        expect(walkNoExt(dir)).toStrictEqual(eq);
    })
})

//write to file 
describe('write to file', () => {
    const dir: string = path.join(__dirname + "/fixtures/fs-mod/Iris/Test/foo.md");

    const content: string = "# Heading 1\n\nA paragraph.";

    it("should write the content to the specified path and create it if it doesn't exist", () => {
        expect(writeToFile(dir, content));
    })
})