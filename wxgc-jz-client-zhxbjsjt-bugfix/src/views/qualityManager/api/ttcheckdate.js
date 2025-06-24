
/**
 * @auther JIN_GE
 * @create 2021-04-08
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-check-date";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtCheckDate() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTtCheckDateByPro() {
    return request({
        url: moduleUrl+'/select/selectTtCheckDateByPro',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtCheckDate(params) {
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
export function addTtCheckDate(data) {
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
export function updateTtCheckDate(data) {
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
export function deleteTtCheckDate(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

