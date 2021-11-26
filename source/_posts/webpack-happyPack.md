---
toc: true
title:  webpack之HappyPack
tags:
  - webpack
date: 2021-11-26 15:14:30
description: webpack之HappyPack
---



> HappyPack makes initial webpack builds faster by transforming files in parallel.
> HappyPack 通过并行转换文件，使初始 webpack 构建速度更快。

## 前言
webpack中万物皆模块，但是webpack默认只能处理js模块，那么js以外的模块怎么处理呢，所以就有了loader机制，比如：vue-loader、css-loader、file-loader等等。loader是一个导出为function的node模块。可以将匹配到的文件进行一次转换，同时loader可以链式传递。如果项目比较复杂，构建时就会有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，大型项目中webpack构建慢的问题尤为显著，然而运行在nodejs环境的webpack是单线程的，如果能让webpack同一时间能做多项任务，发挥多核 CPU 电脑的威力，就能大大的提升构建速度。这时候HappyPack就闪亮登场了，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程，相比之前可以有效的提升构建速度。
更多loaders内容参考[https://webpack.docschina.org/loaders/](https://webpack.docschina.org/loaders/)
​

> 线程和进程都可用于实现并发，一个进程由一个或多个线程组成，线程是一个进程中代码的不同执行路线。

## 使用HappyPack
HappyPack提供了一个plugin和一个load完成它的工作，所以你必须同时使用两者来启用它。
使用npm：
`npm install --save-dev happypack`
使用yarn：
`yarn add happypack --dev`
```javascript
// @file: webpack.config.js
var HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
 <!--more-->
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 将.js文件交给id为babel的happypack实例来执行
        // 1) 用happypack/loader代原始的loaders列表
        use: 'happypack/loader?id=babel',
        // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: path.resolve(__dirname, 'node_modules'),
      }
    ]
  },
  plugins: [
    // 2)创建一个plugin
    new HappyPack({
      // id标识happypack处理那一类文件
      id: 'babel',
      // 共享线程池
      threadPool: happyThreadPool,
      // 3) 配置一个替代步骤1) 中的loader
      loaders: [ 'babel-loader' ],
      // 日志输出
      verbose: true
    })
  ]
};
```
在module中定义loader rules告诉 webpack 如何处理特定格式的文件，调用基础配置里的happy/loader，此loader会通过参数的id遍历真实的插件数组，然后找到对应的happyPlugin，通过happyPlugin的配置获取真实的Loader并通过之前初始化完成的多线程进行编译，将编译结果传递给主线程。编译完成后，插件还会针对编译的结果缓存，以及新编译的文件进行缓存的设置。
​

在实例化 HappyPack 插件的时候，HappyPack 支持如下参数：

1. `loaders:Array`：

由一个转换文件的loader名和一个查询字符串组成。例如：`use: 'happypack/loader?id=babel'`，用happypack/loader代原始的loaders列表，唯一的happyPack plugin标识，用于在modules rules中去识别对应的happyPack实例中的loaders去执行文件的转换操作。
​


2. `id: String`

happy plugin 的唯一标识。默认值"1"，如果只有一个happy plugin可以不指定，当使用不止一个happy plugin时需要指定它。
​


3. `threads: Number`

代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。
​


4. `threadPool: HappyThreadPool`

代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。默认值：null。
​


5. `verbose: Boolean`

是否允许 HappyPack 输出日志，默认是 true。
​

> HappyPack 并不是完全支持所有的webpack loader API，具体支持情况请查看[官方wiki](https://github.com/amireh/happypack/wiki/Webpack-Loader-API-Support) 。

## HappyPack原理
![img](1.png)


HappyPack是webpack和主要来源文件（如JS源代码）之间的中间件，其中发生了大量的文件转换处理。每次webpack解析一个模块时，HappyPack都会获取它（模块）及其所有依赖项，并将这些文件分发给多个工作线程"线程"。
这些线程实际上是调用转换器的简单node进程。当加载到编译后的版本时，HappyPack会将最终的chunk提供给加载程序。
## 不同webpack版本下使用建议


> ![img](2.png)

问：对webpack2&3有效吗？
答：有，webpack2&3需要搭配使用happyPack@^4.0.1
问：对于webpack4有效吗？
答：webpack4可能不太需要。
大意：webpack4已经融合了多线程机制（HappyPack做的工作），因此happypack的作用不是很明显。如果你使用的版本是<4，那么还是可以继续使用HappyPack。在webpack4中有个[thread-loader](https://github.com/webpack-contrib/thread-loader)，配置起来更简单，两种方式都可以试一下看看那种方案对你来说最优。
## 参考文档

- [https://www.npmjs.com/package/happypack](https://www.npmjs.com/package/happypack)
- [http://webpack.wuhaolin.cn](http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-3%E4%BD%BF%E7%94%A8HappyPack.html)







