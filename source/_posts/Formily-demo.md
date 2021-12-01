---
toc: true
title: Formily入门实践
tags:
  - Formily
date: 2021-12-01 15:14:30
description: Formily入门实践
---

## 前言

Formily 是阿里开源的动态化表单的解决方案，优雅的解决了多种复杂场景的表单的数据、状态管理及夸表单通信问题，同时规避了全量全然的弊端，性能优越。刚好满足我近期工作中的业务需求，啃了将近一周的文档，对 Family 有了初步的了解，后续使用起来有时间再出翻坑指南。

## 初步了解

​Formily 基于 MVVM 的设计原则，常用的基础核心库有`@formily/core`、`@formily/react`、`@formily/vue`、`@formily/antd`，支持 react 和 vue，同时支持 Markup Schema、 JSX 以及现在业界最流行的 JSON Schema 的写法。

Formily 分为了**内核层**，**UI 桥接层**，**扩展组件层**，和**配置应用层**，如下图。
**内核层**是 UI 无关的，它保证了用户管理的逻辑和状态是不耦合任何一个框架。
JSON Schema 独立存在，给 UI 桥接层消费，保证了协议驱动在不同 UI 框架下的绝对一致性，不需要重复实现协议解析逻辑。
**扩展组件层**，提供一系列表单场景化组件，保证用户开箱即用。无需花大量时间做二次开发。
![Formily的分层架构图](image.png)

> 核心优势
>
> - 高性能
> - 开箱即用
> - 联动逻辑实现高效
> - 跨端能力，逻辑可跨框架，跨终端复用
> - 动态渲染能力

核心劣势：学习成本较高，需引多个包，包体积较大。
​

确实 Formily 的学习成本还是相对较高的，几大核心库一堆的文档和 API 会让你眼花缭乱，但是既然要学就要耐下心来，思路理清之后就轻车熟路了。
​

核心库介绍：
`@formily/core`：**ViewModel 层**，负责管理表单的状态，表单校验，联动等等。
`@formily/react`：** Model 层**，作为 UI 库来接入内核数据，用来实现最终的表单交互效果，对于不同框架的用户，使用有不同的桥接库，这里使用`react`为例，使用 vue 安装`@formily/vue`。
`@formily/antd`：**View 层**，在`Ant Design`基础之上封装的开箱即用的组件库。

## 使用准备

安装依赖，这里以`React+Antd `为例

使用 yarn
`yarn add @formily/core`
`yarn add @formily/react`
`yarn add antd moment @formily/antd`
​

or 使用 npm
`npm install --save @formily/core`
`npm install --save @formily/react`
`npm install --save antd moment @formily/antd`
​

导入依赖：

```javascript
import React from 'react'
import { createForm } from '@formily/core'
import { FormProvider, Field } from '@formily/react'
import { FormItem, Input } from '@formily/antd'
```

​

## 实例

以`JSON Schema`写法为例：

```javascript
import React from 'react'
import { createForm } from '@formily/core'
import { createSchemaField, FormConsumer, FormProvider } from '@formily/react'
import { FormItem, Input, Password, Submit, FormLayout, FormButtonGroup } from '@formily/antd'
import * as ICONS from '@ant-design/icons'

//用来创建表单核心领域模型，它是作为MVVM设计模式的标准 ViewModel
const form = createForm()

// 创建一个 SchemaField 组件用于解析JSON-Schema动态渲染表单的组件
const SchemaField = createSchemaField({
  // 组件列表
  components: {
    FormLayout,
    FormItem,
    Input,
    Password
  },
  // 全局作用域，用于实现协议表达式变量注入
  scope: {
    icon(name: string) {
      return React.createElement(ICONS[name])
    }
  }
})

/**初始化一份json schema
 * 解析 json-schema 的能力；将 json-schema 转换成 Field Model 的能力；编译 json-schema 表达式的能力
 **/
const schema = {
  // schema type
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 2,
        wrapperCol: 6,
        labelAlign: 'right'
        // layout: 'vertical',
      },
      // 属性描述
      properties: {
        username: {
          // schema type
          type: 'string',
          // 标题
          title: '用户名',
          // 必填
          required: true,
          // 字段 UI 包装器组件
          'x-decorator': 'FormItem',
          // 字段 UI 组件
          'x-component': 'Input',
          // 字段 UI 组件属性
          'x-component-props': {
            prefix: "{{icon('UserOutlined')}}"
          }
        },
        password: {
          type: 'string',
          title: '密码',
          required: true,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            addonAfter: '强度高'
          },
          'x-component': 'Password',
          'x-component-props': {
            prefix: "{{icon('LockOutlined')}}"
          }
        }
      }
    }
  }
}

export default () => {
  return (
    <FormProvider form={form}>
      <FormLayout layout="vertical">
        <SchemaField schema={schema} />
      </FormLayout>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
      <FormConsumer>
        {() => (
          <div
            style={{
              width: 340,
              marginTop: 20,
              padding: 5,
              border: '1px dashed #666'
            }}
          >
            实时响应-用户名：{form.values.username}
          </div>
        )}
      </FormConsumer>
    </FormProvider>
  )
}
```

![image](img2.png)

- `FormProvider`组件是作为视图层桥接表单模型的入口，它只有一个参数，就是接收 `createForm`创建出来的 `Form `实例，并将 `Form `实例以上下文形式传递到子组件中。
- `FormLayout`组件是用来批量控制`FormItem`样式的组件，这里我们指定布局为水平布局，也就是标签在左，组件在右。
- `FormConsumer`组件是作为响应式模型的响应器而存在，它核心是一个`render props`模式，在作为 `children `的回调函数中，会自动收集所有依赖，如果依赖发生变化，则会重新渲染，借助 `FormConsumer `我们可以很方便的实现各种计算汇总的需求。
- `FormButtonGroup`组件作为表单按钮组容器而存在，主要负责按钮的布局。
- `Submit`组件作为表单提交的动作触发器而存在，其实我们也可以直接使用 `form.submit `方法进行提交，但是使用 `Submit `的好处是不需要每次都在 `Button `组件上写 `onClick `事件处理器，同时它还处理了 `Form `的 `loading `状态，如果 `onSubmit `方法返回一个 `Promise`，且 `Promise `正在 `pending `状态，那么按钮会自动进入 `loading `状态。

> `注意：使用前还需要了解，Formily 已经完全放弃对 IE 的兼容，如需兼容 IE，慎用！！！`

## 参考

[Formily 官方文档](https://formilyjs.org/)
​

​
