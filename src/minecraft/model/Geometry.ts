import vec3 from "../../tsm/vec3";
import vec4 from "../../tsm/vec4";

export class CubeUv{
  north:vec4|undefined = undefined;
  south:vec4|undefined = undefined;
  east:vec4|undefined  = undefined;
  west:vec4|undefined  = undefined;
  up  :vec4|undefined  = undefined;
  down:vec4|undefined  = undefined;
}

export interface GeometryNode{
  pivot:vec3;
  rotation:vec3;
}

export interface GeometryCube extends GeometryNode{
  origin:vec3;
  size:vec3;
  uv:CubeUv;
}

export interface GeometryGroup extends GeometryNode{
  name:string;
  parent:GeometryGroup|undefined;
  childrens:GeometryNode[];
  isRoot:boolean;
}

export default class Geometry{
  groups = new Map<string,GeometryGroup>();
  identifier:string;
  textureWidth:number;
  textureHeight:number;
  root:GeometryNode;
}
