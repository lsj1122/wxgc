
/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-ycjc";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtYcjc() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTempDataForHour() {
    return request({
        url: moduleUrl+'/select/selectTempDataForHour',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtYcjc(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-ycjc/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTtYcjc(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-ycjc/save',
        method: 'post',
        data
    })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTtYcjc(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-ycjc/update',
        method: 'put',
        data
    })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtYcjc(id) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-ycjc/delete/'+id,
        method: 'delete'
    })
}
//lookOneInfoYCJC

export function lookOneInfoYCJC(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/ycjc-warning-threshold/select/one',
        method: 'get',
        params
    })
}

//dustAlarmStatusControl 扬尘监测取消报警设置
export function dustAlarmStatusControl(data) {
    return request({
        url: '/wxgc-juzheng-iot/wxgc/juzheng/equipment/dustAlarmStatusControl',
        method: 'post',
        data
    })
}
//dustSprayStatusControl 扬尘关闭按钮 & 喷淋关闭按钮
export function dustSprayStatusControl(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/task/closeMachine',
        method: 'post',
        data
    })
}
//dustPMConcentration扬尘监测PM浓度比例设置
export function dustPMConcentration(data) {
    return request({
        url: '/wxgc-juzheng-iot/wxgc/juzheng/equipment/dustPMConcentration',
        method: 'post',
        data
    })
}
//dustThresholdDataControl 扬尘监测阈值设置
export function dustThresholdDataControl(data) {
    return request({
        url: '/wxgc-juzheng-iot/wxgc/juzheng/equipment/dustThresholdDataControl',
        method: 'post',
        data
    })
}
//dustSprayStatusControlYCJC
export function dustSprayStatusControlYCJC(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/task/closeMachine',
        method: 'post',
        data
    })
}
