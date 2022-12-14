import BlockType, {BlockTexture} from "../world/BlockType";
import {readFileSync} from "fs";
import {Config} from "../../utils/Config";
import TextureManager from "./TextureManager";
import ResourceManager from "./ResourceManager";
export default class BlockManager {
  private static blocks = new Map<string, BlockType>();

  static getBlock(identifier: string): BlockType | undefined {
    return this.blocks.get(identifier);
  }

  static init(): void {
    this.readBlocksJson(Config.blockJsonPath);
  }

  private static bindSideTexture(bt: BlockTexture, textureName: string) {
    // 如果哪个面没有被贴图则贴图
    if (bt.east == "") {
      bt.east = textureName;
    }
    if (bt.north == "") {
      bt.north = textureName;
    }
    if (bt.west == "") {
      bt.west = textureName;
    }
    if (bt.south == "") {
      bt.south = textureName;
    }
  }

  private static readTexture(blk: BlockType, textureJson: any) {
    // 初始化
    blk.textures = {
      up: "",
      down: "",
      east: "",
      west: "",
      north: "",
      south: ""
    };

    // 如果textures属性为字符串
    // 将所有面设为该值
    if (typeof textureJson == "string") {
      // 获取贴图的路径
      console.log(textureJson);      
      let texturePath = TextureManager.getTexture(textureJson);
      blk.textures = {
        up: texturePath,
        down: texturePath,
        east: texturePath,
        west: texturePath,
        north: texturePath,
        south: texturePath
      };
      return;
    }
    // 如果textures属性为Object
    if (textureJson instanceof Object) {
      Object.keys(textureJson).forEach(face => {
        let texturePath = TextureManager.getTexture(textureJson[face]);
        if (face != "side") {
          blk.textures[face] = texturePath;
          return;
        } else {
          this.bindSideTexture(blk.textures, texturePath);
        }
      });
    }
    // 
  }

  // =======示例=======
  //  {
  //    "block":{
  //       "textures":{
  //         "up"?:str,
  //         "down"?:str,
  //         "east"?:str,
  //         "west"?:str,
  //         "north"?:str,
  //         "south"?:str,
  //         "side"?:str
  //       }|str
  //    },
  //    ......
  //  }
  private static readBlocksJson(jsonPath: string) {
    let strNoCommits = readFileSync(jsonPath).toString();
    //strNoCommits = strNoCommits.replace(/\/\/[^\n*]/g,"").replace(/\/\*(\s|.)*?\*\//g,"");

    let data = JSON.parse(strNoCommits);
    // 遍历所有方块
    Object.keys(data).forEach((key) => {
      // 跳过format_version
      if (key == "format_version") {
        return;
      }
      // 创建方块类型并放入Map
      const type_ = new BlockType();
      type_.identifier = key;
      this.blocks.set(key, type_);

      // 获取方块的贴图
      const value = data[key];
      const texture = value["textures"];

      // 如果方块没有贴图属性则返回
      // 如 air
      if (texture == undefined) {
        type_.visible = false;
        return;
      }
      // 读取textures
      this.readTexture(type_, texture);
    });
  }
}
