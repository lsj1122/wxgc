import axios from 'axios';
import JSZip from 'jszip'
import FileSaver from 'file-saver'


const getFile = url => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    }).then(data => {
      resolve(data.data)
    }).catch(error => {
      reject(error.toString())
    })
  })
}

export const handleBatchDownload = (data) => {
  //const data = ['各类地址1', '各类地址2'] // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
  const zip = new JSZip()
  const cache = {}
  const promises = []
  data.forEach(item => {
    const promise = getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
      const arr_name = item.split("/")
      const file_name = arr_name[arr_name.length - 1] // 获取文件名
      zip.file(file_name, data, { binary: true }) // 逐个添加文件
      cache[file_name] = data
    })
    promises.push(promise)
  })
  Promise.all(promises).then(() => {
    zip.generateAsync({ type: "blob" }).then(content => { // 生成二进制流
      FileSaver.saveAs(content, "打包下载.zip") // 利用file-saver保存文件
    })
  })
}