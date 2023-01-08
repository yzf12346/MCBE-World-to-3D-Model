
import {existsSync, readdirSync, statSync} from "fs";
import Jimp from "jimp";
import {join} from "path";
import {deserialize, serialize} from "v8";
import Texture from "./Texture";

/**
 * 图片区域类
 */
export class TextureAtlasRegion {
  x: number;
  y: number;
  uv: [number, number, number, number];
  texture: Texture;
}

/**
 * 贴图集
 * @description 注意所有贴图的尺寸应该为16*16 否则将取前16*16范围
 */
export default class TextureAtlas {
  private textureIndexs = new Map<string, number>();
  private texturesList: Texture[] = [];

  private _width: number;
  private _height: number;
  public width = 0;
  public height = 0;

  private unitSize: number = 16;

  public constructor() {
    this.calcSize();
  }

  /**
   * 加载贴图集
   */
  public static async load(path: string): Promise<TextureAtlas> {
    if (!existsSync(path)) {
      return undefined;
    }
    let atlas = new TextureAtlas();
    // 读取文件夹
    if (statSync(path).isDirectory()) {
      await this.readDirectionary(atlas, path);
    }
    // 读取文件
    else if (statSync(path).isFile()) {
      atlas.addTexture(await this.readFile(path));
    }
    atlas.calcSize();
    return atlas;
  }

  /**
   * 读取文件夹下的所有图片
   */
  private static async readDirectionary(atlas: TextureAtlas, path: string) {
    let files = readdirSync(path);
    let tasks = new Array<Promise<Texture>>();
    for (let file of files) {
      tasks.push(new Promise(res => {
        this.readFile(join(path, file)).then(texture=>{
          res(texture);
        })
      }));
    }

    (await Promise.all(tasks)).forEach(value=>{
      if (value == undefined){
        return;
      }
      atlas.addTexture(value);
    });
  }


  /**
   * 读取图片
   * @description 需要以.png/.jpg结尾
   * @param atlas 贴图集的引用
   * @param path 图片的路径
   */
  private static async readFile(path: string) {
    if (!(path.endsWith(".png") || path.endsWith(".jpg"))) {
      return undefined;
    }
    let texture = await Texture.load(path);
    if (!texture) {
      return undefined;
    }
    return texture;
  }

  /**
   * 添加图片
   * @param texture 贴图
   */
  addTexture(texture: Texture) {
    if (this.textureIndexs.has(texture.path)) {
      return this.textureIndexs.get(texture.path);
    }
    let value = this.texturesList.push(texture) - 1;
    // 设置单元尺寸
    // 防止出现16 * 1024序列帧，只考虑宽度
    if (texture.width > this.unitSize) {
      this.unitSize = Math.ceil(texture.width / 16) * 16;
    }
    this.textureIndexs.set(texture.path, value);
    this.calcSize();
  }
  /**
   * 判断是否被获取过
   */
  private geted: boolean = false;

  /**
   * 获取贴图
   */
  getTextureRegion(abspath: string) {
    let index = this.textureIndexs.get(abspath);
    if (index == undefined) {
      return undefined;
    }
    let region = new TextureAtlasRegion();

    // 计算区域的x,y
    region.x = Math.floor(index % this._width);
    region.y = Math.floor((index - region.x) / this._width);

    region.texture = this.texturesList[index];

    if (region.texture == undefined) {
      return undefined;
    }

    // 计算区域的宽度和高度
    region.uv = [
      region.x / this.width,
      region.y / this.height,
      (region.x + 1) / this.width,
      (region.y + 1) / this.height
    ];
    region.uv[1] = 1 - region.uv[1];
    region.uv[3] = 1 - region.uv[3];
    this.geted = true;
    return region;
  }

  /**
   * 获取贴图
   */
  getTexture(x: number, y: number) {
    this.geted = true;
    return this.texturesList[
      y * this._width + x
    ];
  }

  /**
   * 判断是否有贴图
   */
  hasTexture(path: string) {
    return this.textureIndexs.has(path);
  }

  /**
   * 计算贴图集的长宽
   */
  private calcSize() {
    let len = this.texturesList.length;
    if (this.geted) {
      throw new Error("禁止在获取(getTexture/getTextureRegion)之后调用 addTexture() 函数")
    }
    this._width = Math.ceil(Math.sqrt(len));
    this._height = Math.ceil(len / this._width);
    this.width = this._width;
    this.height = this._height;
  }

  /**
   * 遍历每个贴图
   */
  forEach(cb: (region: TextureAtlasRegion) => void) {
    let length = this.texturesList.length;
    for (let i = 0; i < length; i++) {
      cb(this.getTextureRegion(this.texturesList[i].path));
    }
  }

  /**
   * 保存贴图集
   */
  async save(path: string) {
    let saveimg = await Jimp.create(this.width * this.unitSize, this.height * this.unitSize);

    this.forEach(region => {
      let img = region.texture.image;
      for (let x_ = 0; x_ < img.getWidth(); x_++) {
        for (let y_ = 0; y_ < Math.min(img.getHeight(), img.getWidth()); y_++) {
          let x = region.x * this.unitSize + x_;
          let y = region.y * this.unitSize + y_;
          let color = img.getPixelColor(x_, y_);
          saveimg.setPixelColor(color, x, y);
        }
      }
    });

    await saveimg.writeAsync(path);
  }

  /**
   * 序列化TextureAtlas
   * @returns 返回序列化buffer
   */
  async serialize(): Promise<Buffer> {
    let obj: SerializaObject = {
      indexs: this.textureIndexs,
      textures: [],
      unitSize: this.unitSize,
      width: this.width,
      height: this.height
    };

    obj.textures = new Array(this.texturesList.length);

    // 遍及所有贴图序列化
    let tasks = [];
    this.texturesList.forEach((texture, i) => {
      tasks.push(new Promise(res => {
        texture.serialize().then(buffer => {
          obj.textures[i] = buffer;
          res(undefined);
        });
      }));
    });

    await Promise.all(tasks);
    return serialize(obj);
  }

  /**
   * 反序列化buffer
   * @param buff 目标Buffer
   * @returns 返回一个新的TextureAtlas
   */
  static async deserialize(buff: Buffer): Promise<TextureAtlas> {
    let result = new TextureAtlas();
    let obj = deserialize(buff) as SerializaObject;
    result._width = obj.width;
    result._height = obj.height;
    result.unitSize = obj.unitSize;

    result.texturesList = new Array(obj.textures.length);

    let tasks = [];
    obj.textures.forEach((buffer, i) => {
      tasks.push(new Promise(res => {
        Texture.deserialize(buffer).then(texture => {
          result.texturesList[i] = texture;
          res(undefined);
        });
      }));
    });
    await Promise.all(tasks);

    result.textureIndexs = obj.indexs;
    return result;
  }

  get size() {
    return this.texturesList.length;
  }
}

interface SerializaObject {
  indexs: Map<string, number>;
  textures: Buffer[];
  unitSize: number;
  width: number;
  height: number;
}
