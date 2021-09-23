---
toc: true
title: 文件下载的三种方式
tags:
  - 上传/下载
description: 文件上传/下载
date: 2021-09-23 14:29:09
---

##### 一.静态资源在前端

将静态资源文件直接放于` public` 目录下，打包时 `public` 文件不会被编译。
注意：静态资源的路径，在 public 文件夹下路径是`./文件名`

```html
<a class="download-file" href="./file.xlsx" download="模板.xlsx">下载模板文件</a>
```

##### 二.后端 API 返回静态资源下载 url

原理：使用`a`标签下载

##### 三.后端 API 返回文件流

<!--more-->

> 本文不到之处欢迎指正，感谢~
