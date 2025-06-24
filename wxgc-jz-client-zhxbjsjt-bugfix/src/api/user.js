import request from '@/utils/request'
import  store   from '@store'

//取出公钥
//store.getters.publicSecretKey
//加密模块
import JSEncrypt from 'jsencrypt';//引入模块

export function login(data) {
  const jse = new JSEncrypt();
  jse.setPublicKey(store.getters.publicSecretKey)//配置公钥
  data.password= jse.encrypt(data.password)//加密密码
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/wxgc/wxresult/sysUser/loginUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'get'
  })
}

export function refreshToken(token) {
  return request({
    url: '/auth/refreshToken',
    method: 'get',
    params:{oldToken:token}
  })
}


export function getPageUsers(params) {
  return request({
    url: '/wxgc/wxresult/sysUser/select/list',
    method: 'get',
    params
  })
}


/**
 * 查询导出的数据
 * @param params
 * @returns {AxiosPromise}
 */
export function getExcelData(params) {
  return request({
    url: '/wxgc/wxresult/sysUser/select/list2',
    method: 'get',
    params
  })
}



export function addUser(data) {
  return request({
    url: '/wxgc/wxresult/sysUser/save',
    method: 'post',
    data
  })
}


export function updateUser(data) {
  return request({
    url: '/wxgc/wxresult/sysUser/update',
    method: 'post',
    data
  })
}



export function deleteUser(id) {
  return request({
    url: '/wxgc/wxresult/sysUser/delete/'+id,
    method: 'get'
  })
}


// 项目级 中国能建安徽电建二公司多功能展示馆一期项目 跳转
export function getlinkInfo(data) {
  return request({
    url: '/wxgc/plus/url/address',
    method: 'post',
    data
  })
}

// 
export function getAccessTokenWys(data) {
  return request({
    url: 'https://open.ys7.com/api/lapp/token/get',
    method: 'post',
    data
  })
}



