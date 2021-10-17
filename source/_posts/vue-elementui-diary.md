---
layout: vue
title: vue-elementui-diary
date: 2021-09-24 09:44:30
tags:
  - VUE
  - VUE2
categories:
  - VUE
  - VUE2
---

##### title

<!-- {% pullquote mindmap mindmap-md %}

- [Hexo 的思维导图插件](https://hunterx.xyz/hexo-simple-mindmap-plugin-intro.html)

  - 前言
  - 使用方法
    - 一
    - 二
    - 三
  - 太长不看
  - 参考资料
    {% endpullquote %} -->

{% chart 90% 300 %}
{
type: 'line',
data: {
labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
datasets: [{
label: 'My First dataset',
backgroundColor: 'rgb(255, 99, 132)',
borderColor: 'rgb(255, 99, 132)',
data: [0, 10, 5, 2, 20, 30, 45]
}]
},
options: {
responsive: true,
title: {
display: true,
text: 'Chart.js Line Chart'
}
}
}
{% endchart %}
