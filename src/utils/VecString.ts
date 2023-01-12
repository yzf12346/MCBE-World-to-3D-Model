import {V4MAPPED} from "dns";
import vec2 from "../tsm/src/vec2";
import vec3 from "../tsm/src/vec3";
import vec4 from "../tsm/src/vec4";
import round from "./NumberUtils";

function toFixedUp(num:number){
  return round(num, 2);
}

export function vec2string(vec:vec2|vec3|vec4):string{
  let result = toFixedUp(vec.x) + " " + toFixedUp(vec.y);

  /*
   * 这两行代码有Bug
   * 当vec.z 为 0的时候
   * 自动跳过
  if ((vec as vec3).z){
    result += " "+(vec as vec3).z;
  }

  if ((vec as vec4).w){
    result += " "+(vec as vec4).w;
  }
  */

  if ((vec as vec3).xyz && (vec as vec3).xyz.length == 3){    
    result += " "+toFixedUp((vec as vec3).z);
  }
  
  if ((vec as vec4).xyzw && (vec as vec4).xyzw.length == 4){    
    result += " "+toFixedUp((vec as vec4).w);
  }  

  return result;
}

export function hpVec2_2str(vec:vec2){
  return `${vec.x.toFixed(4)} ${vec.y.toFixed(4)}`
}

export function string2vec(str:string):vec2|vec3|vec4{
  let args = str.split(" ");
  let numbers = [];
  for (let arg of args){
    numbers.push(Number(arg));
  }
  switch (numbers.length){
    case 2:
      return new vec2(numbers as any);
    case 3:
      return new vec3(numbers as any);
    case 4:
      return new vec4(numbers as any);
    default:
      return undefined;
  }
}
