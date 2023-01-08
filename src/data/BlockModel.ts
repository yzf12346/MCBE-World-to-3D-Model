import {join, parse} from "path";
import TextureManager from "../manager/TextureManager";
import vec3 from "../tsm/src/vec3";
import Constants from "../utils/Constants";
import JsonReader from "../utils/JsonReader";

/**
 * 基础类型
 */
type FACE_CLS = {
  uv: [number, number, number, number],
  texture: string | undefined
} | undefined;

/**
 * 方块盒装uv
 */
export interface BlockModelUV {
  down: FACE_CLS;
  up: FACE_CLS;
  west: FACE_CLS;
  east: FACE_CLS;
  north: FACE_CLS;
  south: FACE_CLS;
}
export class BlockModelCube {
  from: vec3;
  to: vec3;

  faces: BlockModelUV;
}

/**
 * 方块模型
 */
export default class BlockModel {
  path: string;
  name: string;
  elements: BlockModelCube[] = [];
  parent:BlockModel = undefined;

  /**
   * 加载一个BlockModel对象
   * @param filepath 文件的路径
   */
  public constructor(filepath: string) {
    let raw = JsonReader.readFile(filepath);
    this.path = filepath;
    this.name = parse(filepath).name;

    // 如果此模型继承于其他模型
    // 先加载其他模型
    // 然后将elements复制到这个模型下面
    if (raw.parent) {
      let parentName = (raw.parent as string).replace(/^(minecraft:)*block\//g, "");
      let parentPath = join(Constants.RESOURCE_DIR, "models/block", parentName + ".json");

      let parent = new BlockModel(parentPath);

      parent.elements.forEach(cube => {
        this.elements.push(cube);
      });

      this.parent = parent;
    }

    // 判空防止报错
    this.loadCubes(raw.elements ?? []);
    this.loadTextures(raw.textures ?? []);
  }

  private loadCubes(cubes: any[]) {
    // 加载所有elements
    // 这里简称为Cube
    cubes.forEach(cube => {
      let element = new BlockModelCube();
      element.from = new vec3(cube.from);
      element.to = new vec3(cube.to);
      Object.values(cube.faces).forEach((value:FACE_CLS)=>{
        value.uv = value.uv??[0,0,16,16];
      });
      element.faces = cube.faces;
      this.elements.push(element);
    });
  }

  /**
   * 加载贴图
   * @param texture 模型文件的textures属性
   */
  private loadTextures(textures: {[index: string]: string}) {
    // 遍历所有的贴图替换名
    // 然后遍历所有cube
    // 将所有匹配的cube贴图替换成textureName
    Object.entries(textures).forEach(([k, v]) => {
//      console.log(k, v);

      let textureName = v.replace(/^(minecraft:)*block\//g, "");

      this.elements.forEach(cube => {
        Object.values(cube.faces).forEach(face => {
          if (face.texture == "#" + k) {
            face.texture = textureName;
          }
        });
      });
    });
  }

  public hasParent(name:string){
    let model = this.parent;
    while (model.parent != undefined){
      if (model.name == name){
        return true;
      }
      model = model.parent;
    }
    return false;
  }

  public getParents(){

  }
}
