import {log} from "console";
import path from "path"
import {Config} from "../../utils/Config"

export default class ResourceManager {
  /**
   * 获取贴图的完整路径
   * @param file 需要以textures/开头
   */
  public static getTextureFullPath(file: string) {
    let basePath = Config.texturePath;
    if (basePath.endsWith("/")) {
      basePath = basePath.slice(0, basePath.length - 1);
     // log(basePath)
    }
    return file.replace(/^textures/g, basePath).replace(/(.png)*$/g, ".png");
  }
}
