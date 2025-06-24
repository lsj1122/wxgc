
/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tj-work-data";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTjWorkData() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTjWorkDataByNum(param) {
    return request({
        url: moduleUrl+'/select/selectTjWorkDataByNum?machineNumber='+param,
        method: 'get',
    })
}
export function selectTjCount(param) {
    return request({
        url: moduleUrl+'/select/selectTjCount?machineNumber='+param,
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTjWorkData(params) {
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
export function addTjWorkData(data) {
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
export function updateTjWorkData(data) {
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
export function deleteTjWorkData(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

