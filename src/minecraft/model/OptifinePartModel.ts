import {readFileSync} from "fs";
import {readFile} from "fs/promises";
import path from "path";
import vec2 from "../../tsm/vec2";
import vec3 from "../../tsm/vec3";

export class OptifinePartBox {
  id: string = undefined;
  from: vec3 = undefined;
  to: vec3 = undefined;
  rotation:vec3 = undefined;
}

export default class OptifinePartModel {
  private _textureSize: vec2 = vec2.zero;
  private _identifier: string = undefined;
  private _boxes: OptifinePartBox[] = [];

  get textureSize():vec2{
    return this._textureSize.copy();
  }

  get identifier():string{
    return this._identifier + "";
  }

  get boxes():OptifinePartBox[]{
    return this._boxes;
  }

  public static loadModel(path_: string): OptifinePartModel {
    const model = this.parseModel(JSON.parse(readFileSync(path_).toString()));

    model._identifier = path.parse(path_).name;
    return model;
  }
  /**
   * 解析Boxes
   */
  private static parseBoxes(json: any[]): OptifinePartBox[] {
    // 如果json等于undefined返回空
    if (json == undefined) {
      return [];
    }
    let result = [];

    for (let box of json) {
      let pb = new OptifinePartBox();
      
      // 将Optifine part坐标转换为Blockbench坐标
      let x1 = -box.coordinates[0] - box.coordinates[3];
      let y1 = -box.coordinates[1] - box.coordinates[4];
      let z1 = box.coordinates[2];
      let x2 = -box.coordinates[0];
      let y2 = -box.coordinates[1];
      let z2 = box.coordinates[2] + box.coordinates[5];

      pb.id = Math.random().toFixed(10);
      pb.from = new vec3([x1, y1, z1]);
      pb.to = new vec3([x2, y2, z2]);
      pb.rotation = vec3.zero;
      result.push(pb);
    }

    return result;
  }
  /**
   * 解析模型
   * @param json 应为xxx.jpm文件内容
   */
  public static parseModel(json: any): OptifinePartModel {
    const model = new OptifinePartModel();
    model._textureSize = new vec2([
      json.textureSize[0],
      json.textureSize[1]
    ]);

    model._boxes.push(...this.parseBoxes(json.boxes));
    
    // 解析submodels
    for (let submodel of json.submodels?json.submodels:[]){
      let rotation = new vec3(submodel.rotate);
      let boxes = this.parseBoxes(submodel.boxes);

      // 解析box的rotation
      // 并将box添加到_boxes
      boxes.forEach(v=>{
        v.rotation = rotation;
        model._boxes.push(v);
      });
    }
    return model;
  }
}
