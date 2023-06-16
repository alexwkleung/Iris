/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export function baseDir(base: string): string
export function getName(dir: string): string
export function getDirectoryName(dir: string): string
export function getNameVec(dir: string): Array<string>
export function getCanonicalPath(dir: string): string
export function isFile(baseDir: string, fileDir: string): boolean
export function isDirectory(baseDir: string, dir: string): boolean
export function isFileCanonical(canonicalPath: string): boolean
export function isDirectoryCanonical(canonicalPath: string): boolean
export function readFile(dir: string): string
export function walk(dir: string): Array<string>
export function walkNoExt(dir: string): Array<string>
export function writeToFile(path: string, content: string): void
export function createFile(path: string, content: string): void
export function createDir(path: string): void
export function isPathDir(path: string): boolean
export function isPathFile(path: string): boolean
