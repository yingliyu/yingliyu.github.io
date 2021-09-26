---
toc: true
title: Hexo更换主题出现空白index.html
tags:
  - Hexo
  - Hexo版本升级
date: 2021-09-26 15:32:00
description: Hexo更换主题出现空白index.html解决方案
---

## 前言

搭建博客很久了，之前用的`yilia`主题很喜欢，最近又"移情别恋"上了 `ayer` 这种简单有点技术控的风格主题，又开始折腾一番。下面记录一下我的折腾轨迹...

版本：
`hexo: 4.2.1`
`hexo-cli: 3.1.0`
`node: 12.13.0`

## 目的

更换主题

<!--more-->

## 步骤

开始安装新主题并使用

###### 1.安装主题

hexo-theme-ayer 主题对 hexo 版本>=5.0 和<5.0 有两种不同的安装方法，因为我的 hexo<5.0 采用<5.0 的安装方法：

```
// hexo < 5.0
git clone https://github.com/Shen-Yu/hexo-theme-ayer.git themes/ayer
```

安装成功会在项目的 `themes` 目录下多一个 `ayer` 目录，`ayer` 根目录有一个`_config.yml` 主题配置文件

###### 2.修改

将博客根目录下的 `_config.yml` 里的` theme` 值修改成 `ayer`

```
theme: ayer
```

然后根据自己的需要修改主题的配置文件 `themes/ayer/_config.yml`
最后，重新`hexo g`构建。

## 发现问题

问题出现了，发现构建的 public 目录下的 index.html 文件都是空的，访问博客显示空白。

## 解决问题

在网上查了一下，有相似问题的说是缺少依赖，先`npm ls --depth 0`查看 npm 插件缺失情况，一般情况下出现`npm ERROR！missing xxx`
说明 xxx 插件缺失，然后依次将所有缺失的插件安装上。
执行了以上操作之后依然不行，解决不了我的问题。

最后决定一不做二不休，干脆直接升级 `hexo` 到 5.x.x 版本。
执行以下指令进行版本升级：

```
npm install -g npm-check # 检查之前安装的插件，都有哪些是可以升级的
npm install -g npm-upgrade # 升级系统中的插件
npm-check
npm-upgrade  #更新
# 更新 hexo 及所有插件
npm update
# 查看版本 确认 hexo 已经更新
hexo -v
```

升级之后版本：
`hexo: 5.4.1`
`hexo-cli: 3.1.0`
`node: 12.13.0`

删除之前步骤 1 安装的（ hexo 版本<5.0 ） `ayer` 主题（/themes/ayer）,然后使用 hexo>5.0 的安装方法重新安装：

```
npm i hexo-theme-ayer -S
```

安装完成后会在根目录生成一个`_config.ayer.yml` 文件，直接编辑`_config.ayer.yml` 文件进行配置即可。
最后，重新`hexo g`构建，构建成功，index.html 文件内容正常，发布之后博客正常显示，问题解决。

参考：[Ayer 中文说明](https://shen-yu.gitee.io/2019/ayer/#%E5%AE%89%E8%A3%85)

错误之处欢迎交流指正，感谢~
