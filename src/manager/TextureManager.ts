import {join} from "path";
import TextureAtlas from "../data/TextureAtlas"
import vec2 from "../tsm/src/vec2";
import Constants from "../utils/Constants";
import {isDirectory} from "../utils/FileUtils";
import PerformanceMonitor from "../utils/PerformanceMonitor";

export default class TextureManager {
  public static textureAltas: TextureAtlas;

  public static async init() {
    if (!isDirectory(Constants.RESOURCE_DIR)) {
      throw new Error("目标资源包文件夹不存在 : " + Constants.RESOURCE_DIR);
    }

    const textureDir = join(Constants.RESOURCE_DIR, "textures/block");
    if (!isDirectory(textureDir)) {
      throw new Error("贴图文件夹不存在 : " + textureDir);
    }

    // const task = new Array<Promise<void>>();

    // 读取所有贴图
    //for (let textures of readdirSync(textureDir)){
    //  let fullpath = join(textureDir,textures);
    //  task.push(new Promise((res)=>{
    //    
    //  }));
    /*if (isFile(cacheFile)){
      PerformanceMonitor.start();
      let buffer = readFileSync(cacheFile);
      this.textureAltas = await TextureAtlas.deserialize(buffer);
      PerformanceMonitor.end("从缓存加载");
      return;
    }*/
    PerformanceMonitor.start();
    this.textureAltas = await TextureAtlas.load(textureDir);
    // mkdirSync("temp");
    PerformanceMonitor.end("贴图加载完成",
      [
        {
          "lable": "贴图数量",
          "value": this.textureAltas.size
        }
      ]);
    // writeFile(cacheFile, await this.textureAltas.serialize(), () => {});
  }

  public static getTextureAtlas(): TextureAtlas {
    return this.textureAltas;
  }

  /**
   * 根据贴图名称获取区域
   * @param name 如grass stone
   */
  public static getRegion(name: string) {
    const textureDir = join(Constants.RESOURCE_DIR, "textures/block");
    let fp = join(textureDir, name + ".png");
  
    let res = this.textureAltas.getTextureRegion(fp);
    if (res == undefined){
      console.error("贴图 TextureManager::getRegion (name=",name,")");
    }
    return res;
  }

  public static getUvs(
    name: string,
    uvs: [number, number, number, number],
    rot: boolean = false) {
    let re = this.getRegion(name);

    let reUV = [
      re.uv[0] + (re.uv[2] - re.uv[0]) * (uvs[0] / 16),
      re.uv[1] + (re.uv[3] - re.uv[1]) * (uvs[1] / 16),
      re.uv[0] + (re.uv[2] - re.uv[0]) * (uvs[2] / 16),
      re.uv[1] + (re.uv[3] - re.uv[1]) * (uvs[3] / 16),
    ];

    let u = new vec2([
      reUV[0],
      reUV[1]
    ]);

    let v = new vec2([
      reUV[2],
      reUV[3]
    ]);

    let offset = u.copy().subtract(v.copy()).scale(0.00325);

    u.subtract(offset);
    v.add(offset);

    if (rot) {
      return [
        new vec2([v.x, v.y]),
        new vec2([v.x, u.y]),
        new vec2([u.x, u.y]),
        new vec2([u.x, v.y]),
      ];
    }
    //console.log(reUV);
    
    return [
      new vec2([u.x, v.y]),
      new vec2([v.x, v.y]),
      new vec2([v.x, u.y]),
      new vec2([u.x, u.y])
    ];
  }
}
