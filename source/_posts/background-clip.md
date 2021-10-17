---
toc: true
title: background-clip属性详解
tags:
  - CSS
description: background-clip属性详解
date: 2019-12-09 19:06:20
categories:
  - CSS
---

> 对于每个前端开发者来说，CSS 中的 **background** 属性用起来该是游刃有余了。但是 CSS3 的 **background-clip** 属性可能不太了解，下面就来跟我一起学习这个属性吧。

`background-clip`，顾名思义肯定跟背景裁切有关。没错，它存在以下四个属性值

- border-box（默认值）
- padding-box
- content-box
- text

我在网上查了很多资源大部分都只写了前三个属性值，这也是这篇博客诞生的缘故之一。作为一个笔记，假如碰巧被你看到，再碰巧对你有所帮助那就再好不过啦~

下面我们通过具体 Demo 介绍一下每个属性值。

<!--more-->

容器盒子详情如下：
![box](box.jpg)

## 1.border-box（默认值）

_css 代码：_

```css
  .clip-box{
    width: 500px;
    height: 300px;
    padding: 40px;
    margin:0px auto;
    border: 20px dashed rgba(204, 64, 64, 1);
    background-color: orange;
    background-clip:border-box; 
    box-sizing: border-box;
  }
```

_html 代码_：

```html
<div class="clip-box">CSS3背景裁切属性详解 by YYL</div>
```

页面效果图：（背景色从`border`的外边缘开始）
![clip1](clip1.jpg)

## 2.padding-box

css 代码：

```css
.clip-box{
    width: 500px;
    height: 300px;
    padding: 40px;
    margin:0px auto;
    background-clip:padding-box; 
    background-color: orange;
    box-sizing: border-box;
    border: 20px dashed rgba(204, 64, 64, 1);
  }
```

html 代码：

```html
<div class="clip-box">CSS3背景裁切属性详解 by YYL</div>
```

页面效果图：（背景色从 padding 开始）
![clip2](clip2.jpg)

## 3.content-box

css 代码：

```css
.clip-box{
    width: 500px;
    height: 300px;
    padding: 40px;
    margin:0px auto;
    background-clip:content-box; 
    background-color: orange;
    box-sizing: border-box;
    border: 20px dashed rgba(204, 64, 64, 1);
  }
```

html 代码：

```html
<div class="clip-box">CSS3背景裁切属性详解 by YYL</div>
```

页面效果图：（背景色从内容 content 开始）
![clip3](clip3.jpg)

## 4.text

css 代码：

```css
.clip-box{
    width: 500px;
    height: 300px;
    padding: 40px;
    margin:0px auto;
    background-clip:text; 
    -webkit-background-clip:text;
    background-color: orange;
    box-sizing: border-box;
    border: 20px dashed rgba(204, 64, 64, 1);
    font-size: 40px;
    color: transparent;
  }
```

html 代码：

```html
<div class="clip-box">CSS3背景裁切属性详解 by YYL</div>
```

页面效果图：
![clip4](clip4.jpg)

> 你可能会说给文字加颜色直接用 color 属性岂不是更好更方便。是的，但如果我想加渐变背景色呢？加背景图呢？这时就是它大显神通的时候了。
> 应用如下：

```css
.clip-box{
    width: 500px;
    height: 260px;
    padding: 40px;
    margin:0px auto;
    background: linear-gradient(to bottom, orange,green);
    background-clip:text; 
    -webkit-background-clip:text;
    box-sizing: border-box;
    border: 20px dashed rgba(204, 64, 64, 1);
    font-size: 40px;
    color: transparent;
  }
```

html 代码：

```html
<div class="clip-box">CSS3背景裁切属性详解 by YYL</div>
```

![clip-text](clip-text.jpg) ![clip-img](clip-img.jpg)

本文有不到之处欢迎交流指正，感谢~
