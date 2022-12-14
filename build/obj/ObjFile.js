"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vec3_1 = __importDefault(require("../tsm/vec3"));
const fs_1 = require("fs");
function parseV3(str) {
    let value = str.split(" ");
    return new vec3_1.default([
        Number(value[0]),
        Number(value[1]),
        Number(value[2])
    ]);
}
function strV3(vt) {
    return vt.x + " " + vt.y + " " + vt.z;
}
class ObjFile {
    constructor() {
        this.vertexs = new Map();
    }
    /**
     * 添加一个顶点
     * @param vt 添加的顶点
     * @returns 顶点的索引
     */
    addVertex(vt) {
        let str = strV3(vt);
        if (this.vertexs.has(str)) {
            return this.vertexs.get(str);
        }
        this.vertexs.set(strV3(vt), this.vertexs.size);
        return this.vertexs.size - 1;
    }
    writeVertexs(file) {
        // map根据索引排序
        let array = Array.from(this.vertexs);
        array.sort((a, b) => {
            return a[1] - b[1];
        });
        // 遍历写入文件
        array.forEach(v => {
            let vt = parseV3(v[0]);
            (0, fs_1.writeFileSync)(file, `v ${vt.x} ${vt.y} ${vt.z}\n`);
        });
    }
    writeFile(path) {
        let file = (0, fs_1.openSync)(path, "w");
        this.writeVertexs(file);
    }
}
exports.default = ObjFile;
