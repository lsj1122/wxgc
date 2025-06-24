
/**
 * @auther JIN_GE
 * @create 2021-04-16
 * @describe 人员信息表AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-person";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtPerson() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

//查询人员详情

export function getPersonDet(id) {
    return request({
        url: moduleUrl+'/select/' + id,
        method: 'get',
    })
}

/**
 * 根据workerId查询实时人数和累计人数
 * @returns {AxiosPromise}
 */
export function selectPersonCountByWorkerId() {
    return request({
        url: moduleUrl+'/select/selectPersonCountByWorkerId',
        method: 'get',
    })
}
/**
 * 根据idCard查询实时人数和累计人数
 * @returns {AxiosPromise}
 */
export function selectPersonCountByIdCard() {
    return request({
        url: moduleUrl+'/select/selectPersonCountByIdCard',
        method: 'get',
    })
}

/**
 * 查询工种分析
 * @returns {AxiosPromise}
 */
export function selectWorkTypeCount() {
    return request({
        url: moduleUrl+'/select/selectWorkTypeCount',
        method: 'get',
    })
}

/**
 * 查询年龄分布
 * @returns {AxiosPromise}
 */
export function selectAgeTypeCount() {
    return request({
        url: moduleUrl+'/select/selectAgeTypeCount',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtPerson(params) {
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
export function addTtPerson(data) {
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
export function updateTtPerson(data) {
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
export function deleteTtPerson(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

//查询班组的数据 getBanZuBoxInfo
export function getBanZuBoxInfo(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-person/select/teamCount',
        method: 'get',
        params
    })
}

