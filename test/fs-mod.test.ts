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

//base directory
describe('base directory', () => {
    it("should return the users' base directory", () => {
        //NOTE: others will need to modify this to run test case
        const username: string = "alex";

        expect(baseDir("home")).toEqual("/Users/" + username);
    })
})

describe('get name', () => {
    it("should return the root directory name of the path only", () => {
        //NOTE: others will need to modify this to run test case
        const path: string = "/Users/alex/Iris"
        const eq: string = "Iris";

        expect(getName(path)).toEqual(eq);
    })
})

describe('get directory name', () => {
    it('should return the directory name of the path', () => {
        //NOTE: others will need to modify this to run test case
        const path: string = "/Users/alex/Iris";
        const eq: string = "/Users/alex";
        
        expect(getDirectoryName(path)).toEqual(eq);
    })
})