# MCBE-World-to-3D-Model
english | [简体中文
](https://github.com/yzf12346/MCBE-World-to-3D-Model/blob/refactoring/README-zh.md)

`Minecraft bedrock World to 3D Model` 是一个使用`Typescript`编写的nodejs开源程序.
此程序使用 `WebSocket Server` 读取`我的世界基岩版`存档方块信息，并导出为3D模型格式，列如 : `.obj` `.fbx`

## 特性
- [ ] 从我的世界基岩版加载方块
- [ ] 导出 `.obj` 格式
- [ ] 导出 `.fbx` 格式

## 安装
克隆仓库:
```bash
git clone https://github.com/yzf12346/MCBE-World-to-3D-Model
```
安装依赖项:
```bash
npm install
```

## 构建 & 运行
### 快速 构建 & 运行
```bash
sh run.sh
```
### (我是骨灰玩家)手动 构建 & 运行
构建项目:
```bash
tsc
```
运行项目:
```bash
node build/Main.js
```

## 使用
### 链接
在`我的世界基岩版`执行以下命令:
```
/connect localhost:2998
```
### 读取方块
输入以下~~命令~~在聊天界面
```
load <x:int> <y:int> <z:int> <x1:int> <y1:int> <z1:int>
```
示例:
```
load 0 0 0 5 5 5
```
