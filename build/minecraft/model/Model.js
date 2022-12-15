"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelCube = exports.ModelDirection = void 0;
var ModelDirection;
(function (ModelDirection) {
    ModelDirection[ModelDirection["UP"] = 1] = "UP";
    ModelDirection[ModelDirection["DOWN"] = 2] = "DOWN";
    ModelDirection[ModelDirection["EAST"] = 3] = "EAST";
    ModelDirection[ModelDirection["WEST"] = 4] = "WEST";
    ModelDirection[ModelDirection["NORTH"] = 5] = "NORTH";
    ModelDirection[ModelDirection["SOUTH"] = 6] = "SOUTH";
})(ModelDirection = exports.ModelDirection || (exports.ModelDirection = {}));
class ModelCube {
    constructor(origin, size) {
        this.origin = origin;
        this.size = size;
    }
}
exports.ModelCube = ModelCube;
class Model {
    setRotation(x, y, z) {
    }
    getDirectionVec3(dirc) {
        // if (dirc)
    }
}
exports.default = Model;
