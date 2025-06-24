import axios from "axios";
import {getToken} from "@/utils/auth";

export function downFile(url, data, fileName) {
  const tempUrl = process.env.VUE_APP_BASE_API + url
  axios
    .post(tempUrl, data, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'XSpace-Access-Token': getToken()
      }
    })
    .then((response) => {
      console.log(response)
      // 下载文件
      const blob = new Blob([response.data], { type: 'application/oct-stream' })
      const objectUrl = URL.createObjectURL(blob) // 创建URL
      const link = document.createElement('a')
      link.href = objectUrl
      // link.download = '.xlsx'// 自定义文件名
      // 这里是获取后台传过来的文件名
      link.setAttribute('download', fileName)
      link.click() // 下载文件
      URL.revokeObjectURL(objectUrl) // 释放内存
    })
    .catch((error) => {
      console.log(error)
      alert('下载失败')
    })
}
