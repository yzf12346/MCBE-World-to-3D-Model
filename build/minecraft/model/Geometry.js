"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EGeometryType = exports.CubeUv = void 0;
class CubeUv {
    constructor() {
        this.north = undefined;
        this.south = undefined;
        this.east = undefined;
        this.west = undefined;
        this.up = undefined;
        this.down = undefined;
    }
}
exports.CubeUv = CubeUv;
var EGeometryType;
(function (EGeometryType) {
    EGeometryType[EGeometryType["GROUP"] = 0] = "GROUP";
    EGeometryType[EGeometryType["CUBE"] = 1] = "CUBE";
})(EGeometryType = exports.EGeometryType || (exports.EGeometryType = {}));
class Geometry {
    constructor() {
        this.groups = new Map();
        this.root = undefined;
    }
}
exports.default = Geometry;
