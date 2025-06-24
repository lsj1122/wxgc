
import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-protect";

// 临边防护
/**
 * 分页查询设备管理
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTtLb(params) {
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
 export function addTtLb(data) {
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
export function updateTtLb(data) {
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
export function deleteTtLb(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}


// 临边防护实时数据
/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTtLbSs(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/protect-work-data/select/list',
        method: 'get',
        params
    })
}


// 临边防护触发
/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTtLbCf(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/protect-trigger-data/select/list',
        method: 'get',
        params
    })
}

