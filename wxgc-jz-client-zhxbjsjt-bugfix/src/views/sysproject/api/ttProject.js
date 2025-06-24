/**
 * @auther JIN_GE
 * @create 2021-03-30
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-project";

/**
 *
 * @param param
 * @returns {AxiosPromise}
 */
export function getOneTtProject(param) {
  return request({
    url: moduleUrl + '/select/' + param,
    method: 'get',
  })
}

export function selectPro() {
  return request({
    url: moduleUrl + '/select/selectPro',
    method: 'get',
  })
}

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtProject() {
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
export function getPageTtProject(params) {
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
export function addTtProject(data) {
  return request({
    url: moduleUrl + '/save',
    method: 'post',
    data
  })
}

/**
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function addOrUpdateTtProject(data) {
  return request({
    url: moduleUrl + '/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTtProject(data) {
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
export function deleteTtProject(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function selectAllCityByTree(params) {
  return request({
    url: '/wxgc/plus/china-city-info/select/selectAllCityByTree',
    method: 'get',
    params
  })
}

