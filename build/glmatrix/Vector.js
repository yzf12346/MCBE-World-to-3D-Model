"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec3 = exports.Vector3 = void 0;
const gl_matrix_1 = require("gl-matrix");
class Vector3 {
    get x() {
        return this.value[0];
    }
    get y() {
        return this.value[1];
    }
    get z() {
        return this.value[2];
    }
    set x(v) {
        this.value[0] = v;
    }
    set y(v) {
        this.value[1] = v;
    }
    set z(v) {
        this.value[2] = v;
    }
    constructor(v3 = gl_matrix_1.vec3.zero(gl_matrix_1.vec3.create())) {
        this.value = v3;
    }
    set(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(target) {
        let v3 = new Vector3();
        gl_matrix_1.vec3.add(v3.value, this.value, target.value);
        return v3;
    }
}
exports.Vector3 = Vector3;
function Vec3(x = 0, y = 0, z = 0) {
    let v3 = new Vector3();
    v3.set(x, y, z);
    return v3;
}
exports.Vec3 = Vec3;
