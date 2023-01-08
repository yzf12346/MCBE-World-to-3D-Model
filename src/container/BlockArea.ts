import BlockManager from "../manager/BlockManager";
import vec3 from "../tsm/src/vec3";
import {string2vec, vec2string} from "../utils/VecString";

export interface Block {
  name: string;

  isFullBlock:boolean;
  connectAble:boolean;
}

export default class BlockArea {
  private data = new Map<string, Block>();

  public addBlock(pos: vec3, blkname: string) {
    this.data.set(vec2string(pos), {
      name:blkname,
      isFullBlock:BlockManager.isFullBlock(blkname),
      connectAble:true
    });
  }

  public getBlock(pos: vec3) {
    return this.data.get(vec2string(pos));
  }

  public keys() {
    return this.data.keys();
  }

  public values() {
    return this.data.values();
  }

  public entries() {
    let kvs: [vec3, Block][] = [];

    this.data.forEach((bl, posstr) => {
      kvs.push(
        [string2vec(posstr) as vec3,bl]
      );
    });

    return kvs.values();
  }

  public [Symbol.iterator]() {
    return this.entries()
  }
}
