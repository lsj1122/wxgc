
/**
 * @auther JIN_GE
 * @create 2021-04-13
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/gzm-data-one";
let cedianUrl = "/wxgc/plus/tt-gzm";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getGzmList(params) {
    return request({
        url: moduleUrl+'/select/getGzmDataVO',
        method: 'get',
        params
    })
}

//查询option
export function getSelectOption(params) {
  return request({
      url: moduleUrl+'/select/selectOption',
      method: 'get',
      params
  })
}

//查询所有点
export function getAllOptions(params) {
    return request({
        url: cedianUrl+'/select/selectTtGzmByPro',
        method: 'get',
        params
    })
}

//删除测点
export function deletePoint(id) {
    return request({
        url: cedianUrl+`/delete/${id}`,
        method: 'delete'
    })
}

//查询所有下拉选项
export function getAllType(params) {
    return request({
        url: moduleUrl+'/select/selectTypeOption',
        method: 'get',
        params
    })
}

//添加测点
export function addPoint(data) {
    return request({
        url: cedianUrl+'/save',
        method: 'post',
        data
    })
}

// 查询考勤的表格数据
export function getTableChuQing(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-person/select/list',
        method: 'get',
        params
    })
}

// 查询考勤的  单位数据数据
export function getDanWeiSelect(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-person/select/build',
        method: 'get',
        params
    })
}
// 查询考勤的  班组数据
export function getBanZuSelect(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-person/select/team',
        method: 'get',
        params
    })
}
//getGongZhongSelect  查询考勤的  工种数据
export function getGongZhongSelect(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-person/select/jobs',
        method: 'get',
        params
    })
}