/**
 * @auther JIN_GE
 * @create 2021-04-17
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-build-unit";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtBuildUnit() {
  return request({
    url: moduleUrl + '/select/all',
    method: 'get',
  })
}

export function selectTtBuildUnitByPro(params) {
  return request({
    url: moduleUrl + '/select/selectTtBuildUnitByPro',
    method: 'get',
    params
  })
}

export function selectTtBuildTree() {
  return request({
    url: moduleUrl + '/select/selectTtBuildTree',
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtBuildUnit(params) {
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
export function addTtBuildUnit(data) {
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
export function updateTtBuildUnit(data) {
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
export function deleteTtBuildUnit(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}

