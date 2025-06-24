/**
 * @auther JIN_GE
 * @create 2021-04-13
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-digit-location";
let tjNewData = "/wxgc/plus/tj-work-data";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtDigitLocation() {
  return request({
    url: moduleUrl + '/select/all',
    method: 'get',
  })
}

export function selectAllTtDigitLocationByPro() {
  return request({
    url: moduleUrl + '/select/selectAllTtDigitLocationByPro',
    method: 'get',
  })
}
export function BoardDigitVo(type) {
  return request({
    url: moduleUrl + '/select/BoardDigitVo?type=' + type,
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtDigitLocation(params) {
  return request({
    url: moduleUrl + '/select/list',
    method: 'get',
    params
  })
}

/**
 * 查询最新塔机数据
 * @param params
 * @returns {AxiosPromise}
 */
export function getNewTjData(params) {
  return request({
    url: tjNewData + '/select/selectNewData',
    method: 'get',
    params
  })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTtDigitLocation(data) {
  return request({
    url: moduleUrl + '/save',
    method: 'post',
    data
  })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTtDigitLocation(data) {
  return request({
    url: moduleUrl + '/update',
    method: 'put',
    data
  })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtDigitLocation(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}

/**
 * 查询钢丝绳
 * @param params
 * @returns {AxiosPromise}
 */
export function sensorRealTimeData(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tj-sensor/sensorRealTimeData',
    method: 'get',
    params
  })
}

// 查询所有的钢丝绳预警
export function selectListByParam(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tj-sensor/selectListByParam',
    method: 'get',
    params
  })
}

//realTimeOne 根据设备编号查询最新实时数据[TjWorkData]
export function realTimeOne(data) {
  return request({
      url: '/wxgc-base-system/wxgc/plus/tj-work-data/select/realTimeOne',
      method: 'post',
      data
  })
}