import {existsSync, statSync} from "fs";

//export default class FileUtils{
export function isFile(path: string): boolean {
  return isExist(path) && statSync(path).isFile();
}

export function isDirectory(path: string): boolean {
  return isExist(path) && statSync(path).isDirectory();
}

export function isExist(path: string): boolean {
  return existsSync(path);
}
//}
