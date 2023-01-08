import ObjFile, {ObjCubeParam, ObjFaceParam} from "./3d/ObjFile";
import BlockArea from "./container/BlockArea";
import BlockModel from "./data/BlockModel";
import BlockManager from "./manager/BlockManager";
import ModelManager from "./manager/ModelManager";
import TextureManager from "./manager/TextureManager";
import vec2 from "./tsm/src/vec2";
import vec3 from "./tsm/src/vec3";

async function main() {
  await TextureManager.init();
  BlockManager.init();
  TextureManager.getTextureAtlas().save("/sdcard/atlas.png");
  ModelManager.init();

  let obj = new ObjFile();

  let area = new BlockArea();
  let size = 10;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        area.addBlock(new vec3([x,y,z]), "stone");       
      }      
    }    
  }

  obj.drawArea(area);

  obj.save("/sdcard/out.obj");
}

main();
