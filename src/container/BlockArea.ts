import {BlockConnections} from "../3d/BlockExporter";
import Block from "../data/Block";
import BlockManager from "../manager/BlockManager";
import vec3 from "../tsm/src/vec3";
import {string2vec, vec2string} from "../utils/VecString";

export interface BlockAreaIterator {
  next: () => {
    value: Block,
    done: boolean
  }
}

export default class BlockArea {
  private data = new Map<string, Block>();

  public setBlock(_block: Block):void;
  public setBlock(_pos: vec3, _blkname: string, _special: number):void;
  public setBlock(
    posOrBlock: vec3 | Block,
    blkname?: string,
    special?: number):void {
    if (posOrBlock instanceof Block) {
      this.data.set(vec2string(posOrBlock.position), posOrBlock);
    }
    else {
      let block = BlockManager.getBlock(blkname, special);
      block.position = posOrBlock;
      this.data.set(vec2string(posOrBlock), block);
    }
  }

  public getBlock(pos: vec3) {
    return this.data.get(vec2string(pos))
      ?? BlockManager.getBlock("air");
  }

  public keys() {
    return this.data.keys();
  }

  public values() {
    return this.data.values();
  }

  public getConnections(pos: vec3): BlockConnections {
    return {
      up: this.getBlock(pos.copy().add(new vec3([0, 1, 0]))),
      bottom: this.getBlock(pos.copy().add(new vec3([0, -1, 0]))),

      east: this.getBlock(pos.copy().add(new vec3([1, 0, 0]))),
      west: this.getBlock(pos.copy().add(new vec3([-1, 0, 0]))),

      north: this.getBlock(pos.copy().add(new vec3([0, 0, 1]))),
      south: this.getBlock(pos.copy().add(new vec3([0, 0, -1])))
    }
  }

  public [Symbol.iterator](): IterableIterator<Block> {
    return this.data.values();
  }
}
