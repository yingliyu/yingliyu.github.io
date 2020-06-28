---
toc: true
title: git常用命令
tags:
  - git
description: git常用命令
date: 2020-06-08 10:11:38
---

### 前言

> git 相关知识可以说是开发者的必备常识，虽然目前市面有很多方便的可视化操作工具，但是 git 的指令用起来不仅方便快捷而且显得更加有逼格，况且面试的时候有可能被问到，所以还是有必要学习并掌握的。

##### 1.基础指令

克隆远程仓库代码到本地

```js
git clone 远程仓库地址
```

添加变更到暂存区

```js
git add . //添加全部变更
git add <fileName> //添加指定文件的变更
```

<!--more-->

提交变更

```js
git commit -m "your description"
```

```js
git pull // 拉仓库代码
git push // 提交到仓库
git push --set-upstream origin <branch name> // 将本地分支推送为远程分支
```

##### 2.配置相关指令

```js
git config --global user.name "xxx" //配置用户名
git config --global user.email "xxx@xxx.com" //配置邮箱
```

##### 3.分支相关指令

```js
git branch // 查看本地分支
git branch -r // 查看远程分支
git branch -a // 查看本地及远程所有分支
// git branch -m <old name> <new name> // 重命名分支

git branch <branch name> // 创建分支
git merge <branch name> // 合并某分支到当前分支
git checkout -b <branch name> // 创建并切换到分支名为branch name的分支

git branch -d <branch name> // 删除本地已合并分支（未合并提示删除失败）
git branch -D <branch name> // 强制删除本地未合并分支
git push origin --delete <branch name> // 删除远程分支
```

##### 4.回退相关指令

git 中，HEAD 表示当前版本

```js

git checkout <file> // 恢复未提交的更改
git reset HEAD <file> // 取消之前git add 添加

git reset --hard HEAD~ // 回退至上一个版本
git reset --hard <commit id> // 回退至指定版本
```

##### 5.标签指令

```js
git tag //查看标签
git tag <name> //创建标签
git tag -a <name> //创建一个带注解的标签
git tag -d <name>  //删除标签
```

##### 6.其他指令

```js
git status // 查看代码状态
git diff // 查看add与commit改动
git remote -v // 查看远程仓库地址
git log // 查看提交历史
git log -p // 查看每次提交的内容差异
git log -2 // 查看最近两次提交
git log --stat // 查看每次提交的简略的统计信息
git log --pretty=oneline // 日志信息格式化为每次提交信息在一行显示
```

> 本文有不到之处欢迎交流指正~
