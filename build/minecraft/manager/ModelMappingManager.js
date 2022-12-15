"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Config_1 = require("../../utils/Config");
const OptifinePartManager_1 = __importDefault(require("./OptifinePartManager"));
class BlockMappingManager {
    static init() {
        let data = (0, fs_1.readFileSync)(Config_1.Config.blockModelMappingPath).toString();
        let json = JSON.parse(data);
        Object.keys(json).forEach(key => {
            let model = json[key].model;
            if (key == "*") {
                this.defaultModel = model;
                return;
            }
            this.mapping.set(key, model);
        });
    }
    static queryModel(blockName) {
        var _a;
        let name = (_a = this.mapping.get(blockName)) !== null && _a !== void 0 ? _a : this.defaultModel;
        return OptifinePartManager_1.default.getModel(name);
    }
}
exports.default = BlockMappingManager;
BlockMappingManager.mapping = new Map();
