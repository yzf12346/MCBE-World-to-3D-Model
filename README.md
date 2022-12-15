# MCBE-World-to-3D-Model
english | [简体中文
](https://github.com/yzf12346/MCBE-World-to-3D-Model/blob/master/README-zh.md)

`Minecraft bedrock World to 3D Model` is a nodejs software written in `Typescript`.
This project can use `WebSocket Server` to read `Minecraft Bedrock` blocks and export 3D model formats such as `.obj` `.fbx` format

## Features
- [ ] Load blocks from Minecraft
- [ ] Export type `.obj`
- [ ] Export type `.fbx`

## Install
Clone the repository:
```bash
git clone https://github.com/yzf12346/MCBE-World-to-3D-Model
```
Install dependencies:
```bash
npm install
```

## Build & Run
### Quick build and run:
```bash
sh run.sh
```
### Build and run manually
Build this project:
```bash
tsc
```
Run this project:
```bash
node build/Main.js
```

## Usage
### Connect
Execute below command in `Minecraft:bedrock`:
```
/connect localhost:2998
```
### Read blocks
Type below ~~command~~ in chat screen:
```
load <x:int> <y:int> <z:int> <x1:int> <y1:int> <z1:int>
```
