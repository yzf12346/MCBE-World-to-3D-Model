import {join, parse} from "path";
import vec3 from "../tsm/src/vec3";
import Constants from "../utils/Constants";
import JsonReader from "../utils/JsonReader";

interface Face {
  uv: [number, number, number, number];
  texture: string;
}

export interface BlockModelUV {

  north: Face | undefined;
  south: Face | undefined;
  east: Face | undefined;
  west: Face | undefined;
  up: Face | undefined;
  down: Face | undefined;
}

export interface BlockModelCube {
  from: vec3;
  to: vec3;

  faces: BlockModelUV;
}

export class BlockModel {
  public elements: BlockModelCube[];

  public name: string;
  public path: string;
  public parent: BlockModel = undefined;

  public constructor(path: string) {
    let json = JsonReader.readFile(path);

    this.path = path;
    this.name = parse(path).name;

    this.elements = [];
    if (json.parent) {
      let parentname = (json.parent as string).replace(/^(minecraft:)*block\//g, "");

      this.parent = ModelManager.getModel(parentname);

      for (let ele of this.parent.elements) {
        this.elements.push({
          from: ele.from.copy(),
          to: ele.to.copy(),
          faces: JSON.parse(JSON.stringify(ele.faces))
        });
      }
    }

    this.loadElements(json.elements ?? []);
    Object.keys(json.textures ?? {}).forEach(old_ => {
      this.updateTextures(old_, json.textures[old_]);
    });
  }

  /**
   * 加载模型 elements
   * @param _elems json.elements
   */
  private loadElements(_elems: any[]) {
    // 遍历所有element
    _elems.forEach(elem => {
      let cube: BlockModelCube = {
        from: new vec3(elem.from ?? [0, 0, 0]),
        to: new vec3(elem.to ?? [1, 1, 1]),
        faces: undefined
      };
      cube.faces = {} as any;
      Object.keys(elem.faces ?? {}).forEach((key) => {
        let face = elem.faces[key];
        cube.faces[key] = {
          texture: face.texture,
          uv: face.uv ?? [0, 0, 16, 16]
        };
      });
      this.elements.push(cube);
    });
  }

  /**
   * 更新贴图
   * @param old 原名称
   * @param new_ 新值
   */
  private updateTextures(old: string, new_: string) {
    this.elements.forEach(elem => {
      Object.values(elem.faces).forEach(face => {
        if (face.texture == "#" + old) {
          face.texture = new_.replace(/^(minecraft:)*block\//, "");
        }
      });
    });
  }
}

export default class ModelManager {
  private static models = new Map<string, BlockModel>();

  public static getModel(name: string) {
    if (this.models.has(name)) {
      return this.models.get(name);
    }
    let fullpath = join(Constants.RESOURCE_DIR, "models/block", name + ".json");
    let model = new BlockModel(fullpath);
    this.models.set(name, model);
    return model;
  }
}
