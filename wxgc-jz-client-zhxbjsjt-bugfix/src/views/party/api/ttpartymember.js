
/**
 * @auther JIN_GE
 * @create 2021-04-08
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-party-member";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtPartyMember() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function getAllTtPartyMemberByPro() {
    return request({
        url: moduleUrl+'/select/getAllTtPartyMemberByPro',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtPartyMember(params) {
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
export function addTtPartyMember(data) {
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
export function updateTtPartyMember(data) {
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
export function deleteTtPartyMember(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

