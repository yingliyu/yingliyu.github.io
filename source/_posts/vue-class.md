---
toc: true
title: vue动态绑定class与style
tags:
  - vue
description: vue动态绑定class与style
date: 2020-06-09 10:19:29
---

### 前言

> 基于 vue 开发的项目中有的交互需要修改元素的样式，就会用到 class 或 style 的动态绑定。当样式的属性值是变量时一般使用 style，其他情况最好使用 class，个人觉得这样模版代码更好维护一点。

##### 1.绑定 class 方式

js 代码：

```js
data(){
  return {
    isActive:true,
    isCenter: false,
    class2: 'align-center'
    }
  }
```

<!--more-->

###### （1）对象形式

```html
<span :class="{ 'active': isActive, 'align-center': !isCenter }">全部</span>
```

###### （2）数组形式

数组结合三目运算符

```html
<span :class="[isActive ? 'icon-arrow-up' : 'icon-arrow-down', class2]">全部 </span>
```

##### 2.绑定 style 方式

> 注意：短横线连接的属性名转换为驼峰命名格式，例如：font-size => fontSize

js 代码：

```js
data(){
  return {
    activeColor:'red'
    }
  }
```

###### （1）对象形式

```html
<span :style="{ color: activeColor, fontSize: '12px' }">全部</span>
```

###### （2）数组形式

```html
<span :style="[{color:activeColor},{fontSize:'12px'}]">全部</span>
```

###### （3）其他形式

```html
<span :style="{display:['-webkit-box', '-o-flexbox','flex']}">全部</span>
```
