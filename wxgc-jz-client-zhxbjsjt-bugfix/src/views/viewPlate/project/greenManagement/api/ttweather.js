
/**
 * @auther JIN_GE
 * @create 2021-04-15
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-weather";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtWeather() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

/**
 * 查询近一个月空气质量
 * @returns {AxiosPromise}
 */
export function selectAirLevel() {
    return request({
        url: moduleUrl+'/select/selectAirLevel',
        method: 'get',
    })
}

export function selectAirLevelLimit5() {
    return request({
        url: moduleUrl+'/select/selectAirLevelLimit5',
        method: 'get',
    })
}

export function selectTtWeatherByPro(param) {
    return request({
        url: moduleUrl+'/select/selectTtWeatherByPro?date='+param,
        method: 'get',
    })
}

export function selectTtWeatherByProNow() {
  return request({
    url: moduleUrl+'/select/selectTtWeatherByPro',
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtWeather(params) {
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
export function addTtWeather(data) {
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
export function updateTtWeather(data) {
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
export function deleteTtWeather(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}


//  喷淋控制 的状态查询
export function selectHandleControl(params) {
    return request({
        url: '/wxgc/plus/tt-switch/select/list',
        method: 'get',
        params
    })
}
// 喷淋控制 手动/自动 修改的状态
export function updateHandleControl(data) {
    return request({
        url: '/wxgc/plus/tt-switch/update',
        method: 'put',
        data
    })
}
