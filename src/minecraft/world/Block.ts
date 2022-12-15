import BlockType from "./BlockType";

export default class Block {
  public type:BlockType;
  public readonly data:any;

  /**
   * 方块的标识符
   */
  get identifier(){
    return this.type.identifier;
  }

  /**
   * 方块的命名空间
   */
  get namespace(){
    return this.type.namespace;
  }

  constructor(type:BlockType,data:any){
    this.type = type;
    this.data = data;
  }
}
