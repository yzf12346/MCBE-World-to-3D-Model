"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mat3_1 = __importDefault(require("../tsm/mat3"));
class Matrix {
    static rotationQuat(qt) {
        let w = qt.w;
        let x = qt.x;
        let y = qt.y;
        let z = qt.z;
        return new mat3_1.default([
            1 - 2 * y * y - 2 * z * z,
            2 * x * y + 2 * w * z,
            2 * x * z - 2 * w * y,
            2 * x * y - 2 * w * z,
            1 - 2 * x * x - 2 * z * z,
            2 * z * y + 2 * w * x,
            2 * x * z + 2 * w * y,
            2 * y * z - 2 * w * x,
            1 - 2 * x * x - 2 * y * y
        ]);
    }
    static rotationEuler(euler) {
        return this.rotationQuat(euler.toQuat());
    }
}
exports.default = Matrix;
