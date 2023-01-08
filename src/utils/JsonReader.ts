import assert from "assert";
import {existsSync, readFileSync, statSync} from "fs";

export default class JsonReader{
  /**
   * 从文件中读取JSON
   * @param filepath 文件路径
   * @returns 返回json对象
   */
  public static readFile(filepath:string){
    if (!existsSync(filepath)){
      throw new JsonReaderError(`文件不存在 : ${filepath}`);      
    }
    if (!statSync(filepath).isFile()){
      throw new JsonReaderError("不是文件 : "+filepath); 
    }
    let data = readFileSync(filepath).toString();
    // 去除单行注释
    let noCommet = data.replace(/\/\/.*/g, "");
    // 去除多行注释
    noCommet = noCommet.replace(/\/\*[\s\w\W]*?\*\//g, "");

    return JSON.parse(noCommet);
  }
}
export class JsonReaderError extends Error{}
