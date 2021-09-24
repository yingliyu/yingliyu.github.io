---
toc: true
title: 文件下载的三种方式
tags:
  - 上传/下载
description: 文件上传/下载
path: js
date: 2021-09-23 14:29:09
---

文件上传下载是项目中经常遇到的常规功能，本文针对下载功能总结了一共三种使用方式。

##### 一.无 API 浏览器直接下载（静态资源在前端）

将静态资源文件直接放于` public` 目录下，打包时 `public` 文件不会被编译。

> 注意：静态资源的路径，在 public 文件夹下路径是`/文件名`

```html
<a class="download-file" href="/file.xlsx" download="模板.xlsx">下载模板文件</a>
```

或者使用非 a 标签的按钮下载：

```js
/* 
@param {string} url  静态资源url
@param {string} filename  静态资源文件名(可选)
@param {string} target  
*/
export const fileUrlHandled = ({ url, filename, target }) => {
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = url
  if (target) {
    downloadElement.target = '_blank'
  }
  downloadElement.rel = 'noopener noreferrer'
  if (filename) {
    downloadElement.download = filename
  }
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
}
```

缺点：文件名不可控。

##### 二.后端 API 返回静态资源下载 url

原理：使用 ajax 下载

```js
/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
function getBlob(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        Message.error(xhr.statusText || '文件获取失败')
      }
    }

    xhr.send()
  })
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export default function download(url, filename) {
  getBlob(url).then((blob) => {
    saveAs(blob, filename)
  })
}
```

> 缺点：存在跨域问题。
> 优点：文件名可控。

<!--更多-->

##### 三.后端 API 返回文件流

```js
// 二次封装axios POST请求方法下载
export function AppDownload(url, data, baseURL) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        baseURL,
        responseType: 'blob'
      })
      .then((res) => {
        if (res && res.status !== 200) {
          // reject(new Error(`下载失败`))
        } else {
          let reader = new FileReader()
          reader.onload = function (event) {
            let content = reader.result // 内容就在这里
            if (/"ok":false/.test(content)) {
              let response = {
                data: JSON.parse(content)
              }
              responseFn({ ...{ res: response }, resolve, reject })
              return
            }
            let url = window.URL.createObjectURL(new Blob([res.data]), {
              type: 'multipary/form-data'
            })
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let filename = data.filename || `${new Date() - 0}.xlsx`
            try {
              if (res.headers['filename']) {
                filename = decodeURI(res.headers['filename']) || `${new Date() - 0}.xlsx`
              }
            } catch (e) {
              console.log(e)
            }

            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(url.href)
            document.body.removeChild(link)
            resolve()
          }
          reader.readAsText(res.data)
        }
      })
      .catch((error) => {
        console.log(error)
        Message.error({
          message: 'download failed',
          duration: 2000
        })
      })
  })
}
```

> 注意：后端需要将响应头中的 Access-Control-Expose-Headers，设置 Content-Disposition，否则前端取不到 Content-Disposition 的值。

本文不到之处欢迎指正，感谢~
