import {Config} from "./utils/Config";
import OptifinePartModel from "./minecraft/model/OptifinePartModel";
//import {inspect} from "util";
import OptifinePartManager from "./minecraft/manager/OptifinePartManager";

import BlockManager from "./minecraft/manager/BlockManager";
import TextureManager from "./minecraft/manager/TextureManager";
import ModelConfigManager from "./minecraft/manager/ModelConfigManager";

// 配置
{
  Config.blockJsonPath = __dirname + "/../res/blocks.json";
  Config.blockTexturesPath = __dirname + "/../res/textures/blocks/";
  Config.terrianTextureJsonPath = __dirname + "/../res/textures/terrain_texture.json";
  Config.texturePath = __dirname + "/../res/textures/";
  Config.blockModelsPath = __dirname + "/../res/blockmodels/";
  Config.blockModelMappingPath = __dirname + "/../res/mapping.json"
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


