"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const fs_1 = require("fs");
const vec3_1 = __importDefault(require("../../tsm/vec3"));
const vec4_1 = __importDefault(require("../../tsm/vec4"));
const Geometry_1 = __importDefault(require("../model/Geometry"));
class GeometrySystem {
    static readDescription(geo, desc) {
        geo.identifier = desc.identifier;
        geo.textureWidth = desc.texture_width;
        geo.textureHeight = desc.texture_height;
    }
    static readBones(geo, bones) {
        Object.values(bones).forEach(bone => {
            if (bone["cubes"]) {
                let group = this.readGroup(geo, bone);
                (0, console_1.log)(group);
            }
        });
    }
    static readGroup(geom, json) {
        var _a;
        let childrens = [];
        Array.from(json.cubes).forEach(cubejson => {
            childrens.push(this.readCube(cubejson));
        });
        let group = {
            name: json.name,
            pivot: new vec3_1.default(json.pivot ? json.pivot : [0, 0, 0]),
            rotation: new vec3_1.default(json.rotation ? json.rotation : [0, 0, 0]),
            childrens: childrens,
            parent: json.parent ? geom.groups.get(json.parent) : undefined,
            isRoot: json.parent == undefined
        };
        geom.groups.set(group.name, group);
        if (json.parent) {
            (_a = geom.groups.get(json.parent)) === null || _a === void 0 ? void 0 : _a.childrens.push(group);
        }
        return group;
    }
    static readCube(json) {
        return {
            origin: new vec3_1.default(json.origin),
            size: new vec3_1.default(json.size),
            rotation: new vec3_1.default(json.rotation ? json.rotation : [0, 0, 0]),
            pivot: new vec3_1.default(json.pivot ? json.pivot : [0, 0, 0]),
            uv: {
                north: this.readUv(json.uv.north),
                south: this.readUv(json.uv.south),
                east: this.readUv(json.uv.east),
                west: this.readUv(json.uv.west),
                up: this.readUv(json.uv.up),
                down: this.readUv(json.uv.down)
            }
        };
    }
    static readUv(json) {
        if (json == undefined) {
            return undefined;
        }
        if (json.uv == undefined || json.uv_size == undefined) {
            return undefined;
        }
        // 使用一个vec4表示uv
        let uv = vec4_1.default.zero;
        uv.x = json.uv[0];
        uv.y = json.uv[1];
        uv.z = uv.x + json.uv_size[0];
        uv.w = uv.y + json.uv_size[1];
        return uv;
    }
    static loadGeometry(path) {
        let geometry = new Geometry_1.default();
        let geoJson = JSON.parse((0, fs_1.readFileSync)(path).toString())["minecraft:geometry"][0];
        this.readDescription(geometry, geoJson["description"]);
        this.readBones(geometry, geoJson["bones"]);
        return geometry;
    }
}
exports.default = GeometrySystem;
