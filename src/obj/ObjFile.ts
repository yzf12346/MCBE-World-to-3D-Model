import {log} from "console";
import vec3 from "../tsm/vec3";
import {openSync, writeFileSync} from "fs";
function parseV3(str: string): vec3 {
  let value = str.split(" ");
  return new vec3(
    [
      Number(value[0]),
      Number(value[1]),
      Number(value[2])
    ]
  )
}
function strV3(vt: vec3): string {
  return vt.x + " " + vt.y + " " + vt.z;
}

export default class ObjFile {
  public vertexs = new Map<string, number>();
  /**
   * 添加一个顶点
   * @param vt 添加的顶点
   * @returns 顶点的索引
   */
  public addVertex(vt: vec3): number {
    let str = strV3(vt);
    if (this.vertexs.has(str)) {
      return this.vertexs.get(str);
    }
    this.vertexs.set(strV3(vt), this.vertexs.size);
    return this.vertexs.size - 1;
  }
  public writeVertexs(file: number) {

    // map根据索引排序
    let array = Array.from(this.vertexs);
    array.sort((a, b) => {
      return a[1] - b[1];
    });
    // 遍历写入文件
    array.forEach(v => {
      let vt = parseV3(v[0]);
      writeFileSync(file, `v ${vt.x} ${vt.y} ${vt.z}\n`);
    });
  }
  public writeFile(path: string) {
    let file = openSync(path, "w");
    this.writeVertexs(file)
  }
}
