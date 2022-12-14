"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vec3_1 = __importDefault(require("../../tsm/vec3"));
const Block_1 = __importDefault(require("./Block"));
/**
 * 可以储存方块的区域
 */
class BlockArea {
    /**
     * 创建一个方块区域
     * @param size 方块区域的尺寸
     */
    constructor(size) {
        /**
         * 储存方块的map保持
         */
        this.blocks = new Map();
        this.size = size.copy();
    }
    /**
     * 获取方块区域的尺寸
     * @returns 方块区域的尺寸
     */
    getSize() {
        return this.size;
    }
    /**
     * 获取指定坐标方块
     * @param pos 指定的坐标
     * @returns 如果指定坐标没有set则返回undefined
     */
    getBlock(pos) {
        return this.blocks.get(JSON.stringify(pos));
    }
    /**
     * 设置指定坐标为指定方块
     * @param pos 指定的坐标
     * @param type 方块的类型
     * @param data 方块的附加值:默认传入{}
     */
    setBlock(pos, type, data = {}) {
        this.blocks.set(JSON.stringify(pos), new Block_1.default(type, data));
    }
    /**
     * 遍历区域内所有坐标
     * @description 与forEachBlocks区别
     */
    forEach(cb) {
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                for (let z = 0; z < this.size.z; z++) {
                    let pos = new vec3_1.default([x, y, z]);
                    cb(pos, this.getBlock(pos));
                }
            }
        }
    }
    /**
     * 遍历set进去的所有方块
     * @description 与forEach区别
     */
    forEachBlocks(cb) {
        this.blocks.forEach((blk_, key) => {
            let pos = new vec3_1.default(JSON.parse(key).values);
            cb(pos, blk_);
        });
    }
}
exports.default = BlockArea;
