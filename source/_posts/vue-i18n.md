---
toc: true
title: Vue+vue-i18n+Element UI实现多语言切换
tags:
  - i18n
description: Vue+vue-i18n+Element UI实现多语言切换
date: 2019-12-26 18:03:51
---

###### 前言

> Vue I18n 是 Vue.js 的国际化插件。最近项目需求——给网站加中英文语言切换功能，使用的是 vue-i8n。老大修改了项目架构使项目支持 i8n，铺垫做的好就使用起来很 easy 了，整理数据然后比着葫芦画瓢就实现了想要的功能。一直以来我的短板就是学习东西不够深入，总是浅尝辄止于会用，发现了不足就去努力克服吧。不能止步于会用，现在就开始从头学习整理一下项目架构是如何配合 i18n 来使用的。

###### 1.安装

1)npm

```Bash
npm install vue-i18n
```

2)yarn

```bash
yarn add vue-i18n
```

###### 2.开始

<!--more-->

结合 ElementUI 国际化文档，再 main.js 的同级创建目录 lang，cd lang 目录然后创建目录 en、zh-cn 和 index.js 文件，目录结构如下：
![Image1.png](Image1.png)

然后目录 en 和 zh-cn 中再分别创建入口文件 index.js 和需要的模块目录(这里只加了 login 模块)。最终如下：
![Image2.png](Image2.png)

###### 3.使用

在 lang/index.js 中：

```js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
// element-ui lang
import elementEnLocale from 'element-ui/lib/locale/lang/en'
// element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from './en'
import zhLocale from './zh-cn'
import store from '@/store'
Vue.use(VueI18n)
// http: //element-cn.eleme.io/2.4/#/zh-CN/component/i18n
// 非5.x版本vue-i18n 需要用一下方式兼容
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}
const i18n = new VueI18n({
  // set locale
  // options: en or zh
  locale: store.getters.language || 'en', // 默认显示英文 // set locale messages
  messages
})
export default i18n
```

> 准备的差不多了，然后开始在项目中使用 i18n，在已有的 main.js 中加入：

```js
import i18n from './lang'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
new Vue({ i18n }).$mount('#app')
```

> 然后再 en/index.js 中导出你的数据：

```js
// login
import login from './login'
export default {
  login
}
```

> 当你 login 的数据如下时：

![Image3.png](Image3.png)

> 你可以通过 **_\$t('moduleName.key')_** 这么使用它们：

![Image4.png](Image4.png)

> 不好奇\$t 是什么吗？可以打出来自己看看

```js
console.log(this.$t)
console.log(this.$i18n)
console.log(this.$t('login'))
```

> 然后切换语言时，将其存储到 vuex 中：

```js
changeLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.commit('set_language', lang)
    }
```

###### 4.最后

> 我想既然是全局使用，直接存到 cookie 中就可以了刷新干什么页面数据都有效的，为什么还要放到 vuex 中呢？试了一番发现其他都没问题却忽略了中英文小图标的存在，需要双向绑定来保证点击时实时更新图标。

所以我们需要全局存储到 vuex 中实现双向绑定，同时使用 cookie 缓存你当前切换的语言，根据使用习惯或需求设定过期时间。

参考：
_https://kazupon.github.io/vue-i18n
https://element.eleme.io_

> 本文有不到之处欢迎交流指正~
