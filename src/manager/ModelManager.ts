import {readdirSync} from "fs";
import {join, parse} from "path";
import BlockModel from "../data/BlockModel";
import Constants from "../utils/Constants";
import {isDirectory} from "../utils/FileUtils";

export default class ModelManager {
  private static models = new Map<string, BlockModel>();
  private static modelDir;

  public static init() {
    this.modelDir = join(Constants.RESOURCE_DIR, "models/block");

    if (!isDirectory(this.modelDir)) {
      throw new Error("模型文件夹缺失 : " + this.modelDir);
    }

    /*
     * readdirSync(modelDir).forEach(name => {
      let fullpath = join(modelDir, name);
      let model = new BlockModel(fullpath);

      this.models.set(model.name,model);
    });
    */
  }

  public static getModel(name:string){
    if (!this.models.has(name)){
      let fullpath = join(this.modelDir,name+".json");
      let model = new BlockModel(fullpath);
      this.models.set(model.name, model);
    }
    return this.models.get(name);
  }
  
}
