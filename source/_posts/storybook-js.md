---
toc: true
title: Storybook从零到一搭建组件库(上篇)
tags:
  - 框架学习
  - Storybook
date: 2021-12-22 15：49：30
description: Storybook从零到一搭建组件库(上篇)
---

## 前言

Storybook 是一个绝妙的 组件驱动开发环境。它通过隔离组件使开发更快更容易，它可以一次只处理一个组件。在 web 应用程序中构建小的原子组件和复杂的页面，使用 Storybook 可以让你专注于组件开发，无需去关注 API 文档的编写。

> Storybook 可以做什么？

工作中开发的 UI 组件或页面可以用 Storybook 帮助你记录并生成 API 文档，增强代码重用性，大大的提高工作效率，并自动可视化地测试组件以防止 bug。
同时不受限于框架，它同时支持 Vue、React、Angular。所以工作的同时，不妨用它来沉淀一个自己的组件库，面试的时候也是一个谈资。
![image](image.png)

## 依赖技术栈

首先，先来了解一下搭建一个简单的 UI 组件库需要使用哪些技术栈：

1. Node 环境：v14.16.1
2. React@17：用于构建用户界面的 JavaScript 库
3. TypeScript@^4.5.4：Javascript 类型的超集，有强大的编码提示功能
4. Ant-design@^4.17.4：最流行的 React 项目 UI 组件库，要搭建的基础组件库是基于 Ant Design 做的二次封装
5. Create React App：React 脚手架快捷搭建项目架构
6. Storybook（@storybook/react@^6.4.9）：辅助 UI 控件开发的工具，通过 story 创建独立的控件，让每个控件开发都有一个独立的开发调试环境；
7. Prettier&Eslint&husky：统一规范代码风格交给 Prettier、Eslint 校验语法错误，husky 预防将带有语法等错误提交到远程仓库造成污染
8. Webpack@^5.0.0：静态模块打包工具

## 项目准备

<!--more-->

这里使用 React + Antd + TypeScript 为例

### 构建项目

使用 [Creat React App](https://create-react-app.dev/docs/adding-typescript/) 构建项目，使用官方推荐脚手架搭建~

```javascript
// 使用create-react-app初始化一个项目
npx create-react-app my-app --typescript

// 进入项目根目录
cd my-app

// 支持ts
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
npm start
```

启动项目可以看到如下 React 初始页面，说明项目构建成功。
![image](2.png)

### 安装 storybook

```javascript
//安装storybook/cli脚手架并安装依赖
npx -p @storybook/cli sb init --type react_scripts

//启动你的storybook组件库项目
npm run storybook
```

至此，能看到一个简单的组件库雏形，如下。
![image](3.png)
至此，基本的组件库搭建完成，下面继续完善一下其前端生态系统，集成一些开发中必不可缺的工具库，有助于提高开发效率，让我们的开发工作事半功倍。

## 项目集成

### typescript

默认的 Webpack 配置可能无法解析 tsconfig 文件中定义的模块别名，需要 tsconfig-paths-webpack-plugin 来帮助。

#### install

```javascript
npm install tsconfig-paths-webpack-plugin
```

#### .storybook/main.js

首先我们要知道，Storybook 预设了 babel、webpack 插件，所以我们可以在 main.js 中加扩展 webpack 配置。
在 main.js 中 webpackFinal 属性用来自定义 webpack 配置，当然也可以在根目录定义一个 webpack.config.js 文件加配置在 main.js 导入使用，这里先在 main.js 中配置.

```javascript
// .storybook/main.js

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions
      })
    ]
    return config
  }
}
```

#### tsconfig.json

```javascript
// /tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "baseUrl": ".",
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

###

### Less

​

因为是基于 Antd 做的二次开发，Antd 是基于 Less 所以需要安装 Less

```javascript
npm install less less-loader --save-dev
```

添加配置

```javascript
//.storybook/main.js
webpackFinal: async (webpackConfig, { configType }) => {
    webpackConfig.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
      include: [path.resolve(__dirname, '../'), /[\\/]node_modules[\\/].*antd/],
    });
    return webpackConfig;
},
```

**出现问题：storybook 无法解析 less，Antd 样式不生效**
原因是 file loader 先 resolve 了 less 文件，导致 less-loader 没有解析
解决：@storybook/preset-create-react-app 得 file load 排除掉 less 文件，让 less-loader 去解析

```javascript
 // .storybook/main.js
addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/preset-create-react-app',
      options: {
        craOverrides: {
          fileLoaderExcludes: ['less'],
        },
      },
    },
  ],

```

了解更多：[issue#9796](https://github.com/storybookjs/storybook/issues/9796)

### Antd

```javascript
npm install antd
```

在文件中导入 antd 样式文件：

```javascript
// .storybook/preview.js
import 'antd/dist/antd.less' // 引入 antd 样式
```

### Eslint&Prettier&husky

```javascript
npm install -D eslint eslint-config-prettier eslint-config-react-app eslint-plugin-import eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks lint-staged prettier husky
```

**​**

**出现报错：添加了 Eslint，格式校验未通过**
![1640246532(1).png](4.png)
解决：修改 package.json 文件：

```
// package.json
"scripts": {
  ...
  "lint": "eslint --ext .ts --ext .tsx src/  --fix"
}
```

然后命令行执行修复指令：

```javascript
npm run lint
```

**出现报错：Parsing error: The keyword 'import' is reserved**
个别组件第一行 import 出现警告，试了加 babel 无效，最后把 vscode 关闭再打开好了，目前还没有复现。

## 编写组件

Button.tsx

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { Button as AntButton } from 'antd'

export const Button: React.FC<any> = ({
  primary,
  type,
  backgroundColor,
  size,
  label,
  danger,
  ...props
}) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary'

  return (
    <div className="warpper">
      <AntButton
        type={type}
        size={size}
        danger={danger}
        className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
        style={backgroundColor && { backgroundColor }}
        {...props}
      >
        {label}
      </AntButton>
    </div>
  )
}

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func
}

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined
}
```

Button.stories.tsx

```javascript
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../components/Button';

export default {
  title: 'Design System/General/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template = (args: any) => <Button {...args} />;
export const Primary: ComponentStory<typeof Button> = Template.bind({});
Primary.args = {
  type: 'primary',
  // primary: true,
  label: 'Button',
};

export const Danger: ComponentStory<typeof Button> = Template.bind({});
Danger.args = {
  label: 'Button',
  danger: true,
};

export const Large: ComponentStory<typeof Button> = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small: ComponentStory<typeof Button> = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
```

页面效果：
![image.png](5.png)

## 项目部署

> 使用 ​[Github Actions](https://github.com/features/actions)托管组件库，并实现持续集成 CI 服务

##### 步骤如下

###### 1.首先明确项目至少有两个分支，以`master`和`gh-pages`为例。

`master`分支是源码，开发在此分支，`gh-pages`是项目打包后生成的静态资源文件。
然后，在此项目仓库`Settings->Pages`页面选择 gh-pages 作为静态资源分支，直接在`root`，即根目录下。
如果有自己的域名的话也可以设置 Custom domain。
​

###### 2.然后生成一个[github secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)密钥，然后将密钥至仓库。

> step1. 生成一个 github 密钥。

点击 github 的 `Github Settings`->`Developer settings`->`Personal access tokens`->`Generate new token`->`Generate token`->`Copy token`

> step2. 将密钥添加到当前仓库中。

打开当前 github 仓库点击进入`Settings->Secrets`->`New repository secret`->`Paste token from step1`

###### 3.修改 package.json 文件 scripts

```javascript
"scripts": {
		"storybook": "start-storybook -p 6006 -s public",
    "build-storybook": "rm -rf ./dist/docs && build-storybook -o ./dist/docs",
}
```

###### 4. 添加 action，编写脚本

在此项目仓库点击 Action-> New workflow->Node.js
deploy.yml

```javascript
name: Deployer # Actions 名字

on: # 触发条件
  push:
    branches:
      - master # 仅向 master 分支 push 时触发

jobs:
  build: # job id
    name: Build and publish # job 名，不写默认使用 job id
    runs-on: ubuntu-latest # 运行环境，可选 ubuntu-latest, ubuntu-18.04, ubuntu-16.04, windows-latest, windows-2019, windows-2016, macOS-latest, macOS-10.14

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js 14.x
        uses: actions/setup-node@v2
        with:
          node-version: 14.x

      - name: Setup  env
        run: |
          npm install
      - name: Generate public files
        run: |
          npm run build-storybook

      - name: Deploy
        env:
          GH_REF: github.com/xxx/my-app.git # 仓库地址
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }} # github token
        run: |
          git config --global user.name "your name"
          git config --global user.email "your email"
          git clone https://${GH_REF} .deploy_git
          cd .deploy_git
          git checkout gh-pages
          cd ../
          mv .deploy_git/.git/ ./dist/docs
          cd ./dist/docs
          git add .
          git commit -m ":construction_worker:CI built at `date +"%Y-%m-%d %H:%M:%S"`"
          # GitHub Pages
          git push --force --quiet "https://${ACCESS_TOKEN}@${GH_REF}" gh-pages:gh-pages

```

创建成功会在项目中生成` .github/workflows/deploy.yml` 。
设置了 GitHub action 后，当推送代码时，你的组件库将自动部署到 Github 静态站点托管。至此就实现了，每当我们更新推送代码时可以自动发布组件的最新版本，我们需要手动再部署，GitHub action 会帮我们完成。

### Github Pages 访问组件库

在 master 分支修改源代码，然后 push 到远程仓库时，此时 action 会自动执行并打包部署，通过仓库 Settings->Pages 里显示的 Your site 访问即可。

## 结束语

> 下一篇记录将组件库发布 npm 包的实践过程

> 预览我的组件库：[Fish-Design](https://yingliyu.github.io/fish-design)

> 关于我的博客：[我的博客](https://yingliyu.github.io/)

## 尾巴

本文内容参考: [React](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) 、[storybook](https://storybook.js.org/)
