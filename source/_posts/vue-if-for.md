---
toc: true
title: vue中v-for和v-if不能同时使用解决方案
tags:
  - v-for与v-if
description: vue中v-for和v-if不能同时使用解决方案
date: 2020-06-16 09:44:21
---

### 前言

> 为什么不可以呢？我们 `JS` 的使用习惯在遍历时使用条件判断是很常见的， `vue` 模版中当然也是可以使用的，但是`v-for`和`v-if`不可以出现在同一个元素上。
> 因为在 `vue` 中会优先执行 `v-for`,如果每一次都遍历整个数组，将会影响速度，尤其是当之需要渲染很小一部分的时候。

### 使用情景

> `v-for` 和 `v-if` 同时使用有 3 种情景：
>
> 1.  部分遍历（内/外部条件）：一个 `list` 中某个属性值符合条件的遍历出来；
> 2.  全部遍历（外部条件）：某外部条件符合条件时遍历全部。
> 3.  全部遍历（内部条件）：根据某内部条件渲染出不同的内容。

注：内部条件指被遍历数据内部属性值或条件；外部条件指与独立于被遍历数据以外的数据。

<!--more-->

### 1.使用计算属性（内/外部条件）

> 在计算属性中先用内/外部条件处理数据，再遍历处理后的数据

```html
<!-- 遍历list，条件是值小于100 方案：使用计算属性activeList首先筛选出符合条件的值再直接遍历 -->
<ul>
  <li v-for="item in activeList" :key="item"></li>
</ul>
```

```js
export default {
  data() {
    return {
      list: [78, 90, 20, 45, 66, 120, 136]
    }
  },
  computed: {
    activeList() {
      return this.list.filter((item) => item < 100)
    }
  }
}
```

### 2.条件放于父级元素（外部条件）

> 解决方案：外部条件放到遍历的父级元素上，没有父级可以使用`<template></template>`。

```html
<ul v-if="isActive">
  <li v-for="item in list" :key="item"></li>
</ul>
<!-- or -->
<div>
  <template v-if="isActive">
    <span v-for="item in list" :key="item"></span>
  </template>
  <p>Hello,My name is Lillian!</p>
</div>
```

```js
export default {
  data() {
    return {
      isActive: true,
      list: [78, 90, 20, 45, 66, 120, 136]
    }
  }
}
```

### 3.遍历 `template`（内部条件）

> 根据某内部条件，显示不同内容。注意 `key` 不能放 `template` 标签上。

```html
<div>
  <template v-for="item in list">
    <span v-if="item.type===0" :key="item.id">文字+图标</span>
    <span v-if="item.type===1" :key="item.id">文字+文字</span>
    <span v-else :key="item.id">其他</span>
  </template>
</div>
```

`vue` 中会优先执行 `v-for`, 当 `v-for` 把所有内容全部遍历之后 , `v-if` 再对已经遍历的元素进行删除 , 造成了加载的浪费 , 所以应该尽量在执行 `v-for` 之前优先执行 `v-if` , 可以减少加载的压力。

参考：[https://cn.vuejs.org/v2/style-guide](https://cn.vuejs.org/v2/style-guide/#%E9%81%BF%E5%85%8D-v-if-%E5%92%8C-v-for-%E7%94%A8%E5%9C%A8%E4%B8%80%E8%B5%B7%E5%BF%85%E8%A6%81)
