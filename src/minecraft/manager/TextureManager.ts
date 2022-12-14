import BlockType from "../world/BlockType";
import {readFileSync} from "fs";
import {Config} from "../../utils/Config";
import {log} from "console";
import ResourceManager from "./ResourceManager";


export default class TextureManager {
  private static textures = new Map<string, string>();

  static getTexture(alias: string): string | undefined {
    return this.textures.get(alias);
  }
  static init(): void {
    this.readTerrianJson(Config.terrianTextureJsonPath);
  }

  private static readTerrianJson(jsonPath: string) {
    let strNoCommits = readFileSync(jsonPath).toString();
    //strNoCommits = strNoCommits.replace(/\/\/[^\n*]/g,"").replace(/\/\*(\s|.)*?\*\//g,"");
    let data = JSON.parse(strNoCommits)["texture_data"];
    Object.keys(data).forEach((key) => {
      let value = data[key];
      this.readTexture(key, value);
    });
  }
  private static readTexture(key: string, value: any) {
    let textures = value["textures"];

    if (typeof textures == "string") {
      const fullpath = ResourceManager.getTextureFullPath(textures);
      this.textures.set(key, fullpath);
      return;
    }

    if (textures instanceof Array) {
      if (textures.length == 0) {
        return;
      }
      let texture = textures[0];
      if (typeof texture == "string") {
        const fullpath = ResourceManager.getTextureFullPath(texture);
        this.textures.set(key, fullpath);
        return;
      }
      if (texture["path"] != undefined) {
        const fullpath = ResourceManager.getTextureFullPath(texture.path);
        this.textures.set(key, fullpath);
        return;
      }
    }
  }
}
