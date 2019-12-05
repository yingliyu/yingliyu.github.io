---
toc: true
title: Hexo博客添加评论功能
tags:
  - hexo
description: Hexo(hexo-theme-yilia)博客添加评论功能
date: 2019-12-05 14:53:07
---


### 前言


>最初使用的是来必力貌似是韩国的，搭好了发现加载慢，风格也不喜欢，然后就...
>现在使用的是基于[LeanCloud](https://leancloud.cn?_blank) 的 [Valine](https://valine.js.org?_blank)评论系统，样式简约大方并且支持Emoji，赞。

### 获取APP ID 和 APP Key

首先，先登录或注册 LeanCloud, 进入控制台后点击左上角创建应用：
![3](3.jpg)

<!--more-->

![1](1.jpg)

![2](2.jpg)


这样我们就拿到了我们想要的APP ID 和 APP Key，后面有用。
>然后设置一下安全域名：

![4](4.jpg)

### 在Hexo主题hexo-theme-yilia中使用

>目前，已有部分Hexo主题内置了Valine 评论系统，但是本博客所用主题hexo-theme-yilia还没有被覆盖，下面就来详细介绍一下如何使用。

##### 修改Yilia主题内代码断

>yilia/_config.yml中添加如下配置：

```yml
#6、Valine https://valine.js.orgvaline: 
 appid:  #Leancloud应用的appId
 appkey:  #Leancloud应用的appKey
 verify: false #验证码
 notify: false #评论回复提醒
 avatar: mm #评论列表头像样式：''/mm/identicon/monsterid/wavatar/retro/hide
 placeholder: Just go go #评论框占位符
```

>layout/_partial/article.ejs 
>在<% if (!index && post.comments){ %>下面一行添加：



```html
<% if (theme.valine && theme.valine.appid && theme.valine.appkey){ %>
    <section id="comments" style="margin:10px;background:#fff;">
    <%- partial('post/valine', {
        key: post.slug,
        title: post.title,
        url: config.url+url_for(post.path)
    }) %>
  </section>
  <% } %>
```

>新建文件 layout/_partial/post/valine.ejs 
```html
<div id="vcomment" class="comment"></div> 
<script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
<script src="//unpkg.com/valine/dist/Valine.min.js"></script>
<script>
   var notify = '<%= theme.valine.notify %>' == true ? true : false;
   var verify = '<%= theme.valine.verify %>' == true ? true : false;
    window.onload = function() {
        new Valine({
            el: '#vcomment',
            notify: notify,
            verify: verify,
            app_id: "<%= theme.valine.appid %>",
            app_key: "<%= theme.valine.appkey %>",
            placeholder: "<%= theme.valine.placeholder %>",
            avatar:"<%= theme.valine.avatar %>"
        });
    }
</script>
```
Over然后就可以去见证奇迹了。
### 最后
参考：[https://valine.js.org](https://valine.js.org?_blank)

>本文有不到之处烦请多多交流指正~

