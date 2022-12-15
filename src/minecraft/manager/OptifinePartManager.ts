import { readdirSync } from "fs";
import path from "path";
import {Config} from "../../utils/Config";
import OptifinePartModel from "../model/OptifinePartModel";

export default class OptifinePartManager{
  private static models = new Map<string,OptifinePartModel>();


  /**
   * 初始化模型列表
   */
  public static init(){
    let dir = readdirSync(Config.blockModelsPath);

    for (let file of dir){
      if (file.endsWith(".jpm")){
        let fullpath = path.join(Config.blockModelsPath,file);
        let model = OptifinePartModel.loadModel(fullpath);
        this.models.set(model.identifier, model);
      }
    }
  }

  
  public static getModel(id:string){
    return this.models.get(id);
  }
}
