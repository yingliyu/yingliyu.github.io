---
toc: true
title: ES6之你不知道的Array.from()
tags:
  - es6
description: ES6之你不知道的Array.from()
date: 2020-01-10 18:30:57
---

### 前言
先来了解几个概念：
>数组：是有序的元素序列，其索引是从0开始自然增长的整数，元素值可以是任何JavaScript值，并且包含一个名为length属性，该属性值表示数组元素的长度。

>对象：JavaScript中对象类型为一组无序的由键/值组成的数据集合，其元素的键名和值都可以自定义。

>类数组对象：是一种类似数组的对象。最基本的要求就是具有length属性的对象。

### 三种使用方式
根据传参的形式不同分为三种使用方式。


##### 1. Array.from({length: x}, Fn)
第一个参数指定了第二个参数的执行次数，返回一个长度为x的数组。
```js
Array.from({ length:3 }, () => 'lemon' )  // ["lemon", "lemon", "lemon"]

Array.from({ length: 3 }, (v, i) => i ) // 生成一个从0开始的的数组[0, 1, 2] 这里我暂时还有疑问参数v是什么？？？

Array.from({ length: 3 }, (v, i) => item = { year: i + 2000 }) // 生成一个年份对象数组[{'year': 2000, 'year': 2001, 'year': 2002}]
```

<!--more-->
##### 2.  Array.from(obj, mapFn)
obj指数组，类数组对象或set对象，第二个参数mapFn作用类似于数组map方法，用来对每个元素进行处理，将处理后的值放入返回的数组中。
```js
// 将一个数组中布尔值为false的成员指为特定字符串lemon
Array.from( [1, ,2,3], i => i || "lemon" ) // [1, "lemon", 2, 3]

// 将一个类似数组的对象转为一个数组，并在原来的基础上乘以2倍
let likeArray = { '0': '1', '1': '3', '2': '5', length: 3 }
Array.from(likeArray, i => i*2) //[ 2, 6,10 ]

// 将一个set对象转为数组，并在原来的基础上加2
Array.from(new Set([1,2,3]), i => i+2) // [3,4,5]
```
##### 3. Array.from(String)
参数是字符串。
```js
Array.from('hello')  // ['h','e','l','l','o']
```

### 最后
>我的应用：生成从2020（本年）~ 1900 年的一个数组。

当然有很多方法可以来实现，我就想说ES6中有没有快捷的新方法来学习一下，Array.from用起来体验不错哦。
```
const len = new Date().getFullYear() - 1900 + 1
Array.from({ length: len }, (v, i) => i + 1900 ).reverse()
```
目前我的疑问，第二个参数里函数的两个参数v, i分别是什么，为什么不传v的时候数组每项就变成undefined或NaN了？

>本文有不到之处欢迎交流指正~
