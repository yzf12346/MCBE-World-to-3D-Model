import vec3 from "../../tsm/vec3";
import OptifinePartModel from "../model/OptifinePartModel";

export class BlockTextures{
  up:string|undefined;
  down:string|undefined;
  east:string|undefined;
  west:string|undefined;
  north:string|undefined;
  south:string|undefined;
}

export default class Block {
  public identifier:string;
  public data:any;
  public textures:BlockTextures;
  public model:OptifinePartModel;
  public isCulling:boolean = false;
  public visible:boolean = true;
  public position:vec3 = vec3.zero;
  public rotation:vec3 = vec3.zero;

  constructor(id:string,data:any){
    this.identifier = id;
    this.data = data;
  }

  public clone():Block{
    let blk = new Block(this.identifier,{...this.data});
    blk.textures = this.textures;
    blk.model = this.model;
    return blk;
  }
}
