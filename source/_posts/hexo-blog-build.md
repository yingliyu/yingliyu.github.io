---
toc: true
title: Hexo4.0搭建博客及自动部署
tags:
  - hexo
description: Hexo4.0搭建博客及自动部署至Github和Coding
date: 2019-12-04 09:35:40
categories:
  - Hexo
---

##### 前言

> 环境：GIT、 NODE
> 应用：Hexo4.0 + Github Pages + Github Actions 搭建博客并自动部署至 Github 和 Coding

##### 搭建项目

一、 安装 hexo

1.创建一个文件夹 blog，cd blog 目录下。 2.执行 hexo 命令全局安装：**_npm i -g hexo_** 3.安装成功，查看版本 **_hexo -v_** 如下：

<!--more-->

![image1](Image1.png) 4.初始化项目 **_hexo init_** 生成如下文件：
![image2](Image2.png)

##### 部署项目

1. 修改\_config.yml 文件中的配置项如下：
   （\*注意：文中涉及到的 githubName 均为你的 github 名称）

```
deploy:
  type: git
  repo: https://github.com/githubName/githubName.github.io.git
  branch: master
```

然后依次执行如下命令：

```
hexo clean
hexo generate
hexo server
```

浏览器访问：http://localhost:4000

##### 托管代码到 github

1. 首先创建一个 repository，名称为 yourGithubName.github.io, 其中 yourGithubName 一定要是你的 github 名称。
2. 生成 SSH 添加到 github。执行命令：
   $ ssh-keygen -t rsa -b 4096 -C "your_email@example.com" 然后去本地 C/Users/you/.ssh/id_rsa 目录下找到 id_rsa.pub 文件并复制文件内容，去 github 的 settings/SSH and GPG keys 下 New SSH key 粘贴 Add SSH key 即可。
3. 进入 blog 目录 clone 仓库。
   执行 :

```
git init
git add .
git commit -m "hexo init"
git remote add origin git@github.com:githubName/githubName.github.io.git
git push -u origin gh-pages
```

注：我是将项目源代码放到默认分支 gh-pages，后面使用 GitHub Actions 将 actions 里新建的.yml 文件 commit 至此分支（坑：如果将其 commit 到 master 分支部首次部署没问题，但是部署完成后就会被编译生成的文件覆盖掉，导致无法继续自动部署）；项目编译之后的文件必须放到 master 分支，这样才可以通过 githubName.github.io 直接访问博客首页。

执行命令：（用于部署项目）

```bash
npm install hexo-deployer-git --save
```

然后部署

```
hexo clean
hexo generate
hexo deploy
```

浏览器访问：http://yourGithubName.github.io
注意: 如果 deploy 需要输入用户信息 配置一下即可，执行命令:

```javascript
git config --global user.name "username"
git config --global user.email "your_email@xxx.com"
```

##### 使用 github actions 实现自动部署

Github Actions 是 github 的 <u>**持续集成**</u>（Continuous integration，简称 CI）服务。

脚本 demo：

```
name: Hexo deployer
on:
  push:
    branches:
      - gh-pages
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: Build and Deploy
      uses: JamesIves/github-pages-deploy-action@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        BASE_BRANCH: gh-pages
        BRANCH: master
        FOLDER: public
        BUILD_SCRIPT: npm i -g hexo && npm install && hexo generate && hexo deploy
```

##### 最后

> 我的博客：
> [https://lemon1499.github.io](https://lemon1499.github.io) >[https://ylyu.coding.me](https://ylyu.coding.me?_blank)

##### 参考

[http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html?_blank)

本文有不到之处欢迎交流指正，感谢~
