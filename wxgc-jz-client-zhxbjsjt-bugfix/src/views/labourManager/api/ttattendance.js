
/**
 * @auther JIN_GE
 * @create 2021-04-16
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-attendance";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtAttendance() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

/**
 * 根据workerId分类查询考勤记录和实时在场
 * @returns {AxiosPromise}
 */
export function selectTtAttendanceByWorkerId() {
    return request({
        url: moduleUrl+'/select/selectTtAttendanceByWorkerId',
        method: 'get',
    })
}

/**
 * 根据idCard分类查询考勤记录和实时在场
 * @returns {AxiosPromise}
 */
export function selectTtAttendanceByIdCard() {
    return request({
        url: moduleUrl+'/select/selectTtAttendanceByIdCard',
        method: 'get',
    })
}

/**
 * 根据日期查询打卡记录
 * @returns {AxiosPromise}
 */
export function selectAllTtAttendanceByWorkerId(param) {
    return request({
        url: moduleUrl+'/select/selectAllTtAttendanceByWorkerId?date='+param,
        method: 'get',
    })
}
export function selectAllTtAttendanceByIdCard(param) {
    return request({
        url: moduleUrl+'/select/selectAllTtAttendanceByIdCard?date='+param,
        method: 'get',
    })
}

/**
 * 分页查询打卡记录
 * @param param
 * @returns {*}
 */
//分页查询地磅信息
export function pageDB(params) {
    return request({
        url:'/wxgc/plus/td-work-data/select/weighbridgeInfo',
        method: 'get',
        params
    })
}

export function pageTtAttendanceByDateAndWorkerId(params) {
    return request({
        url: moduleUrl+'/select/pageTtAttendanceByDateAndWorkerId',
        method: 'get',
        params
    })
}
export function pageTtAttendanceByDateAndIdCard(params) {
    return request({
        url: moduleUrl+'/select/pageTtAttendanceByDateAndIdCard',
        method: 'get',
        params
    })
}

/**
 * 根据workerId查询作业人员统计
 * @returns {AxiosPromise}
 */
export function selectAttDayByWorkerId() {
    return request({
        url: moduleUrl+'/select/selectAttDayByWorkerId',
        method: 'get',
    })
}
/**
 * 根据idCard查询作业人员统计
 * @returns {AxiosPromise}
 */
export function selectAttDayByIdCard() {
    return request({
        url: moduleUrl+'/select/selectAttDayByIdCard',
        method: 'get',
    })
}

/**
 * 根据workerId查询近7日统计
 * @returns {AxiosPromise}
 */
export function selectAttSevenByWorkerId() {
    return request({
        url: moduleUrl+'/select/selectAttSevenByWorkerId',
        method: 'get',
    })
}

/**
 * 根据idCard查询近七日统计
 * @returns {AxiosPromise}
 */
export function selectAttSevenByIdCard() {
    return request({
        url: moduleUrl+'/select/selectAttSevenByIdCard',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtAttendance(params) {
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
export function addTtAttendance(data) {
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
export function updateTtAttendance(data) {
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
export function deleteTtAttendance(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

