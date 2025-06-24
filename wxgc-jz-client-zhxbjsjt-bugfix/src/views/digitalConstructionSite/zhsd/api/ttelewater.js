
/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-ele-water";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtEleWater() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectAllWaterEle() {
    return request({
        url: moduleUrl+'/select/selectAllWaterEle',
        method: 'get',
    })
}

export function selectEleWaterDualLine(param) {
    return request({
        url: moduleUrl+'/select/selectEleWaterDualLine?machineType='+param,
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtEleWater(params) {
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
export function addTtEleWater(data) {
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
export function updateTtEleWater(data) {
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
export function deleteTtEleWater(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

