import {readFileSync} from "fs";
import {Config} from "../../utils/Config";
import ResourceManager from "./ResourceManager";


export default class TextureManager {
  private static textures = new Map<string, string>();

  /** 
   * 根据别名获取贴图
   * @param 贴图的别名 如:grass_side
   * @returns 贴图的绝对路径
   */
  static getTexture(alias: string): string | undefined {
    return this.textures.get(alias);
  }
  /**
   * 初始化贴图管理器
   */
  static init(): void {
    this.readTerrianJson(Config.terrianTextureJsonPath);
  }
  /**
   * 解析方块贴图
   * @description 注意文件不能包含注释
   * @param jsonPath path/to/terrian_texture.json
   */
  private static readTerrianJson(jsonPath: string) {
    let strNoCommits = readFileSync(jsonPath).toString();
    try {
      let data = JSON.parse(strNoCommits)["texture_data"];

      Object.keys(data).forEach((key) => {
        let value = data[key];
        this.readTexture(key, value);
      });
    } catch (err) {
      console.error("TextureManager.readTerrianJson 文件解析错误");
      throw err;
    }
  }
  private static readTexture(key: string, value: any) {
    /**
     * textures = [{
     *   path:"texture_path",
     *   ...
     * }]
     * ==== OR ====
     * textures = [
     *   "texture_path1",
     *   ...
     * ]
     * ==== OR ====
     * textures = "texture_path"
     */
    let textures = value["textures"];

    if (typeof textures == "string") {
      const fullpath = ResourceManager.getTextureFullPath(textures);
      this.textures.set(key, fullpath);
      return;
    }

    /**
     * 如果节点类型为数组
     * textures = [
     *   "texture_path1",
     *   ...
     * ]
     * ==== OR ====
     * textures = [
     *   {
     *     path:"texture_path"
     *   }
     * ]
     */
    if (textures instanceof Array) {
      if (textures.length == 0) {
        return;
      }
      // texture = "texture_path"
      // ==== OR ====
      // texture = {
      //   path:"texture_path",...
      // }
      let texture = textures[0];
      if (typeof texture == "string") {
        const fullpath = ResourceManager.getTextureFullPath(texture);
        this.textures.set(key, fullpath);
        return;
      }
      // 判断texture是否有path属性
      if (texture["path"] != undefined) {
        const fullpath = ResourceManager.getTextureFullPath(texture.path);
        this.textures.set(key, fullpath);
        return;
      }
    }
  }
}
