import {log} from "console";
import vec3 from "../tsm/vec3";
import {openSync, writeFileSync} from "fs";
import vec2 from "../tsm/vec2";
/**
 * 工具函数:将string转为vec3
 */
function parseV3(str: string): vec3 {
  let value = str.split(" ");
  return new vec3(
    [
      Number(value[0]),
      Number(value[1]),
      Number(value[2])
    ]
  )
}

/**
 * 工具函数:将vec3转为string
 */
function strV3(vt: vec3): string {
  return vt.x + " " + vt.y + " " + vt.z;
}

/**
 * 工具函数:将string转为vec2
 */
function parseV2(str: string): vec2 {
  let value = str.split(" ");
  return new vec2(
    [
      Number(value[0]),
      Number(value[1])
    ]
  )
}

/**
 * 工具函数:将vec2转为string
 */
function strV2(vt: vec2): string {
  return vt.x + " " + vt.y;
}
export interface ObjFileFace {
  // 顶点索引
  vertexs: number[];
  textureVertexs:number[];
  // uv
  uv: number[];
}

export default class ObjFile {
  public vertexs = new Map<string, number>();
  public textureVertexs = new Map<string, number>();
  public faces = new Array<ObjFileFace>();
  /**
   * 添加一个顶点
   * @param vt 添加的顶点
   * @returns 顶点的索引
   */
  public addVertex(vt: vec3): number {
    // 保证顶点的唯一性
    let str = strV3(vt);
    if (this.vertexs.has(str)) {
      return this.vertexs.get(str);
    }
    this.vertexs.set(strV3(vt), this.vertexs.size);
    return this.vertexs.size - 1;
  }

  /** 
   * 添加一个纹理顶点
   * @param tv 添加的顶点
   * @returns 顶点的索引
   */
  public addTextureVertex(tv: vec2): number {
    let str = strV2(tv);
    if (this.textureVertexs.has(str)) {
      return this.textureVertexs.get(str);
    }
    this.textureVertexs.set(strV2(tv), this.textureVertexs.size);
    return this.textureVertexs.size - 1;
  }
  /**
   * 添加面
   */
  public addFace(vts: vec3[], uvs: vec2[]): ObjFileFace {
    let indexs = [];
    let uvIndexs = [];
   /* if (vts.length != 3) {
      throw new Error("模型的顶点长度不为3");
    }*/
    // 保证每个坐标只有一个顶点
    vts.forEach((vt, i) => {
      indexs.push(this.addVertex(vt));
      uvIndexs.push(this.addTextureVertex(uvs[i]));
    });

    let face: ObjFileFace = {
      vertexs: indexs,
      textureVertexs:uvIndexs,
      uv: uvIndexs
    };
    this.faces.push(face);
    return face;
  }
  /**
   * 写入顶点信息
   * @param file 文件的句柄 openSync
   */
  private writeVertexs(file: number) {

    // map根据索引排序
    let array = Array.from(this.vertexs);
    array.sort((a, b) => {
      return a[1] - b[1];
    });
    // 遍历写入文件
    array.forEach(v => {
      let vt = parseV3(v[0]);
      writeFileSync(file, `v ${vt.x.toFixed(3)} ${vt.y.toFixed(3)} ${vt.z.toFixed(3)}\n`);
    });
  }
  /**
   * 写入面信息
   * @param file 文件的句柄
   */
  private writeFaces(file: number) {
    this.faces.forEach(face => {
      writeFileSync(file,`f ${face.vertexs[0]+1} ${face.vertexs[1]+1} ${face.vertexs[2]+1} ${face.vertexs[3]+1}`);
    });
  }
  public writeFile(path: string) {
    let file = openSync(path, "w");
    this.writeVertexs(file);
    this.writeFaces(file);
  }
}
