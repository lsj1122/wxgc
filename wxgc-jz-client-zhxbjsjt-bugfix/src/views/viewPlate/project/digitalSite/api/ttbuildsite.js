
/**
 * @auther JIN_GE
 * @create 2021-04-13
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-build-site";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtBuildSite() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectAllTtBuildSiteByPro() {
    return request({
        url: moduleUrl+'/select/selectAllTtBuildSiteByPro',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtBuildSite(params) {
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
export function addTtBuildSite(data) {
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
export function updateTtBuildSite(data) {
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
export function deleteTtBuildSite(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

