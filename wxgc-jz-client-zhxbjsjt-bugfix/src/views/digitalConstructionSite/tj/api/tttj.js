/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-tj";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtTj(params) {
  return request({
    url: moduleUrl + '/select/all',
    method: 'get',
    params
  })
}

export function selectTtTjByNum(param) {
  return request({
    url: moduleUrl + '/select/selectTtTjByNum?machineNumber=' + param,
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtTj(params) {
  return request({
    url: moduleUrl + '/select/list',
    method: 'get',
    params
  })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTtTj(data) {
  return request({
    url: moduleUrl + '/save',
    method: 'post',
    data
  })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTtTj(data) {
  return request({
    url: moduleUrl + '/update',
    method: 'put',
    data
  })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtTj(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}

/**
 * 根据设备Id查询
 * @param params
 * @returns {AxiosPromise}
 */
export function selectOne(params) {
  return request({
    url: moduleUrl + '/select/one',
    method: 'get',
    params
  })
}

/**
 * 塔机更新注册返回帧
 * @param data 注册帧数据
 * @param id 设备ID
 * @returns {AxiosPromise}
 */
export function machineRegisterTj(data,id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/tj/' + id,
    method: 'post',
    data
  })
}

/**
 * 塔机锁机
 * @param id 设备ID
 * @returns {AxiosPromise}
 */
export function lockTj(id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/lockMachine/lockTj/' + id,
    method: 'post',
  })
}

// 塔机的查询
export function selectAllInfo(id) {
  return request({
      url: '/wxgc/plus/tt-tj/selectAllInfo/'+id,
      method: 'get'
  })
}