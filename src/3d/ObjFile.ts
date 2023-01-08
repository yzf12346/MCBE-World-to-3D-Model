import {openSync, unwatchFile, writeFileSync} from "fs";
import BlockArea, {Block} from "../container/BlockArea";
import BlockModel, {BlockModelUV} from "../data/BlockModel";
import ModelManager from "../manager/ModelManager";
import TextureManager from "../manager/TextureManager";
import vec2 from "../tsm/src/vec2";
import vec3 from "../tsm/src/vec3";
import round from "../utils/NumberUtils";
import {string2vec, vec2string} from "../utils/VecString";

export class ObjFaceParam {
  vertexs: vec3[] = [];
  textureVertexs: vec2[] = [];
  texture: string;
}

class ObjFace {
  vertexs: number[] = [];
  textureVertexs: number[] = [];
  texture: string;
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
    let str = vec2string(pos);
    if (this.textureVertexs.has(str)) {
      return this.textureVertexs.get(str);
    }
    this.textureVertexs.set(str, this.textureVertexs.size);
    return this.textureVertexs.size - 1;
  }

  /**
   * 添加一个面
   */
  public addFace(face: ObjFaceParam) {
    let face_ = new ObjFace();
    face.vertexs.forEach(vec => {
      face_.vertexs.push(this.addVertex(vec) + 1);
    });
    face.textureVertexs.forEach(vec => {
      face_.textureVertexs.push(this.addTextureVertex(vec) + 1);
    });
    this.faces.push(face_);
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

      this.addFace(southF);
    }

    southF.textureVertexs = [
      new vec2([0, 0]),
      new vec2([1, 0]),
      new vec2([1, 1]),
      new vec2([0, 1])
    ];
    if (cube.noUV) {
      this.addFace(southF);
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

      this.addFace(northF);
    }
    if (cube.noUV) {
      this.addFace(northF);
    }

    let eastF = new ObjFaceParam();
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

      this.addFace(eastF);
    }
    if (cube.noUV) {
      this.addFace(eastF);
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

      this.addFace(westF);
    }
    if (cube.noUV) {
      this.addFace(westF);
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

      this.addFace(upF);
    }

    if (cube.noUV) {
      this.addFace(upF);
    }

    /*  console.log(TextureManager.getRegion(cube.faces.up.texture).uv);
      console.log(cube.faces.up.uv);
      console.log(TextureManager.getUvs(cube.faces.up.texture, cube.faces.up.uv));
      
      console.log();*/



    let bottomF = new ObjFaceParam();
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

    if (cube.faces?.down != undefined) {
      bottomF.textureVertexs = TextureManager.getUvs(
        cube.faces.down.texture, cube.faces.down.uv, true);

      this.addFace(bottomF);
    }

    if (cube.noUV) {
      this.addFace(bottomF);
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

  public drawArea(area: BlockArea, culling: boolean = true) {
    for (let [pos, blk] of area) {
      let up: Block | undefined = area.getBlock(
        pos.copy().add(new vec3([0, 1, 0])));
      let down: Block | undefined = area.getBlock(
        pos.copy().add(new vec3([0, -1, 0])));

      let east: Block | undefined = area.getBlock(
        pos.copy().add(new vec3([1, 0, 0])));
      let west: Block | undefined = area.getBlock(
        pos.copy().add(new vec3([-1, 0, 0])));

      let north: Block | undefined = area.getBlock(
        pos.copy().add(new vec3([0, 0, 1])));
      let south: Block | undefined = area.getBlock(
        pos.copy().add(new vec3([0, 0, -1])));

      if (culling
        && up?.isFullBlock
        && down?.isFullBlock
        && east?.isFullBlock
        && west?.isFullBlock
        && north?.isFullBlock
        && south?.isFullBlock) {
        continue;
      }

      this.drawBlock(blk, pos);
    }
  }

  public drawBlock(block: Block, position: vec3) {
    let model = ModelManager.getModel(block.name);
    this.drawModel(model, position);
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
        `vt ${vec2string(pos)}\n`);
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
        let vt = face.textureVertexs[i];
        let v = face.vertexs[i];

        faceStr += ` ${v}/${vt}`;
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
