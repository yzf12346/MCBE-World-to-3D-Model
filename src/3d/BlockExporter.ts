import Block from "../data/Block";
import ModelManager, {BlockModel} from "../manager/ModelManager";
import vec3 from "../tsm/src/vec3";
import ObjFile from "./ObjFile";

export interface BlockConnections {
  up: Block;
  bottom: Block;
  east: Block;
  west: Block;
  north: Block;
  south: Block;
}

export default class BlockExporter {
  public static exportBlock(
    block: Block,
    connections: BlockConnections,
    objFile: ObjFile) {

    if (block.name == "air") {
      return;
    }
    if (block.name == "stone") {
      this.exportStone(block, objFile);
      return;
    }
    if (block.name.match(/.*_stairs/)) {
      this.exportStairs(block, connections, objFile);
      return;
    }
    this.exportDefaultBlock(block, objFile);
  }

  private static exportDefaultBlock(block: Block, objFile: ObjFile) {
    let model = ModelManager.getModel(block.name);

    objFile.drawModel(
      model, block.position,
      block.position.copy().add(new vec3([0.5, 0.5, 0.5])),
      new vec3([0, 0, 0]));
  }

  private static exportStone(stone: Block, objFile: ObjFile) {
    let specials = [
      "stone",
      "granite",
      "polished_granite",
      "diorite",
      "polished_diorite",
      "andesite",
      "polished_andesite"
    ];

    if (stone.special >= specials.length) {
      stone.special = 0;
    }

    let model = ModelManager.getModel(specials[stone.special]);


    objFile.drawModel(
      model, stone.position,
      stone.position.copy().add(new vec3([0.5, 0.5, 0.5])),
      new vec3([0, 0, 0]));
  }



  private static exportStairs(stairs: Block, connections: BlockConnections, objFile: ObjFile) {
  }
}
