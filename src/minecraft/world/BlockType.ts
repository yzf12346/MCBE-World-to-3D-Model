import OptifinePartModel from "../model/OptifinePartModel";

export interface BlockTexture{
  up:string;
  down:string;
  east:string;
  west:string;
  north:string;
  south:string;
}

export default class BlockType {
  /** 标识符*/
  identifier: string;
  /**
   * 命名空间
   * @default "minecraft"
   */
  namespace: string = "minecraft";
  textures:BlockTexture;
  model:OptifinePartModel;
  isCulling:boolean;
  visible:boolean = true;
}
