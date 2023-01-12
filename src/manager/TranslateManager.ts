import {readdirSync} from "fs";
import {eachLine} from "line-reader";
import {join, parse} from "path";
import Constants from "../utils/Constants";
import {isDirectory} from "../utils/FileUtils";

interface LanguageType {
  [index: string]: {
    [index: string]: string;
  }
}

export default class TranslateManager {
  private static readonly languages: LanguageType = {};
  private static readonly reverseLanguages: LanguageType = {};
  public static async init() {
    const langsDir = join(Constants.RESOURCE_DIR, "texts");
    if (!isDirectory(langsDir)) {
      throw new Error("无法读取语言文件夹 : " + langsDir);
    }

    for (let file of readdirSync(langsDir)) {
      let fullpath = join(langsDir, file);
      await this.loadLangFile(fullpath);
    }
  }

  /**
   * 加载.lang文件
   * @param path .lang路径
   */
  public static async loadLangFile(path: string): Promise<void> {
    const filename = parse(path).name;

    this.languages[filename] = {};
    this.reverseLanguages[filename] = {};

    return new Promise(res => {
      eachLine(path, (line, last) => {
        let trimed = line.trim();
        // 如果为注释跳过
        if (trimed.startsWith("#")) {
          return;
        }
        if (line.startsWith("commands.players.list")
          || line.startsWith("tile.")) {
          let raw = line.split("=")[0];
          // 移除翻译文件结尾的\t#
          let trans = line.split("=")[1].replace(/\t#$/g,"");
          this.languages[filename][raw] = trans;
          this.reverseLanguages[filename][trans] = raw;
        }
        if (last) {
          res();
        }
      });
    });
  }

  /**
   * 获取翻译
   * @param region 语言地区 如:zh_CN
   * @param rawText 原语言例如 tile.stone.xxx
   * @returns 目标语言 例如 石头
   */
  public static getTranslate(region: string, rawText: string) {
    return this.languages[region][rawText]
      ?? this.languages["en_US"][rawText]
      ?? rawText;
  }

  /**
   * 获取原语言
   * @param region 地区 如:zh_CN
   * @param localText 本地文字 例如 石头
   * @returns 原语言 例如 tile.stone.name.name
   */
  public static getRawText(region: string, localText: string) {
    return this.reverseLanguages[region][localText];
  }

  /**
   * 获取地区列表
   * @returns ["zh_CN","en_US",...]
   */
  public static listRegions(){
    return Object.keys(this.languages);
  }
}
