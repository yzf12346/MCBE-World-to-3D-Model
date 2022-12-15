import {readFileSync} from "fs";
import {Config} from "../../utils/Config";
import OptifinePartModel from "../model/OptifinePartModel";
import OptifinePartManager from "./OptifinePartManager";

export default class ModelConfigManager {
  private static defaultModel: string;
  private static defaultCulling: boolean;
  private static mapping = new Map<string, string>();
  private static culling = new Map<string, boolean>();
  public static init() {
    let data = readFileSync(Config.blockModelMappingPath).toString();
    let json = JSON.parse(data);

    Object.keys(json).forEach(key => {
      let model = json[key].model;
      if (key == "*") {
        this.defaultModel = model;
        this.defaultCulling = json[key].face_culling;
        return;
      }
      this.mapping.set(key, model);
      this.culling.set(key, json[key].face_culling);
    });
  }

  public static getModel(blockName: string): OptifinePartModel {
    let name = this.mapping.get(blockName) ?? this.defaultModel;
    return OptifinePartManager.getModel(name);
  }

  /**
   * 获取方块是否剔除
   */
  public static getIsCulling(blockname: string) {
    return this.culling.get(blockname) ?? this.defaultCulling;
  }
}
