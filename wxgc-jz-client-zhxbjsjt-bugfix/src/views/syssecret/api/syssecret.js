
/**
 * @auther JIN_GE
 * @create 2021-03-18
 * @describe 客户端秘钥AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/sys-secret";

/**
 * 查询所有客户端秘钥数据
 * @returns {AxiosPromise}
 */
export function getAllSysSecret() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}


/**
 * 分页查询客户端秘钥
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageSysSecret(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加客户端秘钥
 * @param data
 * @returns {AxiosPromise}
 */
export function addSysSecret(data) {
    return request({
        url: moduleUrl+'/save',
        method: 'post',
        data
    })
}

/**
 * 修改客户端秘钥
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSysSecret(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}


/**
 * 删除客户端秘钥
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSysSecret(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

