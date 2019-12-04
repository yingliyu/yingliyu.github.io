---
toc: true
title: js处理图片流并显示在页面上
categories: 前端
tags:
  - 前端
  - js
  - 文件流
comments: true
description: js处理图片流并显示在页面上
date: 2019-12-04 09:29:03
---


##### 前言

* * *

Ajax请求图片资源，服务器以文件流的形式返回，前端js处理图片流并将图片显示到页面上。

##### 基本思路
***
首先，使用axios发送Ajax请求时，将responseType（响应数据的类型）设置为“blob”（response 是一个包含二进制数据的 Blob 对象 ）。然后，对服务器返回的结果进行处理：


```
<img class="verifyPic" :src="verifyImg" />
```

```
// api获取数据
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
##### 结果示例图
***
![05a523487f390e572cda0e58660ebda6.png](en-resource://database/772:1)

##### 参考：

* [https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)