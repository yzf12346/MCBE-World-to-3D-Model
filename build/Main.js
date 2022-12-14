"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeometrySystem_1 = __importDefault(require("./minecraft/manager/GeometrySystem"));
const Config_1 = require("./utils/Config");
// 配置
{
    Config_1.Config.blockJsonPath = "/sdcard/res/blocks.json";
    Config_1.Config.blockTexturesPath = "/sdcard/res/textures/blocks/";
    Config_1.Config.terrianTextureJsonPath = "/sdcard/res/textures/terrain_texture.json";
    Config_1.Config.texturePath = "/sdcard/res/textures/";
}
// 初始化Manager
/*{
  TextureManager.init();
  BlockManager.init();
}
console.log(
  BlockManager.getBlock("stone").textures
)
*/
GeometrySystem_1.default.loadGeometry("/sdcard/Download/model.geo (2).json");
