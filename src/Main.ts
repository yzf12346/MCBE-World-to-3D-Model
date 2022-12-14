import {log} from "console";
import BlockManager from "./minecraft/manager/BlockManager";
import GeometrySystem from "./minecraft/manager/GeometrySystem";
import ResourceManager from "./minecraft/manager/ResourceManager";
import TextureManager from "./minecraft/manager/TextureManager";
import ObjFile from "./obj/ObjFile";
import mat4 from "./tsm/mat4";
import quat from "./tsm/quat";
import vec3 from "./tsm/vec3";
import {Config} from "./utils/Config";

// 配置
{
  Config.blockJsonPath = "/sdcard/res/blocks.json";
  Config.blockTexturesPath = "/sdcard/res/textures/blocks/";
  Config.terrianTextureJsonPath = "/sdcard/res/textures/terrain_texture.json";
  Config.texturePath = "/sdcard/res/textures/";
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

GeometrySystem.loadGeometry("/sdcard/Download/model.geo (2).json");
