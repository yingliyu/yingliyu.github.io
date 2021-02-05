---
toc: true
title: Vue3的新特性(二)：生命周期
tags:
  - vue3
description: vue3
date: 2021-01-13 14:38:44
---

### 生命周期钩子函数

vue3 更新了生命周期钩子函数。
可以直接通过 import 对应的函数（例如：onMounted）来注册生命周期钩子函数。

Options API -> Hook inside `setup`

1. ~~beforeCreate~~ -> use setup()
2. ~~created~~ -> use setup()
3. beforeMount -> onBeforeMount
4. mounted -> onMounted
5. beforeUpdate -> onBeforeUpdate
6. updated -> onUpdated
7. beforeUnmount -> onBeforeUnmount
8. unmounted -> onUnmounted
9. errorCaptured -> onErrorCaptured
10. renderTracked -> onRenderTracked（调试用）
11. renderTriggered -> onRenderTriggered（调试用）

因为 setup 是在 beforeCreated 和 created 几乎是同时进行的，所以可以将在这两个生命周期里的代码写在 setup 里面。

<!--more-->
<!-- ![life](circle.png) -->
<img width='600px' style='display:block;margin:20px auto;' src='circle.png'>

使用：

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'
const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```

[更多内容参考 vue3](https://v3.vuejs.org/guide/composition-api-lifecycle-hooks.html)
