"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../utils/Config");
class ResourceManager {
    /**
     * 获取贴图的完整路径
     * @param file 需要以textures/开头
     */
    static getTextureFullPath(file) {
        let basePath = Config_1.Config.texturePath;
        if (basePath.endsWith("/")) {
            basePath = basePath.slice(0, basePath.length - 1);
            // log(basePath)
        }
        return file.replace(/^textures/g, basePath).replace(/(.png)*$/g, ".png");
    }
}
exports.default = ResourceManager;
