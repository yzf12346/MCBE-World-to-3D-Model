export enum EStateFacing {
  east = "east",
  west = "west",
  south = "south",
  north = "north"
}

export enum EStairsHalf {
  top = "top",
  bottom = "bottom"
}

export enum EStairsShape {
  straight = "straight",
  inner_left = "inner_left",
  inner_right = "inner_right",
  outer_left = "outer_left",
  outer_right = "outer_right"
}

//
// TODO:  <07-01-23, yzf12346> add more types //
export default class BlockStates {
  static getDefaultState() {
    return "";
  }

  static getStairsState(facing: EStateFacing, half: EStairsHalf, shape:EStairsShape){
    return `facing=${facing},half=${half},shape=${shape}`;
  }
}
