import {Config} from "./utils/Config";
import OptifinePartModel from "./minecraft/model/OptifinePartModel";
import {inspect} from "util";
import OptifinePartManager from "./minecraft/manager/OptifinePartManager";
import BlockMappingManager from "./minecraft/manager/ModelMappingManager";

// 配置
{
  Config.blockJsonPath = "/sdcard/res/blocks.json";
  Config.blockTexturesPath = "/sdcard/res/textures/blocks/";
  Config.terrianTextureJsonPath = "/sdcard/res/textures/terrain_texture.json";
  Config.texturePath = "/sdcard/res/textures/";
  Config.blockModelsPath = "/sdcard/res/blockmodels/";
  Config.blockModelMappingPath = "/sdcard/res/mapping.json"
}
// 初始化Manager
{
  //TextureManager.init();
  //BlockManager.init();
  OptifinePartManager.init();
  BlockMappingManager.init();
}

console.log(BlockMappingManager.queryModel("grass").boxes[0]);

