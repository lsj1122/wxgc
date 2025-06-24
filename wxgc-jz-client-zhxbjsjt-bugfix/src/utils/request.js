import axios from 'axios'
import qs from 'qs';
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import {getProjectId, getProjectChildrenIds, getProjectName} from '@/utils/project'

//项目参数名称
let projectParamName = process.env.VUE_PROJECT_ID_PARAM_NAME;
if (!projectParamName) projectParamName = "projectId"
//项目子节点参数名称
let childrenParamName = process.env.VUE_PROJECT_CHILDREN_ID_PARAM_NAME;
if (!childrenParamName) childrenParamName = "projectChildrenIds"

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout 30秒后台无响应结束
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Wxgc-Token'] = getToken()
    }
    let pid = getProjectId();
    let childrenIds = getProjectChildrenIds();
    let projectName = getProjectName()
    let roleId = store.getters.roleIds
    let currentUserId = store.getters.userId
    let currentUserName = store.getters.realName
    if (!pid) pid = '';
    /*  if(!childrenIds) childrenIds=[];*/


    //添加项目参数
    if (config.data instanceof FormData) {
      config.data.append(projectParamName, pid)
      config.data.append(childrenParamName, childrenIds)
      return config
    }
    if (config.method === 'post' || config.method === 'delete') {
      if (typeof config.data === "string") {
        config.data = JSON.parse(config.data);
      }
      let temp = {
        ...config.data,
      }
      // 添加projectId
      if (!temp[projectParamName]) {
        temp[projectParamName] = pid;
      }
      // 添加projectChildrenIds
      if (!temp[childrenParamName]) {
        temp[childrenParamName] = childrenIds + '';
      }
      // 添加 projectName
      if (!temp['projectName']) {
        temp['projectName'] = projectName;
      }
      // 判断是否为认证接口 如果不是 添加用户Id以及用户名
      if (!config.url.includes("auth")) {
        temp.currentUserId = currentUserId;
        temp.currentUserName = currentUserName;
      }
      // 添加当前用户Id
      if (!temp.roleId) {
        temp.roleId = roleId[0];
      }
      config.data = temp;
    } else if (config.method == 'get') {
      if (typeof config.params === "string") {
        config.params = JSON.parse(config.params);
      }
      let temp = {
        ...config.params,
      }
      // 添加projectId
      if (!temp[projectParamName]) {
        temp[projectParamName] = pid;
      }
      // 添加projectChildrenIds
      if (!temp[childrenParamName]) {
        temp[childrenParamName] = childrenIds + '';
      }
      // 添加 projectName
      if (!temp['projectName']) {
        temp['projectName'] = projectName;
      }
      // 判断是否为认证接口 如果不是 添加用户Id以及用户名
      if (!config.url.includes('auth')) {
        temp.currentUserId = currentUserId;
        temp.currentUserName = currentUserName;
      }
      // 添加当前用户Id
      if (!temp.roleId) {
        temp.roleId = roleId[0];
      }
      config.params = temp;
      //主要解决get请求中有数组参数
      config.paramsSerializer = function (params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
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
     * 重要提示：这里我修改了response 来兼容万象的返回格式 同时也兼容以前默认的格式
     */
    if (res.code == "success" || res.code == 20000) {
      return res
    }
    if (res.code === "timeout" || res.code === "token_invalid" || res.code === "off_line" || res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('当前账户登录已经失效，那你可以尝试重新登录', '系统提示', {
        confirmButtonText: '重新登陆',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: res.msg || '系统错误',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(new Error(res.message || '系统错误'))
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


/**
 * 分片上传使用
 * @param option
 * @returns {AxiosPromise}
 */
export const requestApi = (option) => {
  if (option.isJson && JSON.stringify(option.data) !== {}) {
    return service({
      method: option.method,
      url: `${option.url}`,
      data: option.data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } else if (option.isJson && JSON.stringify(option.data) === {}) {
    return service({
      method: option.method,
      url: `${option.url}`,
      data: option.data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } else if (!option.isJson && JSON.stringify(option.data) !== {}) {
    return service({
      method: option.method,
      url: `${option.url}`,
      params: option.data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  } else if (!option.isJson && JSON.stringify(option.data) === {}) {
    return service({
      method: option.method,
      url: `${option.url}`
    })
  }
}
