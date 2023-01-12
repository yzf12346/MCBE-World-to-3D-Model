import ModelManager, {BlockModel} from "../manager/ModelManager";
import vec3 from "../tsm/src/vec3";

export default class Block{
  name:string;
  special:number;
  position:vec3 = vec3.zero;

  public constructor(name:string,special:number = 0){
    this.name = name;
    this.special = special;
  }

}
