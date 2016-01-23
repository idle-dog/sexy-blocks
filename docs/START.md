# 项目开发及工具使用说明

## 第一步：安装运行环境

安装 [nodejs](https://nodejs.org/) 运行环境

## 第二步：克隆仓库

首先你需要 [fork](https://help.github.com/articles/fork-a-repo/) 本项目，然后将fork的仓库clone到本地：

```bash
git clone git@github.com:[你的用户名]/sex-bo.git
cd sexy-blocks/src
```

> 注意，要进入到 ``src`` 目录下进行操作!

## 第三步：安装fis

本项目选择fis作为集成开发环境

```bash
npm i -g fis
```
## 第四步：启动调试服务器

fis内置了一个调试服务器，方便本地预览项目

```bash
fis server start
```

## 第五步：构建

```bash
fis release -wL
```

在项目目录中执行 ``fis release`` 命令，即可将项目构建到调试服务器的临时目录中进行预览，release命令后添加的 ``-wL`` 参数表示对项目代码进行修改监听，发现有改动会立即触发重新构建，并自动刷新浏览器。

> 注意，参数中的 ``L`` 是大写。

## 第六步：预览

使用浏览器访问 http://localhost:8080/ 进行项目预览

## 第七步：开发

修改代码并保存，浏览器会自动刷新页面，不断完善你的代码，直至完成任务所要求的内容。

## 第八步：提交

功能开发完成后，即可提交代码，并发起 pull request 合并至当前项目中，一旦代码被合并，就会触发 travis-ci 自动构建，届时可以访问 http://idle-dog.github.io/sexy-blocks/ 查看测试环境运行效果。