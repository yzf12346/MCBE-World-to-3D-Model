import {Config} from "./utils/Config";
import OptifinePartModel from "./minecraft/model/OptifinePartModel";
//import {inspect} from "util";
import OptifinePartManager from "./minecraft/manager/OptifinePartManager";

import BlockManager from "./minecraft/manager/BlockManager";
import TextureManager from "./minecraft/manager/TextureManager";
import ModelConfigManager from "./minecraft/manager/ModelConfigManager";
import BlockArea from "./minecraft/world/BlockArea";
import vec3 from "./tsm/vec3";
import BlockAreaExporter from "./obj/BlockAreaExporter";

// 配置
{
  Config.blockJsonPath = __dirname + "/../res/blocks.json";
  Config.blockTexturesPath = __dirname + "/../res/textures/blocks/";
  Config.terrianTextureJsonPath = __dirname + "/../res/textures/terrain_texture.json";
  Config.texturePath = __dirname + "/../res/textures/";
  Config.blockModelsPath = __dirname + "/../res/blockmodels/";
  Config.blockModelConfigPath = __dirname + "/../res/model_config.json"
}
// 初始化Manager
{
  OptifinePartManager.init();
  ModelConfigManager.init();

  TextureManager.init();
  BlockManager.init();
}

console.log(__dirname);


////
console.log(BlockManager.getBlock("stone"));


let area = new BlockArea(new vec3([1, 1, 1]));
let blk = BlockManager.getBlock("fence");
area.setBlock(new vec3([0, 0, 0]), blk);

let obj = BlockAreaExporter.exportObjFile(area);

obj.writeFile("/sdcard/out.obj")
