import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { Message } from 'element-ui'

/**
 * 前端下载文件工具类
 * @param url 文件下载地址
 * @param fileName 下载文件名称 例子 123.png 注：需要加文件后缀
 */
export function downloadFile(url, fileName) {
  axios
    .get(url, {
      responseType: 'blob'
    })
    .then((response) => {
      // 下载文件
      const blob = new Blob([response.data])
      const objectUrl = URL.createObjectURL(blob) // 创建URL
      const link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', fileName)
      link.click() // 下载文件
      URL.revokeObjectURL(objectUrl) // 释放内存
    })
    .catch((error) => {
      console.log(error)
      alert('下载失败')
    })
}

/**
 * 打包下载文件
 * @param fileList 需要下载的文件数组 数组包对象，对象有两个key name以及url 例子 [{name:"123.png",url:"www.baidu.com/1112.png"},{name:"123.png",url:"www.baidu.com/1112.png"}]
 * @param zipName 打包下载文件压缩包的名称 默认名称：打包下载 不带后缀
 */
export function downloadZip(fileList, zipName = '打包下载') {
  const zip = new JSZip()
  const promises = []
  let cache = {}
  for (let item of fileList) {
    // item.path为文件链接地址
    const promise = getFileBuffer(item.url).then((data) => {
      // 下载文件, 并存成ArrayBuffer对象(blob)
      zip.file(item.name, data, { binary: true }) // 逐个添加文件
      cache[item.name] = data
    })
    promises.push(promise)
  }
  Promise.all(promises).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // 生成二进制流
      FileSaver.saveAs(content, zipName) // 利用file-saver保存文件  自定义文件名
    })
  }).catch((res) => {
    Message.error('打包下载失败')
  })
}

//文件以流的形式获取（参数url为文件链接地址）
function getFileBuffer(url) {
  return new Promise((resolve, reject) => {
    //通过请求获取文件blob格式
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', url, true)
    xmlhttp.responseType = 'blob'
    xmlhttp.onload = function() {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(this.status)
      }
    }
    xmlhttp.send()
  })
}
