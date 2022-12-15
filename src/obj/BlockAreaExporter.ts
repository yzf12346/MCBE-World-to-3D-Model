import OptifinePartModel, {OptifinePartBox, OptifinePartUV} from "../minecraft/model/OptifinePartModel";
import Block from "../minecraft/world/Block";
import BlockArea from "../minecraft/world/BlockArea";
import vec2 from "../tsm/vec2";
import vec3 from "../tsm/vec3";
import ObjFile from "./ObjFile";

export namespace BlockAreaExport {

  export interface DrawCubeParam {
    cube: OptifinePartBox;
    model: OptifinePartModel;
    area: BlockArea;
    translates: Translate[];
    objFile: ObjFile;
  }

  export interface Translate {
    rotation: vec3;
    pivot: vec3;
  }
}
export default class BlockAreaExporter {

  // 生成导出的Obj文件
  public static exportObjFile(area: BlockArea): ObjFile {
    let obj = new ObjFile();

    /*area.forEachBlocks((pos, blk) => {
       this.drawBlock(obj, blk, area);
     });
    */



    this.drawFace([
      new vec3([-0.5, 0, -0.5]),
      new vec3([-0.5, 0, 0.5]),
      new vec3([0.5, 0, 0.5]),
      new vec3([0.5, 0, -0.5])
    ], [
      vec2.zero, vec2.zero, vec2.zero, vec2.zero
    ],
      [
        {
          rotation: new vec3([45, 0, 0]),
          pivot: new vec3([0, 0, 0])
        }
      ], obj);
    return obj;
  }

  public static drawBlock(obj: ObjFile, block: Block, area: BlockArea) {
    let model = block.type.model;

    model.boxes.forEach(box => {
      const param: BlockAreaExport.DrawCubeParam = {
        cube: box,
        model: model,
        area: area,
        translates: [
          {
            rotation: vec3.zero,
            pivot: vec3.zero
          }
        ],
        objFile: obj
      };
      this.drawCube(param);
    });
  }

  /**
   * 绘制块
   */
  public static drawCube(param: BlockAreaExport.DrawCubeParam) {
    let obj = param.objFile;

    let v1 = param.cube.from;
    let v2 = param.cube.to;

    let translates = param.translates;
    translates.push({
      pivot: new vec3([8, 0, 8]),
      rotation: param.cube.rotation
    });
  }

  private static drawFace(vs: vec3[], tvs: vec2[], translates: BlockAreaExport.Translate[], objFile: ObjFile) {
    let rotatedVs = [...vs];
    translates.reverse().forEach(trans => {
      vs.forEach((v) => {
        v = this.applyTranslate(v, trans);
      });
    });
    objFile.addFace(vs, tvs);
  }

  private static applyTranslate(v: vec3, translate: BlockAreaExport.Translate) {
    // 平移至相对原点
    let v1 = v.subtract(translate.pivot);
    // 角度转弧度
    let arc = new vec3([
      translate.rotation.x != 0 ? translate.rotation.x * Math.PI / 180 : 0,
      translate.rotation.y != 0 ? translate.rotation.y * Math.PI / 180 : 0,
      translate.rotation.z != 0 ? translate.rotation.z * Math.PI / 180 : 0
    ]);
    // 应用旋转
    let v2 = v1.multiplyByQuat(arc.toQuat());
    // 平移回原坐标
    let v3 = v2.subtract(translate.pivot);
    return v3;
  }
  //public static exportFbxFile():
}
