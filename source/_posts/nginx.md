---
toc: true
title: nginx新手篇
tags:
  - nginx
description: nginx入门
date: 2021-01-22 17:41:54
---

#### 前言

nginx 是 web 服务器，由 C 语言开发，基于事件驱动能处理百万级别的 tcp 连接，高度模块化的设计和自由的许可证使得扩展其功能的模块层出不穷，跨平台，可使用当前操作系统特有的一些高效 API 来提高自己的性能，nginx 以性能为王。选择 nginx 的核心理由是处理高并发请求的同时保持高效的服务。
Nginx 特点：
适合前后端分离开发、保证安全、nginx 非常快、负载均衡

#### 安装

环境：MAC OS 系统
`brew install nginx`

查看版本号：
`nginx -V`

启动：
`nginx`

<!--more-->

关闭：
`nginx -s stop`

查看 nginx 相关文件：
`cd /usr/local/etc/nginx`
`ls`

打开 nginx 配置文件：
`code nginx.conf`
局部如下：

```conf
server {
        listen       8080;
        server_name  localhost;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            root   html;
            index  index.html index.htm;
        }
```

进入 nginx 静态资源文件的默认路径：
`cd /usr/local/var/www`

`ls`
查看默认静态资源 html 文件
`cat index.html`

#### 使用 nginx 部署静态文件

进入本地项目目录下：
`cd xxx/yourProjectName`
`ls`
`cd dist`
`ls`

把打包生成的代码 copy 到/usr/local/var/www 目录
`cp -r * /usr/local/var/www`

然后，访问
localhost:8080

流程：
用户->xxx.com->Nginx->静态文件

重新启动 nginx：

`nginx -s reload`
