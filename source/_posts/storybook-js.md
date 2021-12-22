---
toc: true
title: 使用Storybook从零搭建组件库
tags:
  - 框架学习
  - Storybook
date: 2021-12-22 15：49：30
description: 使用Storybook从零搭建组件库
---

## 前言

Storybook 是一种 UI 开发工具。它通过隔离组件使开发更快更容易，它可以一次只处理一个组件，使用 storybook 可以开发整个 ui，同时不需要启动一个复杂的开发项目，强制将某些数据放入数据库，或者浏览应用程序。使用 Storybook 可以在 web 应用程序中构建小的原子组件和复杂的页面。
​

> Storybook 可以做什么？

工作中开发的 UI 组件或页面可以用 Storybook 帮助你记录并生成 API 文档，增强代码重用性，大大的提高工作效率，并自动可视化地测试组件以防止 bug。
同时它支持 Vue 和 React，工作的同时，可以用它来沉淀一个自己的组件库，面试的时候这也是一个谈资。
![image](image.png)

## 安装&创建一个组件库

<!--more-->

```javascript
// 使用create-react-app初始化一个项目
npx create-react-app my-app

// 进入项目根目录
cd my-app

//安装storybook/cli脚手架并安装依赖
npx -p @storybook/cli sb init

//启动你的storybook组件库项目
npm run storybook

```

## 使用 Github Actions 托管组件库

1. 首先明确项目至少有两个分支，以`master`和`gh-pages`为例。

`master`分支是源码，开发在此分支，`gh-pages`是项目打包后生成的静态资源文件。
然后，在此项目仓库`Settings->Pages`页面选择 gh-pages 作为静态资源分支，直接在`root`，即根目录下。
如果有自己的域名的话也可以设置 Custom domain。

2. 首先生成一个密钥，然后将密钥至仓库。

​

> step1. 生成一个 github 密钥。

`Github Settings`->`Developer settings`->`Personal access tokens`->`Generate new token`->`Generate token`->`Copy token`

> step2. 将密钥添加到当前仓库中。

进入当前`respository`->`Settings->Secrets`->`New repository secret`->`Paste token from step1`
​

eg. Name: ACCESS_TOKEN

3. 修改 package.json 文件 scripts

```javascript
"scripts": {
	"storybook": "start-storybook -p 6006 -s public",
    "build-storybook": "rm -rf ./dist/docs && build-storybook -o ./dist/docs",
}
```

4. 添加 action

在此项目仓库点击 Action-> New workflow->Node.js
deploy.yml

```javascript
name: Deployer # Actions 名字

on: # 触发条件
  push:
    branches:
      - master # 仅向 master 分支 push 时触发

jobs:
  build: # job id
    name: Build and publish # job 名，不写默认使用 job id
    runs-on: ubuntu-latest # 运行环境，可选 ubuntu-latest, ubuntu-18.04, ubuntu-16.04, windows-latest, windows-2019, windows-2016, macOS-latest, macOS-10.14

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js 14.x
        uses: actions/setup-node@v2
        with:
          node-version: 14.x

      - name: Setup  env
        run: |
          npm install
      - name: Generate public files
        run: |
          npm run build-storybook

      - name: Deploy
        env:
          GH_REF: github.com/yingliyu/my-app.git # 仓库地址
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }} # github token
        run: |
          git config --global user.name "your name"
          git config --global user.email "your email"
          git clone https://${GH_REF} .deploy_git
          cd .deploy_git
          git checkout gh-pages
          cd ../
          mv .deploy_git/.git/ ./dist/docs
          cd ./dist/docs
          git add .
          git commit -m ":construction_worker:CI built at `date +"%Y-%m-%d %H:%M:%S"`"
          # GitHub Pages
          git push --force --quiet "https://${ACCESS_TOKEN}@${GH_REF}" gh-pages:gh-pages

```

创建成功会在项目中生成.github/workflows/deploy.yml 。

## 使用 Github Pages 访问组件库

在 master 分支修改源代码，然后 push，此时 action 会自动执行并打包部署，通过仓库 Settings->Pages 里显示的 Your site 访问即可。

## 参考

本文内容参考: [React](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) 、[storybook](https://storybook.js.org/)

## 尾巴

> 我的组件库：[Fish-Design](https://yingliyu.github.io/fish-design)

> 关于我的博客：[我的博客](https://yingliyu.github.io/)

> 掘金：[掘金](https://juejin.cn/post/7044428114264326175/)
