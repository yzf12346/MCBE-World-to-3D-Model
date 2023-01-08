import {readdirSync} from "fs";
import {join} from "path";
import BlockType from "../data/BlockType";
import Constants from "../utils/Constants";
import {isDirectory} from "../utils/FileUtils";
import ModelManager from "./ModelManager";

const NOT_FULL_BLOCKS = new Set<string>();
const QUERYED_BLOCKS = new Set<string>();

export default class BlockManager{
  private static blockTypes = new Map<string,BlockType>();

  public static init(){
    const blockStatePath = join(Constants.RESOURCE_DIR,"blockstates");

    if (!isDirectory(blockStatePath)){
      throw new Error("方块状态文件夹不存在 : "+blockStatePath);
    }

    readdirSync(blockStatePath).forEach(filename=>{
      let type_ = new BlockType(join(blockStatePath,filename));
      this.blockTypes.set(type_.blockName, type_);      
    });
  }

  public static getBlockType(name:string){
    return this.blockTypes.get(name);
  }

  public static isFullBlock(name:string){
    let model = ModelManager.getModel(name);
    if (QUERYED_BLOCKS.has(name)&&!NOT_FULL_BLOCKS.has(name)){
      return true;
    }
    if (!model.hasParent("cube")){
      NOT_FULL_BLOCKS.add(name);
      return false; 
    }
    QUERYED_BLOCKS.add(name);
    return true;
  }
}
