"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubeUv = void 0;
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
class Geometry {
    constructor() {
        this.groups = new Map();
    }
}
exports.default = Geometry;
