// 卸料平台

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-xlpt";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtXlpt() {
  return request({
    url: moduleUrl + '/select/all',
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtXlpt(params) {
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
export function addTtXlpt(data) {
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
export function updateTtXlpt(data) {
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
export function deleteTtXlpt(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}



/**
 * 根据设备编号查询单条数据
 * @param 
 * @returns {AxiosPromise}
 */
export function selectone(id) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tt-xlpt/select/' + id,
    method: 'get',
  })
}

/**
 * 卸料平台服务器地址设置
 * @param 
 * @returns {AxiosPromise}
 */
export function unloadingPlatformControl(data) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/equipment/unloadingPlatformControl',
    method: 'post',
    data
  })
}
