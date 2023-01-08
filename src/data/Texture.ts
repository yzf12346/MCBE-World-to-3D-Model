import {existsSync} from "fs";
import Jimp from "jimp";
import path from "path";
import {deserialize, serialize} from "v8";

export default class Texture {
  /**
   * 贴图的图像对象
   */
  private image_: Jimp;
  /**
   * 贴图的宽度
   */
  public width: number;
  /**
   * 贴图的高度
   */
  public height: number;
  /**
   * 贴图的路径
   */
  public path: string;
  /**
   * 贴图的名称
   */
  public name: string;

  /**
   * 加载贴图
   * @param path_ 路径
   */
  public static async load(path_: string) {
    if (!existsSync(path_)) {
      return undefined;
    }
    let img = await Jimp.read(path_);
    const texture = new Texture();
    // 读取文件路径
    texture.path = path_;
    // 读取文件名称
    texture.name = path.parse(path_).name;
    // 设置贴图
    texture.image_ = img;
    texture.onResize();

    return texture;
  }

  /**
   * 强制缩放(不使用插值)
   * @param mulW 宽度的缩放倍数
   * @param mulH 高度的缩放倍数
   */
  public async hardResize(mulW: number, mulH: number) {
    // 创建新图片
    // 并将旧图片位于(x,y)的颜色
    // 填充到新图片(x*mulW,y*mulH,(x+1)*mulW,(y+1)*mulH)范围内
    
    let newImg = await Jimp.create(this.width * mulW, this.height * mulH);
    // 遍历所有像素点 (x)
    for (let x = 0; x < this.image.getWidth(); x++) {
      // 遍历所有像素点 (y)
      for (let y = 0; y < this.image.getHeight(); y++) {
        // 获取像素点颜色
        let color = this.image.getPixelColor(x, y);
        // 设置新的贴图颜色
        for (let x1 = x * mulW; x1 < (x + 1) * mulW; x1++) {
          for (let y1 = y * mulH; y1 < (y + 1) * mulH; y1++) {
            newImg.setPixelColor(color, x1, y1);
          }
        }
      }
    }
    this.image = newImg;
    // this.onResize();
  }
  /**
   * 保存贴图
   * @param file 保存的文件路径
   */
  public save(file: string) {
    this.image.write(file);
  }
  /**
   * 克隆一个新的贴图
   * @returns 返回一个副本
   */
  public clone(): Texture {
    let texture = new Texture();
    texture.width = this.width;
    texture.height = this.height;
    texture.name = this.name;
    texture.path = this.path;
    texture.image = this.image.clone();
    return texture;
  }

  get image() {
    return this.image_;
  }
  set image(value: Jimp) {
    this.image_ = value;
    this.onResize();
  }

  /**
   * 重新计算图片尺寸
   */
  private onResize() {
    this.width = this.image.getWidth();
    this.height = this.image.getHeight();
  }

  /**
   * 将Texture序列化
   */
  async serialize():Promise<Buffer>{
    let obj:TextureSerialObj = {
      path : this.path,
      name : this.name,
      buffer : await this.image.getBufferAsync("image/png")
    };
    return serialize(obj);
  }

  /**
   * 解析序列化Texture
   */
  static async deserialize(buff:Buffer):Promise<Texture>{
    let data = deserialize(buff) as TextureSerialObj;
    let result = new Texture();
    result.name = data.name;
    result.path = data.path;
    result.image_ = await Jimp.read(data.buffer);
    result.onResize();
    return result;
  }
}

interface TextureSerialObj{
  path:string;
  name:string;
  buffer:Buffer;
}
