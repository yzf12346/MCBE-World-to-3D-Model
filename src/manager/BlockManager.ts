import {join} from "path";
import Block from "../data/Block";
import Constants from "../utils/Constants";
import {isFile} from "../utils/FileUtils";
import JsonReader from "../utils/JsonReader";

export default class BlockManager {
  private static specialJson: any = undefined;
  private static blockMapping = new Map<string, string>();

  public static getBlock(name: string, special = 0) {
    let result = new Block(name, special);

    return result;
  }
}
