
/**
 * @auther JIN_GE
 * @create 2021-03-19
 * @describe shiro拦截接口AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/sys-api";

/**
 * 查询所有shiro拦截接口数据
 * @returns {AxiosPromise}
 */
export function getAllSysApi() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}


/**
 * 分页查询shiro拦截接口
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageSysApi(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加shiro拦截接口
 * @param data
 * @returns {AxiosPromise}
 */
export function addSysApi(data) {
    return request({
        url: moduleUrl+'/save',
        method: 'post',
        data
    })
}

/**
 * 修改shiro拦截接口
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSysApi(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}


/**
 * 删除shiro拦截接口
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSysApi(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

