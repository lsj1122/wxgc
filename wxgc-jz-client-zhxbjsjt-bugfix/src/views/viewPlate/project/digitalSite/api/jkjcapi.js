
/**
 * @auther JIN_GE
 * @create 2021-04-13
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let jkjcUrl = "/wxgc/plus/tt-jk-point";
let jkjcDataUrl = "/wxgc/plus/tt-jk-week-data";
let addCeOption = "wxgc/plus/tt-jk-location";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
//获取详细数据
export function getJkjcList(params) {
    return request({
        url: jkjcDataUrl+'/select/selectDetailData',
        method: 'get',
        params
    })
}

//获取左下角所有数据
export function getAllPoints(params) {
    return request({
        url: jkjcUrl+'/select/selectAllTtJkPointByPro',
        method: 'get',
        params
    })
}

//查询图标数据
export function getEchartData(params) {
    return request({
        url: jkjcDataUrl+'/select/selectChartData',
        method: 'get',
        params
    })
}

//查询所有点
export function getAllOptions(params) {
    return request({
        url: addCeOption+'/select/selectTtJkLocationByPro',
        method: 'get',
        params
    })
}

//删除测点
export function deletePoint(id) {
    return request({
        url: addCeOption+`/delete/${id}`,
        method: 'delete'
    })
}

//查询所有下拉选项
export function getAllType(params) {
    return request({
        url: jkjcUrl+'/select/selectTtJkPointByPro',
        method: 'get',
        params
    })
}

//添加测点
export function addPoint(data) {
    return request({
        url: addCeOption+'/save',
        method: 'post',
        data
    })
}



//单独为了中国能建写的项目数据
// 测斜
export function getCeXieInfo(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-cexie/select/group',
        method: 'get',
        params
    })
}
/// 测斜 表格
export function getCeXieInfoTable(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-cexie/select/list',
        method: 'get',
        params
    })
}

//getCehngjiangInfo 沉降
export function getCehngjiangInfo(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-chenjiang/select/group',
        method: 'get',
        params
    })
}
//getChengjingTable 沉降表格
export function getChengjingTable(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-chenjiang/select/list',
        method: 'get',
        params
    })
}
//getShuiPingInfo 水平
export function getShuiPingInfo(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-shuiping/select/group',
        method: 'get',
        params
    })
}
//getShuipingTable 水平table
export function getShuipingTable(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-shuiping/select/list',
        method: 'get',
        params
    })
}

//getShuiWEiInfo 水位
export function getShuiWEiInfo(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-shuiwei/select/group',
        method: 'get',
        params
    })
}
//getShuiWEiInfo 水位 table
export function getgetShuiWEiTable(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/nj-shuiwei/select/list',
        method: 'get',
        params
    })
}