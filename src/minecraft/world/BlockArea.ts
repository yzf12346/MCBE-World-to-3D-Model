import vec3 from "../../tsm/vec3";
import Block from "./Block";
import BlockType from "./BlockType";


/**
 * 可以储存方块的区域
 */
export default class BlockArea {
  /**
   * 储存方块的map保持
   */
  private blocks = new Map<string, Block>();
  /**
   * 区域的大小
   */
  private size: vec3;

  /**
   * 创建一个方块区域
   * @param size 方块区域的尺寸
   */
  public constructor(size: vec3) {
    this.size = size.copy();
  }
  /**
   * 获取方块区域的尺寸
   * @returns 方块区域的尺寸
   */
  public getSize(): vec3 {
    return this.size;
  }
  /**
   * 获取指定坐标方块
   * @param pos 指定的坐标
   * @returns 如果指定坐标没有set则返回undefined
   */
  public getBlock(pos: vec3): Block | undefined {
    return this.blocks.get(JSON.stringify(pos));
  }
  /**
   * 设置指定坐标为指定方块
   * @param pos 指定的坐标
   * @param type 方块的类型
   * @param data 方块的附加值:默认传入{}
   */
  public setBlock(pos: vec3, type: BlockType, data: any = {}) {
    this.blocks.set(JSON.stringify(pos), new Block(type, data))
  }
  /**
   * 遍历区域内所有坐标
   * @description 与forEachBlocks区别
   */
  public forEach(cb: (pos: vec3, blk: Block | undefined) => void) {
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        for (let z = 0; z < this.size.z; z++) {
          let pos = new vec3([x,y,z]);
          cb(pos,this.getBlock(pos));
        }
      }
    }
  }
  /**
   * 遍历set进去的所有方块
   * @description 与forEach区别
   */
  public forEachBlocks(cb:(pos:vec3,blk:Block)=>void){
    this.blocks.forEach((blk_,key)=>{
      let pos = new vec3(JSON.parse(key).values); 
      cb(pos,blk_);
    });
  }
}
