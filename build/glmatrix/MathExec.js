"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathExec = void 0;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["add"] = 0] = "add";
    ActionType[ActionType["subtrahere"] = 1] = "subtrahere";
    ActionType[ActionType["multiply"] = 2] = "multiply";
    ActionType[ActionType["except"] = 3] = "except";
    ActionType[ActionType["equals"] = 4] = "equals";
})(ActionType || (ActionType = {}));
class Action {
}
// c = a + b -> vec3.add(c,a,b)
function mathExec(str) {
    let noSpaceStr = str.replace(/ +/g, "");
    let codes = noSpaceStr.split(/[;\n]/g);
    for (let code of codes) {
        let tokens = code.split(/((?<=\+)|(?=\+)|(?<=\-)|(?=\-)|(?<=\\*)|(?=\\*)|(?<=\/)|(?=\/)|(?<=\=))/g);
        console.log(tokens);
    }
}
exports.mathExec = mathExec;
