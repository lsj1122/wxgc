

import request from '@/utils/request'


/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtXlpt() {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-db/select/all',
        method: 'get',
    })
}


/** 
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageDB(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-db/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addDB(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-db/save',
        method: 'post',
        data
    })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateDB(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-db/update',
        method: 'put',
        data
    })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteDB(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-db/delete/'+id,
        method: 'delete'
    })
}

