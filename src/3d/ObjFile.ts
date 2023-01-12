import {openSync, writeFileSync} from "fs"
import ModelManager, {BlockModel, BlockModelUV} from "../manager/ModelManager";
import TextureManager from "../manager/TextureManager";
import vec2 from "../tsm/src/vec2";
import vec3 from "../tsm/src/vec3";
import round from "../utils/NumberUtils";
import {hpVec2_2str, string2vec, vec2string} from "../utils/VecString";

export class ObjFaceParam {
  vertexs: vec3[] = [];
  textureVertexs: vec2[] = [];
  texture: string;
  reverse: boolean = false;
}

class ObjFace {
  vertexs: number[] = [];
  textureVertexs: number[] = [];
  normals: number[] = [];
}

export class ObjCubeParam {
  static readonly NO_UV = -114514;

  origin: vec3;
  begin: vec3;
  end: vec3;
  rotation: vec3;
  faces: BlockModelUV;
  noUV: boolean = false;

  public constructor(
    begin: vec3 = vec3.zero,
    end: vec3 = vec3.one,
    rot: vec3 = vec3.zero,
    origin: vec3 = undefined,
    fce: BlockModelUV | number = undefined) {

    this.begin = begin;
    this.rotation = rot;
    this.end = end;
    if (fce == ObjCubeParam.NO_UV) {
      this.noUV = true;
    } else {
      this.faces = <BlockModelUV>fce;
    }
    if (origin == undefined) {
      // origin = begin + (end - begin) * 0.5
      this.origin = this.begin.copy().add(
        this.end.copy().subtract(this.begin.copy()).scale(0.5));
    }
    else {
      this.origin = origin;
    }
    //console.log(this.origin);

  }
}

export default class ObjFile {
  private vertexs = new Map<string, number>();
  private textureVertexs = new Map<string, number>();
  private normals = new Map<string, number>();
  private faces = new Array<ObjFace>();
  /**
   * 添加一个顶点
   * @param pos 顶点的位置
   * @returns 返回顶点的索引
   */
  public addVertex(pos: vec3): number {
    let str = vec2string(pos);

    if (this.vertexs.has(str)) {
      return this.vertexs.get(str);
    }

    this.vertexs.set(str, this.vertexs.size);
    return this.vertexs.size - 1;
  }

  /**
   * 添加一个贴图顶点
   * @param pos 顶点的值
   * @returns 返回顶点的索引
   */
  public addTextureVertex(pos: vec2): number {
    let str = hpVec2_2str(pos);
    if (this.textureVertexs.has(str)) {
      return this.textureVertexs.get(str);
    }
    this.textureVertexs.set(str, this.textureVertexs.size);
    return this.textureVertexs.size - 1;
  }

  /**
   * 添加一个法向
   * @param normal 法向
   * @returns 法向的索引
   */
  public addNormal(normal: vec3): number {
    let str = vec2string(normal);
    if (this.normals.has(str)) {
      return this.normals.get(str);
    }
    this.normals.set(str, this.normals.size);
    return this.normals.size - 1;
  }

  /**
   * 添加一个面
   */
  public add4Face(face: ObjFaceParam) {
    let face1 = new ObjFace();
    let face2 = new ObjFace();

    if (face.reverse) {
      let temp = face.vertexs[1];
      face.vertexs[1] = face.vertexs[3];
      face.vertexs[3] = temp;

      let temp_ = face.textureVertexs[1];
      face.textureVertexs[1] = face.textureVertexs[3];
      face.textureVertexs[3] = temp_;
    }

    face1.vertexs = [
      this.addVertex(face.vertexs[0]),
      this.addVertex(face.vertexs[1]),
      this.addVertex(face.vertexs[2])
    ];
    face1.textureVertexs = [
      this.addTextureVertex(face.textureVertexs[0]),
      this.addTextureVertex(face.textureVertexs[1]),
      this.addTextureVertex(face.textureVertexs[2])
    ];
    face1.normals = this.calcNormal(
      face.vertexs[0],
      face.vertexs[1],
      face.vertexs[2]);

    face2.vertexs = [
      this.addVertex(face.vertexs[2]),
      this.addVertex(face.vertexs[3]),
      this.addVertex(face.vertexs[0])
    ];
    face2.textureVertexs = [
      this.addTextureVertex(face.textureVertexs[2]),
      this.addTextureVertex(face.textureVertexs[3]),
      this.addTextureVertex(face.textureVertexs[0])
    ];
    face2.normals = this.calcNormal(
      face.vertexs[2],
      face.vertexs[3],
      face.vertexs[0]);
    this.faces.push(face1, face2);
  }

  private calcNormal(v1: vec3, v2: vec3, v3: vec3): [number, number, number] {
    let na = (v2.y - v1.y) * (v3.z - v1.z) - (v2.z - v1.z) * (v3.y - v1.y);
    let nb = (v2.z - v1.z) * (v3.x - v1.x) - (v2.x - v1.x) * (v3.z - v1.z);
    let nc = (v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x);
    let normalindex = this.addNormal(new vec3([na, nb, nc]));
    return [normalindex, normalindex, normalindex];
  }

  /**
   * 添加一个立方体
   */
  public addCube(cube: ObjCubeParam) {
    // 这个函数就是一个屎山💩
    // 具体原理:
    //
    // 将6个面每个面都应用旋转矩阵放到模型里
    let mn = new vec3([
      Math.min(cube.begin.x, cube.end.x),
      Math.min(cube.begin.y, cube.end.y),
      Math.min(cube.begin.z, cube.end.z)
    ]);

    let mx = new vec3([
      Math.max(cube.begin.x, cube.end.x),
      Math.max(cube.begin.y, cube.end.y),
      Math.max(cube.begin.z, cube.end.z)
    ]);

    let southF = new ObjFaceParam();
    // 翻转面方向
    southF.reverse = true;
    southF.vertexs = [
      applyRotation(
        cube.origin, new vec3([mn.x, mn.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mn.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mx.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mx.y, mn.z]), cube.rotation)
    ];
    if (cube.faces?.south != undefined) {
      southF.textureVertexs = TextureManager.getUvs(
        cube.faces.south.texture, cube.faces.south.uv);

      this.add4Face(southF);
    }


    southF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];
    if (cube.noUV) {
      this.add4Face(southF);
    }

    let northF = new ObjFaceParam();
    northF.vertexs = [
      applyRotation(
        cube.origin, new vec3([mn.x, mn.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mn.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mx.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mx.y, mx.z]), cube.rotation)
    ];
    northF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];

    if (cube.faces?.north != undefined) {
      northF.textureVertexs = TextureManager.getUvs(
        cube.faces.north.texture, cube.faces.north.uv);

      this.add4Face(northF);
    }
    if (cube.noUV) {
      this.add4Face(northF);
    }

    let eastF = new ObjFaceParam();
    // 翻转面方向
    eastF.reverse = true;
    eastF.vertexs = [
      applyRotation(
        cube.origin, new vec3([mx.x, mn.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mn.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mx.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mx.y, mn.z]), cube.rotation)
    ];
    eastF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];
    if (cube.faces?.east != undefined) {
      eastF.textureVertexs = TextureManager.getUvs(
        cube.faces.east.texture, cube.faces.east.uv);

      this.add4Face(eastF);
    }
    if (cube.noUV) {
      this.add4Face(eastF);
    }

    let westF = new ObjFaceParam();
    westF.vertexs = [
      applyRotation(
        cube.origin, new vec3([mn.x, mn.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mn.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mx.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mx.y, mn.z]), cube.rotation)
    ];
    westF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];

    if (cube.faces?.west != undefined) {
      westF.textureVertexs = TextureManager.getUvs(
        cube.faces.west.texture, cube.faces.west.uv);

      this.add4Face(westF);
    }
    if (cube.noUV) {
      this.add4Face(westF);
    }

    let upF = new ObjFaceParam();
    upF.vertexs = [
      applyRotation(
        cube.origin, new vec3([mn.x, mx.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mx.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mx.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mx.y, mn.z]), cube.rotation)
    ];
    upF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];

    if (cube.faces?.up != undefined) {
      upF.textureVertexs = TextureManager.getUvs(
        cube.faces.up.texture, cube.faces.up.uv, true);

      this.add4Face(upF);
    }

    if (cube.noUV) {
      this.add4Face(upF);
    }

    /*  console.log(TextureManager.getRegion(cube.faces.up.texture).uv);
      console.log(cube.faces.up.uv);
      console.log(TextureManager.getUvs(cube.faces.up.texture, cube.faces.up.uv));
      
      console.log();*/



    let bottomF = new ObjFaceParam();
    // 翻转面方向
    bottomF.reverse = true;
    bottomF.vertexs = [
      applyRotation(
        cube.origin, new vec3([mn.x, mn.y, mn.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mn.x, mn.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mn.y, mx.z]), cube.rotation),
      applyRotation(
        cube.origin, new vec3([mx.x, mn.y, mn.z]), cube.rotation)
    ];
    bottomF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];

    //console.log(cube.faces);

    if (cube.faces?.down != undefined) {
      bottomF.textureVertexs = TextureManager.getUvs(
        cube.faces.down.texture, cube.faces.down.uv, true);

      this.add4Face(bottomF);
    }

    if (cube.noUV) {
      this.add4Face(bottomF);
    }
  }

  public drawModel(model: BlockModel,
    offset: vec3 = vec3.zero,
    center: vec3 = vec3.zero,
    rot: vec3 = vec3.zero) {
    model.elements.forEach(ele => {

      let cube = new ObjCubeParam(
        ele.from.copy().scale(1 / 16).add(offset),
        ele.to.copy().scale(1 / 16).add(offset),
        rot,
        center,
        ele.faces
      );
      this.addCube(cube);
    });
  }

  /**
   * 保存所有顶点
   */
  private saveVertexs(handel: number) {


    const info =
      `# ===================
# ===== Vertexs =====
# ===================\n`;
    writeFileSync(handel, info);

    let arr = Array.from(this.vertexs);
    arr = arr.sort((a, b) => {return a[1] - b[1];});

    arr.forEach(value => {
      let pos = string2vec(value[0]) as vec3;

      writeFileSync(handel,
        `v ${vec2string(pos)}\n`);
    });
  }

  /**
   * 保存所有贴图顶点
   */
  private saveTextureVertexs(handel: number) {
    let arr = Array.from(this.textureVertexs);
    arr = arr.sort((a, b) => {return a[1] - b[1];});

    const info =
      `# ===========================
# ===== Texture Vertexs =====
# ===========================\n`;
    writeFileSync(handel, info);

    arr.forEach(value => {
      let pos = string2vec(value[0]) as vec2;
      writeFileSync(handel,
        `vt ${hpVec2_2str(pos)}\n`);
    });
  }

  /**
   * 保存所有的顶点法向
   * @param handle 文件的句柄
   */
  private saveVertexsNormal(handle: number) {
    let arr = Array.from(this.normals);
    arr = arr.sort((a, b) => {return a[1] - b[1];});

    const info =
      `# ===========================
# ===== Vertex Normals =====
# ===========================\n`;
    writeFileSync(handle, info);

    arr.forEach(value => {
      let pos = string2vec(value[0]) as vec3;
      writeFileSync(handle,
        `vn ${vec2string(pos)}\n`);
    });
  }

  /**
   * 保存所有面
   */
  private saveFaces(handle: number) {
    let file = file_(handle);
    let faceset = new Set<string>();

    for (let face of this.faces) {
      let faceStr = "f";
      for (let i = 0; i < face.vertexs.length; i++) {
        let vt = face.textureVertexs[i] + 1;
        let v = face.vertexs[i] + 1;
        let vn = face.normals[i] + 1;

        faceStr += ` ${v}/${vt}/${vn}`;
      }

      // 去重
      if (faceset.has(faceStr)) {
        continue;
      }
      faceset.add(faceStr);
      file.write(faceStr);
    }
  }

  public save(path: string) {
    const handel = openSync(path, "w");

    let file = file_(handel);

    file
      .write("# author : yzf12346")
      .write("# e-mail : yuzhifeng173@outlook.com")
      .write("# QQ     : 2998127301")
      .write("# github : https://github.com/yzf12346/MCBE-World-to-3D-Model")
      .write("");

    this.saveVertexs(handel);
    this.saveTextureVertexs(handel);
    this.saveVertexsNormal(handel);
    this.saveFaces(handel);
  }
}

function file_(handle: number) {
  let obj = {
    write: function (line: string) {
      writeFileSync(handle, line + "\n");
      return obj;
    }
  }
  return obj;
}

const ARC_TO_DEG_NUMBER = 0.017453292519943295;
/**
 * 应用旋转
 */
function applyRotation(center: vec3, pos: vec3, rot: vec3) {
  let quat_ = new vec3([
    ARC_TO_DEG_NUMBER * rot.x,
    ARC_TO_DEG_NUMBER * rot.y,
    ARC_TO_DEG_NUMBER * rot.z
  ]).toQuat();
  let result = pos.copy().subtract(center)
    .multiplyByQuat(quat_)
    .add(center);
  let v = new vec3([
    round(result.x, 2),
    round(result.y, 2),
    round(result.z, 2)
  ]);
  return v;
}
