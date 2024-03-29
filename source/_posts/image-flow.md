---
toc: true
title: js处理图片流并显示在页面上
tags:
  - js
  - 文件流
categories:
  - js
  - 文件流
comments: true
description: js处理图片流并显示在页面上
date: 2019-12-04 09:29:03
---

### 前言

> Ajax 请求图片资源，服务器以文件流的形式返回，前端 js 处理图片流并将图片显示到页面上。

### 基本思路

首先，使用 axios 发送 Ajax 请求时，将 responseType（响应数据的类型）设置为“blob”（response  是一个包含二进制数据的  Blob  对象  ）。然后，对服务器返回的结果进行处理：

```
<img class="verifyPic" :src="verifyImg" />
```

<!--more-->

```
// API获取数据
getImgVcode() {
      try {
        axios.post('/api/getImgVcode'，{
            responseType: 'blob'
        })
        .then(res){
            // 使用fileReader对文件对象进行操作 
            const reader = new FileReader()
            // 读到的是URL格式的Base64字符串
            reader.readAsDataURL(res)
            reader.onload = (result) => {
              this.verifyImg = result.target.result // 更新图片的src
            }
        }
        .catch(error){
            console.log(error)
        }
```

### 结果示例图

![num-img](num-img.png)

### 最后

参考： [https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

本文有不到之处欢迎交流指正，感谢~
