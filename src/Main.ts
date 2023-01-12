import {inspect} from "util";
import BlockExporter from "./3d/BlockExporter";
import ObjFile, {ObjCubeParam, ObjFaceParam} from "./3d/ObjFile";
import BlockArea from "./container/BlockArea";
import BlockManager from "./manager/BlockManager";
import ModelManager from "./manager/ModelManager";
import TextureManager from "./manager/TextureManager"
import TranslateManager from "./manager/TranslateManager";
import McBlockReader from "./server/McBlockReader";
import vec2 from "./tsm/src/vec2";
import vec3 from "./tsm/src/vec3";

async function main() {  
  await TextureManager.init();

  await TranslateManager.init();

  TextureManager.getTextureAtlas().save("/sdcard/atlas.png");

  let out = new ObjFile();
  /*for (let i = 0; i < 7; i++) {
    let stoneBlock = BlockManager.getBlock("stone", i);
    stoneBlock.position = new vec3([i, 0, 0]);

    BlockExporter.exportBlock(stoneBlock, undefined, out);
  }*/
  /* out.addCube(new ObjCubeParam(
     vec3.zero, vec3.one,
     vec3.zero, vec3.zero,
     ObjCubeParam.NO_UV));*/
  /*let fp = new ObjFaceParam();
  fp.vertexs =[
    vec3.zero.copy(),
    new vec3([1,0,0]),
    vec3.one.copy(),
    new vec3([0,0,1])
  ];
  fp.textureVertexs = [
    vec2.zero,
    vec2.zero,
    vec2.zero,
    vec2.zero
  ];
  out.add4Face(fp);
  */
  let model = ModelManager.getModel("acacia_stairs_inner");

  let rot = new vec3([0, 0, 0]);
  let pos = new vec3([0, 0, 0]);

  let half = new vec3([0.5, 0.5, 0.5]);

  out.drawModel(model, pos.copy(), pos.copy().add(half), rot.copy());
  pos.x++;
  rot.y += 90;
  out.drawModel(model, pos.copy(), pos.copy().add(half), rot.copy());
  pos.x++;
  rot.y += 90;
  out.drawModel(model, pos.copy(), pos.copy().add(half), rot.copy());
  pos.x++
  rot.y += 90;
  out.drawModel(model, pos.copy(), pos.copy().add(half), rot.copy());

  out.save("/sdcard/out.obj")

  //return

  let server = new McBlockReader(2998);
  server.getServer().on("connection", async (_client) => {
    server.pRunCommand("say 已连接Websocket服务器");

    let area = new BlockArea();

    let tasks = [];
    for (let x = 0; x < 5; x++) {
      for (let z = 0; z < 5; z++) {
        for (let y = -50; y < -45; y++) {
          tasks.push(new Promise<void>(res => {
            server.getBlock(x, y, z).then(block => {
              block.position.y += 50;
              area.setBlock(block);
              res();
            });
          }));
        }
      }
    }
    await Promise.all(tasks);
    /* for (let block of area) {
       BlockExporter.exportBlock(block,
         area.getConnections(block.position), out);
     }*/
    out.drawModel(ModelManager.getModel("acacia_stairs"));
    out.save("/sdcard/out.obj");
  });
}

main()
