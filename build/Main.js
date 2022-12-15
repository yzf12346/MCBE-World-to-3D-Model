"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./utils/Config");
const OptifinePartManager_1 = __importDefault(require("./minecraft/manager/OptifinePartManager"));
const ModelMappingManager_1 = __importDefault(require("./minecraft/manager/ModelMappingManager"));
// 配置
{
    Config_1.Config.blockJsonPath = "/sdcard/res/blocks.json";
    Config_1.Config.blockTexturesPath = "/sdcard/res/textures/blocks/";
    Config_1.Config.terrianTextureJsonPath = "/sdcard/res/textures/terrain_texture.json";
    Config_1.Config.texturePath = "/sdcard/res/textures/";
    Config_1.Config.blockModelsPath = "/sdcard/res/blockmodels/";
    Config_1.Config.blockModelMappingPath = "/sdcard/res/mapping.json";
}
// 初始化Manager
{
    //TextureManager.init();
    //BlockManager.init();
    OptifinePartManager_1.default.init();
    ModelMappingManager_1.default.init();
}
console.log(ModelMappingManager_1.default.queryModel("grass").boxes[0]);
