"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const Config_1 = require("../../utils/Config");
const OptifinePartModel_1 = __importDefault(require("../model/OptifinePartModel"));
class OptifinePartManager {
    /**
     * 初始化模型列表
     */
    static init() {
        let dir = (0, fs_1.readdirSync)(Config_1.Config.blockModelsPath);
        for (let file of dir) {
            if (file.endsWith(".jpm")) {
                let fullpath = path_1.default.join(Config_1.Config.blockModelsPath, file);
                let model = OptifinePartModel_1.default.loadModel(fullpath);
                this.models.set(model.identifier, model);
            }
        }
    }
    static getModel(id) {
        return this.models.get(id);
    }
}
exports.default = OptifinePartManager;
OptifinePartManager.models = new Map();
