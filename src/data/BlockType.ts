import {parse} from "path";
import vec3 from "../tsm/src/vec3";
import JsonReader from "../utils/JsonReader";

interface BlockVariantJson {
  model?: string;
  x?: number;
  y?: number;
  z?: number;
}

interface BlockVariantListJson {
  variants: {
    [index: string]: BlockVariantJson | BlockVariantJson[];
  }
}

export default class BlockType {
  public blockName: string;

  private variantsRawJson: BlockVariantListJson;
  
  public constructor(statePath: string) {
    try {
      this.variantsRawJson = JsonReader.readFile(statePath);
      this.blockName = parse(statePath).name;
    }
    catch (e) {}
  }

  /**
   * 获取变种
   * @param states 从BlockStates.getXXXState获取
   */
  public getVariant(states:string):BlockVariantJson|undefined{
    let variants = this.variantsRawJson.variants[states];
    // 判断变种是否为数组
    // 则返回随机
    if (variants instanceof Array){
      return variants[Math.floor(Math.random() * variants.length)];
    }
    return variants;
  }
}
