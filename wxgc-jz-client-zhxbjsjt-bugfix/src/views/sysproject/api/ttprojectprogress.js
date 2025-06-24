
/**
 * @auther JIN_GE
 * @create 2021-04-08
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-project-progress";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtProjectProgress() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

/**
 * 0项目进度1里程碑节点
 * @param param
 * @returns {AxiosPromise}
 */
export function selectProgressByType(param) {
    return request({
        url: moduleUrl+'/select/selectProgressByType?type='+param,
        method: 'get',
    })
}

export function selectProgressDiffrence(param) {
    return request({
        url: moduleUrl+'/select/selectProgressDiffrence?type='+param,
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtProjectProgress(params) {
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
export function addTtProjectProgress(data) {
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
export function updateTtProjectProgress(data) {
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
export function deleteTtProjectProgress(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

