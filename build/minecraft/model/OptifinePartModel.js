"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptifinePartBox = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const vec2_1 = __importDefault(require("../../tsm/vec2"));
const vec3_1 = __importDefault(require("../../tsm/vec3"));
class OptifinePartBox {
    constructor() {
        this.id = undefined;
        this.from = undefined;
        this.to = undefined;
        this.rotation = undefined;
    }
}
exports.OptifinePartBox = OptifinePartBox;
class OptifinePartModel {
    constructor() {
        this._textureSize = vec2_1.default.zero;
        this._identifier = undefined;
        this._boxes = [];
    }
    get textureSize() {
        return this._textureSize.copy();
    }
    get identifier() {
        return this._identifier + "";
    }
    get boxes() {
        return this._boxes;
    }
    static loadModel(path_) {
        const model = this.parseModel(JSON.parse((0, fs_1.readFileSync)(path_).toString()));
        model._identifier = path_1.default.parse(path_).name;
        return model;
    }
    /**
     * 解析Boxes
     */
    static parseBoxes(json) {
        // 如果json等于undefined返回空
        if (json == undefined) {
            return [];
        }
        let result = [];
        for (let box of json) {
            let pb = new OptifinePartBox();
            // 将Optifine part坐标转换为Blockbench坐标
            let x1 = -box.coordinates[0] - box.coordinates[3];
            let y1 = -box.coordinates[1] - box.coordinates[4];
            let z1 = box.coordinates[2];
            let x2 = -box.coordinates[0];
            let y2 = -box.coordinates[1];
            let z2 = box.coordinates[2] + box.coordinates[5];
            pb.id = Math.random().toFixed(10);
            pb.from = new vec3_1.default([x1, y1, z1]);
            pb.to = new vec3_1.default([x2, y2, z2]);
            pb.rotation = vec3_1.default.zero;
            result.push(pb);
        }
        return result;
    }
    /**
     * 解析模型
     * @param json 应为xxx.jpm文件内容
     */
    static parseModel(json) {
        const model = new OptifinePartModel();
        model._textureSize = new vec2_1.default([
            json.textureSize[0],
            json.textureSize[1]
        ]);
        model._boxes.push(...this.parseBoxes(json.boxes));
        // 解析submodels
        for (let submodel of json.submodels ? json.submodels : []) {
            let rotation = new vec3_1.default(submodel.rotate);
            let boxes = this.parseBoxes(submodel.boxes);
            // 解析box的rotation
            // 并将box添加到_boxes
            boxes.forEach(v => {
                v.rotation = rotation;
                model._boxes.push(v);
            });
        }
        return model;
    }
}
exports.default = OptifinePartModel;
