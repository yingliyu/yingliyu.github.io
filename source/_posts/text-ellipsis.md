---
toc: true
title: css文字超出显示省略号
tags:
  - text-ellipsis
  - -webkit-line-clamp
description: css文字超出显示...
date: 2020-06-09 11:11:17
---

##### 一.单行文本超出省略

> 关键属性：`text-overflow:ellipsis|clip` 。
> `clip` : 　不显示省略标记（...），而是简单的裁切掉溢出的文本
> `ellipsis` : 　当对象内文本溢出时显示省略标记（...）
> `string`: 使用指定字符串来代表被修剪的文本
> 兼容性：所有主流浏览器都兼容, IE6+

1.css 实现：

```css
div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

2.css+html 实现：

> 使用`<nobr>`不换行标签（行内标签）此标签与 css `white-space` 功能相同。
> 详情参考http://www.divcss5.com/html/h533.shtml 。
> `<nobr>`兼容性：IE11+

```css
nobr {
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```html
<div>
  <nobr>
    我是禁止换行标签。我是禁止换行标签。 我是禁止换行标签。我是禁止换行标签。
    我是禁止换行标签。我是禁止换行标签。
  </nobr>
</div>
```

##### 二.多行文本超出省略

> `-webkit-line-clamp`:限制在一个块元素显示的文本的行数。是一个不规范的属性，未出现在 css 规范草案中。
> 为了实现该效果，它必须要结合其他的属性 ：
> `display: -webkit-box;` 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。
> `-webkit-box-orient` 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。
> 兼容性：适用于 webkit 浏览器或移动端，详情：https://www.caniuse.com/#search=-webkit-line-clamp

以超出 3 行内容省略为例：

```css
 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```

跨浏览器兼容方案：(IE9+)
注意：`hight` 是 `line-height` 的 3 倍

```css
.p {
  height: 60px;
  line-height: 20px;
  position: relative;
  overflow: hidden;
}
.p:after {
  content: '...';
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%);
}
```

<!--more-->

> 本文有不到之处欢迎交流指正~
