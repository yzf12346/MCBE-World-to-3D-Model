import { readFileSync } from "fs";
import {Config} from "../../utils/Config";
import OptifinePartModel from "../model/OptifinePartModel";
import OptifinePartManager from "./OptifinePartManager";

export default class BlockMappingManager{
  private static defaultModel:string;
  private static mapping = new Map<string,string>();
  public static init(){
    let data = readFileSync(Config.blockModelMappingPath).toString();
    let json = JSON.parse(data);

    Object.keys(json).forEach(key=>{
      let model = json[key].model;
      if (key == "*"){
        this.defaultModel = model;
        return;
      }
      this.mapping.set(key, model);
    });
  }

  public static queryModel(blockName:string):OptifinePartModel{
    let name = this.mapping.get(blockName)??this.defaultModel;
    return OptifinePartManager.getModel(name);
  }
}
