"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const fs_1 = require("fs");
const vec3_1 = __importDefault(require("../../tsm/vec3"));
const Geometry_1 = __importStar(require("../model/Geometry"));
class GeometrySystem {
    /**
     * 读取模型中描述或信息
     * @param geo 接收结果的Geometry
     */
    static readDescription(geo, desc) {
        geo.identifier = desc.identifier;
        geo.textureWidth = desc.texture_width;
        geo.textureHeight = desc.texture_height;
    }
    /**
     * 读取模型中骨骼
     * @example readBones({
     *  bones:[
     *    {GROUP_TYPE},
     *    ...
     *  ]
     * })
     * @returns
     */
    static readBones(bones) {
        Object.values(bones).forEach(bone => {
            // if (bone["cubes"] || bone["name"]) {
            let group = this.readGroup(bone);
            // 判断组是否是根节点
            if (group.isRoot) {
                // 将组赋值到几何体的根节点上
                this.loadingGeometry.root = group;
            }
            //}
        });
    }
    /**
     * 读取一个组
     * @example readGroup({
     *  name:string,
     *  pivot:number[3],
     *  parent?:string,
     *  cubes:[
     *    {CUBE_TYPE},
     *    ...
     *  ]
     * })
     */
    static readGroup(json) {
        var _a;
        let group = {
            type: Geometry_1.EGeometryType.GROUP,
            conditions: [],
            name: json.name,
            // 判断是否拥有属性否则默认
            pivot: new vec3_1.default(json.pivot ? json.pivot : [0, 0, 0]),
            rotation: new vec3_1.default(json.rotation ? json.rotation : [0, 0, 0]),
            childrens: [],
            parent: json.parent ? this.loadingGeometry.groups.get(json.parent) : undefined,
            isRoot: json.parent == undefined
        };
        // 计算可视表达式
        if (group.name.startsWith("V_")) {
            let con = group.name.slice(2);
            (0, console_1.log)(con);
        }
        // 如果组有块列表则遍历
        // 遍历所有子节点
        if (json.cubes) {
            Array.from(json.cubes).forEach(cubejson => {
                // 将块加入到子节点中
                let child = this.readCube(cubejson);
                child.parent = group;
                group.childrens.push(child);
            });
        }
        // 将此节点添加到groupsMap
        this.loadingGeometry.groups.set(group.name, group);
        // 如果该节点有父节点
        // 则将此节点添加到 父节点的子节点列表
        if (json.parent) {
            (_a = this.loadingGeometry.groups.get(json.parent)) === null || _a === void 0 ? void 0 : _a.childrens.push(group);
        }
        return group;
    }
    /**
     * 读取一个块
     * @param json
     * @example readCube({
     *  origin:number[3],
     *  size:number[3],
     *  pivot?:number[3],
     *  rotation?:number[3],
     *  uv:{
     *    north/south/west/east/up/down:{
     *      uv:[x,y],
     *      uv_size:[w,h]
     *    }
     *  }
     * })
     */
    static readCube(json) {
        // 如果uv是数组类型
        // 则该模型是箱形UV
        // 抛出错误
        // TODO: 添加箱形UV
        if (json.uv instanceof Array) {
            (0, console_1.error)("GeometrySystem load uv :Unsupported box UV");
            (0, console_1.error)(`Path : ${this.loadingFile}`);
            throw new Error("Unsupported box UV");
        }
        return {
            parent: undefined,
            type: Geometry_1.EGeometryType.CUBE,
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
    /**
     * 读取UV坐标
     * @param json
     * @example readUv({ uv: [x,y], uv_size: [w,h] })
     * @returns [x1,y1,x2,y2]
     */
    static readUv(json) {
        if (json == undefined) {
            return undefined;
        }
        if (json.uv == undefined || json.uv_size == undefined) {
            return undefined;
        }
        let uv = new Array(4);
        uv[0] = json.uv[0];
        uv[1] = json.uv[1];
        uv[2] = uv[0] + json.uv_size[0];
        uv[3] = uv[1] + json.uv_size[1];
        return uv;
    }
    /**
     * 读取Geometrt文件
     * @param path 文件路径
     * @returns 读取的Geometry模型
     */
    static loadGeometry(path) {
        let geometry = new Geometry_1.default();
        this.loadingGeometry = geometry;
        this.loadingFile = path;
        let geoJson = JSON.parse((0, fs_1.readFileSync)(path).toString())["minecraft:geometry"][0];
        this.readDescription(geometry, geoJson["description"]);
        this.readBones(geoJson["bones"]);
        this.loadingGeometry = undefined;
        this.loadingFile = "";
        return geometry;
    }
}
exports.default = GeometrySystem;
