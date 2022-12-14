"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Block {
    /**
     * 方块的标识符
     */
    get identifier() {
        return this.type.identifier;
    }
    /**
     * 方块的命名空间
     */
    get namespace() {
        return this.type.namespace;
    }
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.default = Block;
