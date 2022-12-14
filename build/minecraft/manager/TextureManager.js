"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Config_1 = require("../../utils/Config");
const ResourceManager_1 = __importDefault(require("./ResourceManager"));
class TextureManager {
    static getTexture(alias) {
        return this.textures.get(alias);
    }
    static init() {
        this.readTerrianJson(Config_1.Config.terrianTextureJsonPath);
    }
    static readTerrianJson(jsonPath) {
        let strNoCommits = (0, fs_1.readFileSync)(jsonPath).toString();
        //strNoCommits = strNoCommits.replace(/\/\/[^\n*]/g,"").replace(/\/\*(\s|.)*?\*\//g,"");
        let data = JSON.parse(strNoCommits)["texture_data"];
        Object.keys(data).forEach((key) => {
            let value = data[key];
            this.readTexture(key, value);
        });
    }
    static readTexture(key, value) {
        let textures = value["textures"];
        if (typeof textures == "string") {
            const fullpath = ResourceManager_1.default.getTextureFullPath(textures);
            this.textures.set(key, fullpath);
            return;
        }
        if (textures instanceof Array) {
            if (textures.length == 0) {
                return;
            }
            let texture = textures[0];
            if (typeof texture == "string") {
                const fullpath = ResourceManager_1.default.getTextureFullPath(texture);
                this.textures.set(key, fullpath);
                return;
            }
            if (texture["path"] != undefined) {
                const fullpath = ResourceManager_1.default.getTextureFullPath(texture.path);
                this.textures.set(key, fullpath);
                return;
            }
        }
    }
}
exports.default = TextureManager;
TextureManager.textures = new Map();
