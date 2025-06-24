
/**
 * @auther JIN_GE
 * @create 2021-04-30
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-wifi";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtWifi() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}
export function selectTtWifiByPro() {
    return request({
        url: moduleUrl+'/select/selectTtWifiByPro',
        method: 'get',
    })
}
export function addOrUpdateTtWifi(data) {
  return request({
    url: moduleUrl+'/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtWifi(params) {
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
export function addTtWifi(data) {
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
export function updateTtWifi(data) {
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
export function deleteTtWifi(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

