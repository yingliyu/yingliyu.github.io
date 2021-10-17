---
toc: true
title: React+AntD+Redux 的项目实战总结
tags:
  - react
description: react
date: 2020-07-18 15:46:43
categories: React
---

<!-- ![1.jepg](1.jpeg) -->

##### 前言

最近用 `React Hook` 实战了一个 React 项目。今天来总结一下，因为都是拼凑的时间所以项目历时半个多月之久，通过本次学习进一步的熟悉了 `AntD` 常用组件的使用，业务功能（增删改查）的开发及百度地图 API、富文本组件的使用、权限设置模块，最重要的是把学习的 `React Hook` 落实到了项目中。

<!--more-->

##### 1.百度地图的使用

前提：先注册成为百度地图开放平台的用户，然后获取密钥 ak。

```bash
<script
    type="text/javascript"
    src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak=xxxxxxxxxx"
  ></script>
```

```jsx
import React, { useState, useEffect } from 'react'
import styles from './index.module.less'
import { Card } from 'antd'
import Map from './data.json'
export default function OrderManage(props) {
  const [total, setTotal] = useState(0)
  useEffect(() => {
    initData()
  }, [])

  const initData = async (params) => {
    setTotal(Map.data.total)
    renderMap(Map.data)
  }
  const renderMap = (data) => {
    const list = data.route_list
    // 初始化地图
    let map = new window.BMapGL.Map('container', { enableMapClick: false })
    const gps2 = list[list.length - 1].split(',')
    const endPoint = new window.BMapGL.Point(gps2[0], gps2[1])
    map.centerAndZoom(new window.BMapGL.Point(endPoint.lng, endPoint.lat), 11)
    addMapContrl(map)
    addBikeRoutes(map, list)
    renderMapService(map, data.service_list)
    addBikeIcon(map, data.bike_list)
  }
  // 添加自行车图标
  const addBikeIcon = (map, list) => {
    let bikeIcon = new window.BMapGL.Icon(
      require('./imgs/bike.jpg'),
      new window.BMapGL.Size(30, 35),
      {
        imageSize: new window.BMapGL.Size(30, 35),
        anchor: new window.BMapGL.Size(15, 42)
      }
    )
    list.forEach((item) => {
      const p = item.split(',')
      let point = new window.BMapGL.Point(p[0], p[1])
      let marker = new window.BMapGL.Marker(point, { icon: bikeIcon })
      map.addOverlay(marker)
    })
  }
  // 绘制服务区
  const renderMapService = (map, list) => {
    let servicesList = []
    list.forEach((item) => {
      servicesList.push(new window.BMapGL.Point(item.lon, item.lat))
    })
    let polygon = new window.BMapGL.Polyline(servicesList, {
      strokeColor: 'red',
      strokeWidth: 5,
      strokeOpacity: 1,
      fillColor: 'orange',
      fillOpacity: 0.4
    })
    map.addOverlay(polygon)
  }

  // 添加地图起始图标及骑行路线
  const addBikeRoutes = (map, list) => {
    const gps1 = list[0].split(',')
    const gps2 = list[list.length - 1].split(',')
    const startPoint = new window.BMapGL.Point(gps1[0], gps1[1])
    const endPoint = new window.BMapGL.Point(gps2[0], gps2[1])
    let startPointIcon = new window.BMapGL.Icon(
      require('./imgs/start_point.png'),
      new window.BMapGL.Size(36, 42),
      {
        imageSize: new window.BMapGL.Size(36, 42),
        anchor: new window.BMapGL.Size(18, 42)
      }
    )
    // 创建标注对象并添加到地图
    let startMarker = new window.BMapGL.Marker(startPoint, { icon: startPointIcon })
    map.addOverlay(startMarker)
    let endPointIcon = new window.BMapGL.Icon(
      require('./imgs/end_point.png'),
      new window.BMapGL.Size(36, 42),
      {
        imageSize: new window.BMapGL.Size(36, 42),
        anchor: new window.BMapGL.Size(18, 42)
      }
    )
    // 创建标注对象并添加到地图
    let endMarker = new window.BMapGL.Marker(endPoint, { icon: endPointIcon })
    map.addOverlay(endMarker)
    // 绘制行车路线
    let routesList = []
    list.forEach((item) => {
      let p = item.split(',')
      routesList.push(new window.BMapGL.Point(p[0], p[1]))
    })
    let polyline = new window.BMapGL.Polyline(routesList, {
      strokeColor: 'red',
      strokeWidth: 5,
      strokeOpacity: 1
    })
    map.addOverlay(polyline)
  }
  // 添加地图控件
  const addMapContrl = (map) => {
    // map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    let scaleCtrl = new window.BMapGL.ScaleControl({ anchor: window.BMAP_ANCHOR_BOTTOM_LEFT }) // 添加比例尺控件
    map.addControl(scaleCtrl)
    let zoomCtrl = new window.BMapGL.ZoomControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }) // 添加缩放控件
    map.addControl(zoomCtrl)
  }
  return (
    <div className={styles['order-manage-wrapper']}>
      <Card>
        <QueryForm
          submitHandle={handleSearchSubmit}
          formList={formList}
          initialValues={searchFormDefaultValues}
        />
      </Card>
      <Card>
        <p>共搜询到{total}个</p>
        <div id="container" style={{ width: '100%', height: 600 }} />
      </Card>
    </div>
  )
}
```

问题：添加地图覆盖物的时候给多边形加填充色无效暂未解决。

##### 2.富文本组件使用

使用组件 `braft-editor`
安装：

```bash
npm install braft-editor
// or
yarn add braft-editor
```

基本用法：

```jsx
import React, { useState } from 'react'
import { Card, Button, Space, Modal } from 'antd'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

import styles from './index.module.less'
export default function RichText() {
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null))

  const getBraftContent = () => {
    // 将editorState数据转换成html字符串
    Modal.info({
      title: '富文本内容',
      content: editorState.toHTML()
    })
  }
  const handleBraftChange = (editorState) => {
    setEditorState(editorState)
  }
  const submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = editorState.toHTML()
    console.log(htmlContent)
    // const result = await saveEditorContent(htmlContent)
  }

  return (
    <div className={styles['rich-text-wrapper']}>
      <Card title="富文本——braft-editor" className={styles['rich-text-inner']}>
        <div>
          <Space>
            <Button type="primary" onClick={getBraftContent}>
              获取富文本内容
            </Button>
          </Space>
        </div>
        <br />
        <BraftEditor
          className={styles['braft-editor']}
          value={editorState}
          contentStyle={{ height: 400, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
          onChange={handleBraftChange}
          onSave={submitContent}
        />
      </Card>
    </div>
  )
}
```

项目中踩到的坑：
最开始使用的富文本组件是`react-draft-wysiwyg`,它依赖于`draft-js`，所以要安装这个，整个使用过程是完全没有问题的。就在使用第二种富文本组件`braft-editor`的时候入坑了，一直获取不到富文本的内容，使用`toHTML()`的时候报错，这个组件本来就是中国人写的文档也很详细自己觉得使用起来应该毫无障碍的，但就是堵到这里进行不下去，删除`node_modules`重新安装也还是不行，最后的最后发现`draft-js`是罪魁祸首啊啊啊。原来它与`draft-js`水火不容，我之前安装过`draft-js`，所以使用`braft-editor`的时候有问题，把它卸掉之后就解决了。不过不用担心卸掉之后也不影响`react-draft-wysiwyg`组件的使用，猜想应该是`braft-editor`内部集成`draft-js`了吧，总之能用才是王道，不过大部分情况使用一种就够了。

#### 最后

参考：

1. [https://jpuri.github.io/react-draft-wysiwyg/#/](https://jpuri.github.io/react-draft-wysiwyg/#/)
2. [https://braft.margox.cn/demos/basic](https://braft.margox.cn/demos/basic)

> 不积跬步无以至千里，不积小流无以成江海，默默努力，然后悄悄拔尖。
