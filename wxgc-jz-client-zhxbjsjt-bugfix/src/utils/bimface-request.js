import axios from 'axios'
import { Message } from 'element-ui'
import { getBimfaceToken } from '@/utils/auth'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BIM_FACE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.bimfaceToken && store.getters.bimfaceToken.length>0) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //config.headers['X-Wxgc-Token'] = getToken()
      config.headers['Authorization'] = getBimfaceToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   * 翻译:（如果您想获取http信息，如头或状态 请返回response=>response）
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   * 翻译：
   *  通过自定义代码确定请求状态
   *  这里只是一个例子
   *  您还可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response.data;
    if (!res.code) {
      return res
    }
    /**
     * 重要提示：这里我修改了response 来兼容万像的返回格式 同时也兼容以前默认的格式
     */
    if (res.code == "success" || res.code == 20000) {
      return res
    } else {
      Message({
        message: res.message,
        type: 'error',
        duration: 2 * 1000
      })
    }
  },
  error => {
    let msg = "请求错误,稍后再试试";
    if (error.toString().indexOf("404") != -1) {
      msg = "请求地址不存在"
    } else if (error.toString().indexOf("500") != -1) {
      msg = "服务器异常稍后再试试"
    } else {
      msg = error.toString();
    }
    Message({
      message: msg,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

