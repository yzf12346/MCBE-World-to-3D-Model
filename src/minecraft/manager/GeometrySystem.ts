import {log} from "console";
import {readFileSync} from "fs";
import vec3 from "../../tsm/vec3";
import vec4 from "../../tsm/vec4";
import Geometry, {CubeUv, GeometryCube, GeometryGroup} from "../model/Geometry";

export default class GeometrySystem {

  private static readDescription(geo: Geometry, desc: any) {
    geo.identifier = desc.identifier;
    geo.textureWidth = desc.texture_width;
    geo.textureHeight = desc.texture_height;
  }
  private static readBones(geo: Geometry, bones: any[]) {
    Object.values(bones).forEach(bone=>{
      if (bone["cubes"]) {
        let group = this.readGroup(geo,bone);
        log(group)
      }
    });
  }
  private static readGroup(geom: Geometry, json: any): GeometryGroup {
    let childrens: GeometryCube[] = [];
    Array.from(json.cubes).forEach(cubejson => {
      childrens.push(this.readCube(cubejson));
    });

    let group: GeometryGroup = {
      name: json.name,
      pivot: new vec3(json.pivot ? json.pivot : [0, 0, 0]),
      rotation: new vec3(json.rotation ? json.rotation : [0, 0, 0]),
      childrens: childrens,
      parent: json.parent ? geom.groups.get(json.parent) : undefined,
      isRoot: json.parent == undefined
    };
    geom.groups.set(group.name, group);

    if (json.parent){
      geom.groups.get(json.parent)?.childrens.push(group);
    }
    return group;
  }
  private static readCube(json: any): GeometryCube {
    return {
      origin: new vec3(json.origin),
      size: new vec3(json.size),
      rotation: new vec3(json.rotation ? json.rotation : [0, 0, 0]),
      pivot: new vec3(json.pivot ? json.pivot : [0, 0, 0]),
      uv: {
        north: this.readUv(json.uv.north),
        south: this.readUv(json.uv.south),
        east: this.readUv(json.uv.east),
        west: this.readUv(json.uv.west),
        up: this.readUv(json.uv.up),
        down: this.readUv(json.uv.down)
      }
    }
  }
  private static readUv(json: any): vec4 | undefined {
    if (json == undefined) {
      return undefined;
    }
    if (json.uv == undefined || json.uv_size == undefined) {
      return undefined;
    }
    // 使用一个vec4表示uv
    let uv = vec4.zero;
    uv.x = json.uv[0];
    uv.y = json.uv[1];
    uv.z = uv.x + json.uv_size[0];
    uv.w = uv.y + json.uv_size[1];
    return uv;
  }
  public static loadGeometry(path: string): Geometry {
    let geometry = new Geometry();
    let geoJson = JSON.parse(readFileSync(path).toString())["minecraft:geometry"][0];
    
    this.readDescription(geometry, geoJson["description"]);
    this.readBones(geometry, geoJson["bones"]);
    return geometry;
  }
}
