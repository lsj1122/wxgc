
import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/face-recognition";

// 人脸识别管理
/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTtRl(params) {
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
 export function addTtRl(data) {
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
export function updateTtRl(data) {
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
export function deleteTtRl(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}


// 人脸识别记录
/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTtRlJl(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/face-recognition-record/select/list',
        method: 'get',
        params
    })
}