---
toc: true
title: WEB应用中的权限认证
tags:
  - GWT
description: token
date: 2021-01-27 17:25:17
categories:
  - 单点登录
  - GWT
---

### 1.传统方案——基于 cookie/session 的解决方案

首先，浏览器端向服务端发送 login 请求，把用户名和密码都发送过去，服务器验证用户名密码正确，然后就会创建对应的 session 数据并保存在内存或者数据库中。然后，服务器返回一个 HTTP 200 OK 的 response，这个 response 会有个 header 叫 set-Cookie：sessionid=xxx，浏览器拿到这个 response 以后，因为有 set-Cookie 这个 header， 带上唯一的 id sessionid（set-Cookie：sessionid=xxx），它就会把 cookie 保存在浏览器中，下次我们再访问这个需要权限的接口，这时候会自动把 cookie 带上。服务器端就可以使用 cookie 中的信息 sessionid，查看服务器中是否存在这个 session 的数据，如果存在则返回对应的信息，否则返回 401 Not authorized。

基于 cookie 的身份验证是有状态的，意味着这个验证记录或者会话必须同时保存在服务器端和客户端，服务器要跟踪记录 session 并且存至内存或者数据库，同时前端在 cookie 也要保存这个 sessionid 作为 session 唯一的标识符。这种模式的问题在于扩展性不好。假如只有一台服务器当然没有问题，假如是一个服务器集群，这就要求 session 的数据共享，我们需要每台服务器都读取到这个 session，一种解决方案就是 session 的数据持久化，把数据写到持久层中去，各种服务收到请求以后都向持久层发送数据。这种方案优点是架构清晰，缺点是工程量比较大，另外，持久层如果挂了，那么就单点失败。
<img width='600px' style='display:block;margin:20px auto;' src='1.jpeg'>

<!--more-->

<!-- ![1](1.jpeg) -->

### 2.基于 Token 的解决方案：GWT

它不同于在服务器保存信息的特点，而是把所有的信息都保存在客户端，之后每次请求都将生成的信息发回到服务器，JWT（JSON WEB TOKEN）就是这种方案的一个代表。

流程：
浏览器向服务器发送登陆请求，把用户名和密码发送过去，服务器验证用户名和密码正确，服务端会使用 JWT 算法生成 token 签名，然后 response 返回 token 到客户端，然后浏览器会将 token 储存到客户端，常见方式 local Storage 或者 session Storage 中，之后每次请求将 token 在 HTTP 请求头中发送给服务器（也可以通过放在 cookie 中自动发送的方式，但是这样不能跨域），服务器拿到信息之后 JWT 反向验证对应的 token 是否正确，如果验证通过就返回 200 OK 并带上相应的信息，如果错误则返回 401 Not authorized。
如果用户退出登陆，token 在客户端销毁，和服务器无关。基于 token 的身份验证是没有状态的，服务器不需要记录哪些用户已经登陆或者哪些 JWT 已经处理，每个发送到服务器的请求都会带一个 token，服务器通过 token 检查确认请求的有效性。

token 是通过特定的加密算法将用户登陆后的一些信息储存在一个加密后的字符串中，服务器凭 token 认定用户的身份，即服务器是无状态的因此非常容易实现拓展。
<img width='600px' style='display:block;margin:20px auto;' src='2.jpeg'>

<!-- ![1](2.jpeg) -->

登陆之后，刷新浏览器登录状态丢失，持久化方案：

<!-- ![3](3.jpeg) -->
<img width='600px' style='display:block;margin:20px auto;' src='3.jpeg'>

> 权限逻辑流程：

 <img width='600px' style='display:block;margin:20px auto;' src='4.png'>

<!-- ![4](4.jpeg) -->
