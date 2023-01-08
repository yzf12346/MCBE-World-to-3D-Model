import * as os from "os"

export default class PerformanceMonitor {
  private static beginMem: number;
  private static beginTime: number;

  public static start() {
    this.beginMem = os.freemem();
    this.beginTime = Math.floor(Date.now());
  }

  public static end(label: string, more: {lable: any, value: any}[] = []) {
    console.log("====== 性能统计 ======");
    console.log(`====== ${label} ======`);
    console.log(`运行耗时 : ${Math.floor(Date.now() - this.beginTime)}ms(${Math.floor(Date.now() - this.beginTime) / 1000}s)`);
    console.log(`内存占用 : ${(this.beginMem - os.freemem()) / Math.pow(2, 20)}MB`);
    for (let more_ of more) {
      console.log(more_.lable, " : ", more_.value);
    }
    console.log();
  }
}
