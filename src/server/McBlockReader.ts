import {randomUUID} from "crypto";
import EventEmitter from "events";
import WebSocket, {WebSocketServer} from "ws";
import Block from "../data/Block";
import BlockManager from "../manager/BlockManager";
import TranslateManager from "../manager/TranslateManager";
import vec3 from "../tsm/src/vec3";

export default class McBlockReader {
  private server: WebSocketServer;
  private event: EventEmitter;
  private client: WebSocket | undefined;

  /**
   * @param port 服务器的端口
   */
  public constructor(port: number) {
    this.event = new EventEmitter();
    this.server = new WebSocketServer({
      host: "localhost",
      port: port
    });

    this.server.on("connection", async (client, _req) => {
      this.client = client;
      console.log("客户端链接");

      // 初始化事件系统
      client.on("message", (data) => {
        let json = JSON.parse(data.toString());
        this.event.emit(json.header.requestId, json);
      });

      // 初始化客户端语言
      await this.getClientLanguage();
    });
  }

  /**
   * 使用坐标获取方块
   * @param x 方块的x坐标
   * @param y 方块的y坐标
   * @param z 方块的z坐标
   * @returns 方块的全名(没有命名空间)
   */
  public async getBlock(x: number, y: number, z: number): Promise<Block> {
    await this.pRunCommand(`tp @a ${x} ${y} ${z}`);
    let data = await this.pRunCommand(`testforblock ${x} ${y} ${z} air`);
    if (data.body.matches == true) {
      let result = BlockManager.getBlock("air");
      result.position = new vec3([x,y,z]);
      return result;
    }
    // 获取方块的本地化命名
    // 例如:
    // zh_CN -> 石头
    // ru_RU -> Камень

    let blockLocalName = (data.body.statusMessage as string).split(" ")[3];
    let blockRawName = undefined;
    // 考虑没有翻译 比如tile.wall_sign.name
    if (blockLocalName.startsWith("tile.")) {
      blockRawName = blockLocalName;
    }
    else {
      blockRawName = TranslateManager.getRawText(
        await this.getClientLanguage(),
        blockLocalName);
    }

    let blockID = blockRawName.split(".")[1];

    // 获取方块的特殊值
    // 最大为20
    for (let i = 0; i < 20; i++) {
      let result = await this.pRunCommand(`testforblock ${x} ${y} ${z} ${blockID} ${i}`);
      if (result.body.matches == true) {
        let result = BlockManager.getBlock(blockID,i);
        result.position = new vec3([x,y,z]);
        return result;
      }
    }

    let result = BlockManager.getBlock(blockID);
    result.position = new vec3([x,y,z]);
    return result;
  }

  /**
   * 运行命令(Promise)
   * @param cmd 需要执行的指令
   * @returns 命令执行结果
   */
  public async pRunCommand(cmd: string): Promise<any> {
    return new Promise(res => {
      this.runCommand(cmd, (result) => {
        res(result);
      })
    });
  }

  /**
   * 运行命令(Callback)
   * @param cmd 需要执行的指令
   * @param cb 执行结果的回调
   */
  public runCommand(cmd: string, cb: (res: any) => void) {
    let json = {
      "body": {
        "origin": {
          "type": "player"
        },
        "commandLine": cmd,
        "version": 1
      },
      "header": {
        "requestId": randomUUID(),
        "messagePurpose": "commandRequest",
        "version": 1,
        "messageType": "commandRequest"
      }
    }

    this.client.send(JSON.stringify(json));
    this.event.once(json.header.requestId, cb);
  }

  private language: string = undefined;
  public async getClientLanguage() {
    if (this.client == undefined) {
      return;
    }
    let result = await this.pRunCommand("list");

    if (this.language) {
      return this.language;
    }

    let regions = TranslateManager.listRegions();
    for (let region of regions) {
      let cmdMsg = result.body.statusMessage as string;

      if (cmdMsg.slice(0, 2) == TranslateManager.getTranslate(region, "commands.players.list").slice(0, 2)) {
        return region;
      }
    }
    throw new Error("地区获取错误");
  }

  /**
   * 获取服务器对象
   */
  public getServer() {
    return this.server;
  }
}
