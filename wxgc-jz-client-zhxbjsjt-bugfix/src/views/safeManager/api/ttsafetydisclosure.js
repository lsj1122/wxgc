
/**
 * @auther JIN_GE
 * @create 2021-04-12
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-safety-disclosure";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtSafetyDisclosure() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTtSafetyDisclosureByPro() {
  return request({
    url: moduleUrl+'/select/selectTtSafetyDisclosureByPro',
    method: 'get',
  })
}

export function selectSafeDisclosureCount() {
  return request({
    url: moduleUrl+'/select/selectSafeDisclosureCount',
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtSafetyDisclosure(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTtSafetyDisclosure(data) {
    return request({
        url: moduleUrl+'/save',
        method: 'post',
        data
    })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTtSafetyDisclosure(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtSafetyDisclosure(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

