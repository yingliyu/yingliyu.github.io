---
toc: true
title: react-hook入门手册
tags:
  - react-hook
description: react-hook
date: 2020-06-28 15:49:02
---

### 前言

React Hooks 是 React 16.12 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

### 1.useState

> 调用`useState`方法时做了什么？

定义一个 state 变量，这是一种在函数调用时保存变量的方式——`useState`是一种新方法，它与`class`里的`this.state`提供的功能完全相同。一般来说，在函数退出后变量就会“消失”，而`state`中的变量会被`react`保留。

<!--more-->

> `useState`函数需要那些参数？

唯一的参数就是初始`state`。不同于`class`，我们可以按照需要使用数字或者字符串对其进行赋值，而不一定是对象。如果想要在`state`中存储两个不同的变量，只需要调用`useState()`两次即可。

> `useState`方法的返回值是什么?

返回值为：当前`state`和更新`state`的函数。这与`class`里的`this.state.count`和`this.setState`类似，唯一的区别就是你需要成对的获取他们。

```JSX
// 引入React中的useState Hook。它让我们在函数组件中存储内部state。
import React,{useState} from 'react'
const Example = () => {
// 声明一个叫‘count’的state变量，初始值为0
const [count, setCount] = useState(0)
return (
      <div>
         <p>You clicked {count} times</p>
         // 当用户点击按钮后，传递一个新的值给setCount。react会重新渲染Example组件，并把最新的count传给它。
        <button onClick={() => setCount(count + 1)}>
         Click me
        </button>
      </div>
    )
}
```

### 2.useEffect

> Effect Hook 可以让你在函数组件中执行副作用操作(DOM 操作、数据请求、组件更新)。可以把它看作 componentDidMount、componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

useEffect 可以在组件渲染后实现各种不同的副作用。有些副作用可能需要清除，有些不需要，所以就分为不需要清除的 effect 和需要清除的 effect。

##### 不需要清除的 effect

> `useEffect`做了什么？

通过使用这个`hook`，可以告诉`React`组件需要在渲染后执行某些操作。`React`会保存你传递的函数（我们将它称之为`“effect”`），并且在执行 DOM 更新后调用它。在这个`effect`中，我们设置了`document`的`title`属性，不过我们也可以执行数据获取或调用其他命令式的 API。

> 为什么在租价内部调用`useEffect`?

将`useEffect`放在组件内部让我们可以在`effect`中直接访问`count state`变量或其他`props`。我们不需要特殊的 api 来读取他，他已经保存在函数作用域中。`Hook`是使用了`Javascript`的闭包机制，而不是在 js 已经提供了解决方案的情况下，还引入特定的 React API。

> `useEffect`会在每次渲染后都执行吗？

是的，默认情况下，它在第一次渲染之后和每次更次呢之后都会执行。React 保证了每次运行`effect`的同时，DOM 都已经更新完毕。

```jsx
import React, { useState, useEffect } from 'react'
function Example() {
  const [count, setCount] = useState(0)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // update the document title using the browser API
    document.title = `You clicked ${count} times!`
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    )
  })
}
```

每次更新 DOM 后 useEffect 都会执行，这个过程每次渲染时都会发生，包括首次渲染。
与 componentDidMount 或 componentDidUpdate 不同使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步执行。在个别情况下有单独的 useLayoutEffect Hook 供你使用，其 api 与 useEffect 相同。

##### 需要清除的 effect

> 为什么要在 effect 中返回一个函数？

这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数，如此可以将添加和医护订阅的逻辑放在一起。他们都属于 effect 的一部分。

> React 何时清楚 effect？

React 会在组件卸载的时候执行清除操作。正如之前学到的，effect 在每次执行渲染的时候都会执行。这就是为什么 React 会在执行当前 effect 之前对上一个 effect 进行清除。

注意：并不是必须为 effect 中返回的函数命名。这里我们将其命名为 cleanup 是为了表明函数的目的，但其实也可以返回一个箭头函数或者给起一个别的名字。

### 3.useReducer

useState 的替代方案：

```jsx
import React, { useState, useReducer } from 'react'
const initialState = { count: 0 }
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}
function Example() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // update the document title using the browser API
    document.title = `You clicked ${state.count} times!`
    return (
      <div>
        <p>You clicked {state.count} times</p>
        <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      </div>
    )
  })
}
```

### 4.useRef

```jsx
const refContainer = userRef(initialValue)
```

返回一个可变的 ref 对象，其.current 属性被初始化未传入的参数 initiaValue。返回的 red 对象在组件的整个生命周期内保持不变。
一个常见的用例便是命令式的访问子组件：

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    console.log(inputEl.current.value()
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

> 当 ref 对象内容发生变化时，useRef 并不会通知你。变更.current 属性不会引发组件重新渲染。如果想要在 React 绑定或者解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

### 5.Hook 的规则

Hook 本质就是 js 函数但是在使用它时需要遵循两条规则。可以使用 linter 插件来强制执行这些规则。

> 1.只在最顶层使用 Hook

确保总是在你的 React 函数的最顶层调用他们，不要再条件判断或循环中调用。

> 2.只在 React 函数中调用 Hook

不要在普通的 js 函数中调用 Hook，可以：
在 React 的函数组件中调用 Hook
在自定义 Hook 中调用其他 Hook

### 最后

1.参考[官方文档](https://react.docschina.org/docs/hooks-intro.html)

2.实战项目：[github/react-hook-todo-list](https://github.com/yingliyu/react-hook-todo-list)
