
/**
 * @auther JIN_GE
 * @create 2021-04-19
 * @describe AIP接口
 */

import request from '@/utils/request' 
//当前模块的基本URL
let moduleUrl="/wxgc/plus/p-contract-info";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllPContractInfo() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}


/**
 * 查询单个合同
 * @returns {AxiosPromise}
 */
 export function getPContractInfoDet(id) {
    return request({
        url: moduleUrl+'/select/' + id,
        method: 'get',
    })
}



/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPagePContractInfo(params) {
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
export function addPContractInfo(data) {
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
export function updatePContractInfo(data) {
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
export function deletePContractInfo(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

