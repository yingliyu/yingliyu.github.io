---
toc: true
title: dumi搭建组件库
tags:
  - umi
  - dumi
date: 2022-01-19 10：49：30
description: dumi搭建组件库
---

## 前言

之前有用 storybook 尝试搭建一套组件库[《Storybook 从零到一搭建组件库(上篇)》](https://yingliyu.github.io/2021/12/24/storybook-js/)，但是一顿操作下来之后，发现 storybook 学习成本相对较高且配置复杂，最重要的是页面有被丑到。然后开始使用 dumi，发现真香，不仅上手简单就像正常开发一个普通的项目一样，而且没有繁杂的配置，最重要的是页面美观简洁大方。一个像 antd 一样的组件库，你值得拥有。

> 本文将带你学习搭建一个 React+TS 组件库，编写一个完整组件、部署至 github 静态 web 站点及发布 npm 。

使用技术：
`dumi`：负责组件开发及组件文档生成（基于 umi，使用过`umi`的同学比较友好易上手）
`github`：配置自动化部署静态 web
`gitee`：同步 github gh pages

> 特性：
>
> - 📦 开箱即用，将注意力集中在组件开发和文档编写上
> - 📋 丰富的 Markdown 扩展，不止于渲染组件 demo
> - 🏷 基于 TypeScript 类型定义，自动生成组件 API
> - 🎨 主题轻松自定义，还可创建自己的 Markdown 组件
> - 📱 支持移动端组件库研发，内置移动端高清渲染方案
> - 📡 一行命令将组件资产数据化，与下游生产力工具串联

<!--more-->

## 环境准备

- `node`: v10.13.0 及以上版本

## 安装

搭建一个站点模式的组件库

```
$ npx @umijs/create-dumi-lib --site # 初始化一个站点模式的组件库开发脚手架
# or
$ yarn create @umijs/dumi-lib --site
```

项目目录结构大致如下：

![image](image1.png)

安装依赖，启动，可以看到类似官网的首页和简洁明了的组件页。
**首页：**

> **首页对应项目中的 root/docs/index.md**

![image](image2.png)

**组件页：**

> **组件页对应项目中的 root/src/index.ts**

![image](image3.png)

## 配置

主要是导航和菜单的配置：
.umirc.ts

```
import { defineConfig } from 'dumi';
function getMenus(opts: { lang?: string; base: '/components' | '/docs' }) {
  const menus = {
    '/docs': [
      {
        title: 'Introduce',
        'title_zh-CN': '介绍',
        path: '/docs/guide',
      },
      {
        title: 'FAQ',
        'title_zh-CN': '问题',
        path: '/docs/faq',
      },
    ],
    '/components': [
      {
        title: 'Common',
        'title_zh-CN': '通用',
        children: ['/components/button', '/components/icon', '/components/typography'],
      },
      {
        title: 'Layout',
        'title_zh-CN': '布局',
        children: [
          '/components/layout/Divider',
          '/components/layout/Grid',
          '/components/layout/Layout',
          '/components/space',
        ],
      },
    ],
  };
  return (menus[opts.base] as [])?.map((menu: any) => {
    if (!opts.lang) return menu;
    return {
      ...menu,
      title: menu[`title_${opts.lang}`] || menu.title,
    };
  });
}

export default defineConfig({
  title: 'fish-ui',
  hash: true,
  base: '/fish-ui',
  publicPath: '/fish-ui/',
  favicon: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
  logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
  outputPath: 'docs-dist',
  mode: 'site',
  mfsu: {},
  dynamicImport: {},
  navs: [
    // null,
    {
      title: '文档',
      path: '/docs',
    },
    {
      title: '组件',
      path: '/components',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/yingliyu/fish-ui',
    },
  ],
  menus: {
    '/zh-CN/docs': getMenus({ lang: 'zh-CN', base: '/docs' }),
    '/docs': getMenus({ base: '/docs' }),
    '/zh-CN/components': getMenus({ lang: 'zh-CN', base: '/components' }),
    '/components': getMenus({ base: '/components' }),
  },
  // more config: https://d.umijs.org/config
  lessLoader: { javascriptEnabled: true },
  //  按需加载 antd
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
});
```

此配置中的 menus 和 navs 对应到页面布局如下：

![image](image4.png)

## 完成一个组件

基于 Ant Design 以 Button 组件为例：
/components/button/index.tsx（写组件）

```
import React from 'react';
import { Button as AntdButton } from 'antd';
import classNames from 'classnames';
import './index.less';

declare type ButtonHTMLType = 'submit' | 'button' | 'reset';
declare const ButtonTypes: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'];
export declare type ButtonType = typeof ButtonTypes[number];

interface IABSButtonProps {
  loading?: boolean;
  danger?: boolean;
  className?: string;
  type?: ButtonType;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  block?: boolean;
  large?: boolean;
  htmlType?: ButtonHTMLType;
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'white';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<IABSButtonProps> = (props: IABSButtonProps) => {
  const {
    danger,
    loading,
    style,
    children,
    large = false,
    className,
    onClick,
    type = 'primary',
    icon,
    block = false,
    disabled,
    htmlType,
    color,
  } = props;

  let classes = classNames('fish-btn', className, {
    'fish-btn-large': large,
    'fish-btn-block': block,
    'fish-btn-link': type === 'link',
  });
  const displayStyle = block ? 'block' : 'inline-block';

  let newTpye = type;
  let isDanger = danger;
  if (color) {
    switch (color) {
      case 'blue':
        newTpye = 'primary';
        break;
      case 'red':
        isDanger = true;
        break;
      case 'white':
        newTpye = 'default';
        break;
      case 'yellow':
        classes = classNames(classes, 'fish-yellow-btn');
        break;
      case 'green':
        classes = classNames(classes, 'fish-green-btn');
        break;
      default:
        break;
    }
  }

  return (
    <div className={classes} style={{ display: displayStyle, ...style }}>
      <AntdButton
        icon={icon}
        onClick={onClick}
        disabled={disabled}
        type={newTpye}
        block={block}
        htmlType={htmlType}
        danger={isDanger}
        loading={loading}
      >
        {children}
      </AntdButton>
    </div>
  );
};

export default Button;
```

/components/button/index.less（组件样式）

```
.color(@bg, @bgHover, @bgActive) when (default()) {
  .ant-btn {
    color: @text-color-inverse;
    background: @bg;
    border-color: @bg;
    &:hover,
    &:focus {
      color: @text-color-inverse;
      background: @bgHover;
      border-color: @bgHover;
    }
    &:active {
      color: @text-color-inverse;
      background: @bgActive;
      border-color: @bgActive;
    }
  }
}

.fish-btn {
  &.fish-btn-block {
    width: 200px;
  }
  &.fish-btn-link {
    .ant-btn-link {
      padding: 0;
    }
  }
  &.fish-yellow-btn {
    .color(@warning-color, @gold-5, @gold-7);
  }
  &.fish-green-btn {
    .color(@success-color, @green-5, @green-7);
  }
}
```

/components/button/index.md（组件文档）

````
---
title: Button

group:
  path: /components
  order: 1
---

## Button 按钮

响应用户点击行为，触发相应的业务逻辑。

代码演示

```tsx
import React from 'react';
import { Button, Space } from 'fish-ui';

export default () => (
  <Space>
    <Button>Button</Button>
    <Button danger>Button</Button>
    <Button large>Button</Button>
  </Space>
);
````

### 按钮颜色

```tsx
import React from 'react'
import { Button, Space } from 'fish-ui'

export default () => (
  <Space>
    <Button color="white">Button</Button>
    <Button color="blue">Button</Button>
    <Button color="red">Button</Button>
    <Button color="yellow">Button</Button>
    <Button color="green">Button</Button>
    <Button>Button</Button>
  </Space>
)
```

### API

页面展示：

![image](image5.png)

到这里，基于 antd 的 Button 组件及文档的编写已经有了雏形，但是文档很重要的一部分 API 还没有加上，使用 md 语法编写 API 显得繁琐也违背了专注组件开发的初衷。我们使用的 TS，如果 API 能根据类型声明及代码注释自动生成那岂不美哉，是的它可以，即通过 JS Doc 注解 + TypeScript 类型定义的方式实现组件 API 的自动生成。

## 自动生成 API

> 前提：确保 dumi 能够通过 TypeScript 类型定义 + 注解推导出 API 的内容
> dumi 背后的类型解析工具是 react-docgen-typescript，更多类型和注解的用法可参考 [它的文档](https://github.com/styleguidist/react-docgen-typescript#example)

### 安装

```

npm install --save-dev react-docgen-typescript

```

### 配置

项目根目录创建配置文件 styleguide.config.js

```

module.exports = {
propsParser: require('react-docgen-typescript').withDefaultConfig([parserOptions]).parse,
};

```

### 修改组件代码

components/button/index.tsx 加注释如下：

```

interface IABSButtonProps {
/**设置按钮载入状态 */
loading?: boolean;
/**
*设置危险按钮
*@default false
  */
  danger?: boolean;
  className?: string;
  /**按钮类型 */
  type?: ButtonType;
  style?: React.CSSProperties;
  /**设置按钮的图标组件 */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /**
* 按钮失效状态
* @default false
  */
  disabled?: boolean;
  block?: boolean;
  large?: boolean;
  htmlType?: ButtonHTMLType;
  /**按钮颜色 */
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'white';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }

```

components/button/index.md 在你想要显示 API 的页面位置引用 API 标签

```

<API></API>

```

### 效果展示

基于以上代码，自动生成如下 API 表格：

![image](image6.png)

# 自动化部署

> 将组件库自动化部署至 Github gh-pages，由于 github 访问比较慢，所以在 Gitee gh-pages 也部署一份。

例如，访问我的组件库：[https://yingliyu.github.io/fish-ui](https://yingliyu.github.io/fish-ui) 、 [http://ylyubook.gitee.io/fish-ui](http://ylyubook.gitee.io/fish-ui)
如果不是部署在根目录需要修改.umirc.ts 配置，以 fish-ui 为例：

```

// .umirc.ts
export default defineConfig({
base: '/fish-ui',
publicPath: '/fish-ui/'
...
})

```

在项目根目录下创建`.github/workflows/gh-pages.yml`

```

name: Deploy Github Pages # Actions 名字

on: # 触发条件
push:
branches: - master # 仅向 master 分支 push 时触发

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
          npm run docs:build
      # 发布到 github pages 上
      - name: Auto Deploy
        env:
          GH_REF: github.com/xxx/仓库名.git # github仓库地址http
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }} # github token
          GITEE_REF: gitee.com/[gitee usename]/仓库名.git  # gitee仓库地址,[gitee usename]替换为自己的gitee用户名
          GITEE_TOKEN: ${{ secrets.GITEE_TOKEN}} # gitee 私人令牌
        run: |
          git config --global user.name "your name"
          git config --global user.email "your email"
          git clone https://${GH_REF} .deploy_git
          cd .deploy_git
          git checkout gh-pages
          cd ../
          mv .deploy_git/.git/ ./docs-dist # 打包之后的文件存放目录docs-dist
          cd ./docs-dist
          git add .
          git commit -m ":construction_worker:CI built at `date +"%Y-%m-%d %H:%M:%S"`"
          # GitHub Pages
          git push --force --quiet "https://${ACCESS_TOKEN}@${GH_REF}" gh-pages:gh-pages
          # Gitee Pages
          git push --force --quiet "https://[gitee usename]:${GITEE_TOKEN}@${GITEE_REF}" gh-pages:gh-pages

```

以上 GITEE_TOKEN 是在 gitee 中创建的私人令牌，添加到对应的 github 仓库，ACCESS_TOKEN 是 github screts。

# 发布 npm 包

> **注意：**npm 发布的包是完全公共的，也就是所有使用 npm 的人都可以在 npm 仓库里下载你发布的包，但是实际项目中，部门间公用的包可能涉及到商业机密，那么就不能在 npm 上发布了，公司需要搭建自己的私有包管理仓库，这时可使用 cnpm。

本文只记录 npm 包发布步骤，cnpm 私有仓库的搭建，[请点击这里](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/yalong/p/12837461.html)。
发布之前需要在 package.json 加配置，添加一些必要的描述信息。
package.json

```javascript
 "private": false,
  "name": "fish-ui-pro",
  "version": "1.0.0",
  "description": "A library of react components",
  "author": "yingliyu",
  "license": "MIT",
  "keywords": [
    "React",
    "Component"
  ],
  "homepage": "https://yingliyu.github.io/fish-ui",
  "repository": {
    "type": "git",
    "url": "https://github.com/yingliyu/fish-ui.git"
  },
   "files": [
    "docs-dist",
    "es"
  ],
```

- 将 `private` 字段置为 false , 表示非私有包；
- 添加 `description` 、 `author `、 `license` 、 `keywords` 等相关字段;
- 添加 `homepage` 字段，即项目主页 URL；
- 添加 `repository` 字段，即项目仓库地址 URL；
- 添加 files 字段，表示要将哪些文件上传到 npm 上去。如果什么都不写，则默认会使用`.gitignore `里面的信息。但要注意，不管` .gitignore` 怎么配置，一些文件会始终发布到 `package` 上，这些文件包括 `package.json `、 `README.md `、 `LICENSE `等等；

```
//package.json
"peerDependencies": {
    "react": ">=16.9.0",
    "react-dom": ">=16.9.0",
     "antd": ">=4.18.0"
  },
```

> 执行`npm login`，依次输入注册 npm 时的 username, password, email 后，执行`npm whoami`能终端输出用户名，说明登录成功，最后执行`npm publish`发包。注意：publish 之前先 build 一下，确保 dist 包是最新的。

报错：
403：npm 包名已被使用
​

# 最后

参考：

- [dumi 官网](https://d.umijs.org/zh-CN/guide)
- [https://juejin.cn/post/6844904200359378958#heading-26](https://juejin.cn/post/6844904200359378958#heading-26)
