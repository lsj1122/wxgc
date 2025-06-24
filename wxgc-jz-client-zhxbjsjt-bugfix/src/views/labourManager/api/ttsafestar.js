
/**
 * @auther JIN_GE
 * @create 2021-04-08
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-safe-star";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtSafeStar() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectSafeStarByPro() {
  return request({
    url: moduleUrl+'/select/selectSafeStarByPro',
    method: 'get',
  })
}

/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtSafeStar(params) {
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
export function addTtSafeStar(data) {
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
export function updateTtSafeStar(data) {
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
export function deleteTtSafeStar(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}



// wifi 安全教育的查询接口 getPageWIFISafe
export function getPageWIFISafe(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-answer/select/list',
        method: 'get',
        params
    })
}
