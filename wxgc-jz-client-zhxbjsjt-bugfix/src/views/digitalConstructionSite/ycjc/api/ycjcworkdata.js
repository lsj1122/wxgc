/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/ycjc-work-data";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllYcjcWorkData() {
  return request({
    url: moduleUrl + '/select/all',
    method: 'get',
  })
}

/**
 * 查询最新的环境监测
 * @returns {AxiosPromise}
 */
export function selectNow(params) {
  return request({
    url: moduleUrl + '/select/selectNow',
    method: 'get',
    params
  })
}
export function selectNowSelect(params) {
  return request({
    url: moduleUrl + '/select/selectNowByMachineNum',
    method: 'get',
    params
  })
}

export function selectTtYcjcByProLimit1() {
  return request({
    url: moduleUrl + '/select/selectTtYcjcByProLimit1',
    method: 'get',
  })
}

// 环境监测的下拉查询
export function hjjcSelect(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tt-ycjc/select/list',
    method: 'get',
    params
  })
}

/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageYcjcWorkData(params) {
  return request({
    url:  '/wxgc-base-system/wxgc/plus/ycjc-warning-data/select/list',
    method: 'get',
    params
  })
}



/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addYcjcWorkData(data) {
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
export function updateYcjcWorkData(data) {
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
export function deleteYcjcWorkData(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}

/**
 * 查询阀值
 * @returns {AxiosPromise}
 */
export function selectRed() {
  return request({
    url: moduleUrl + '/select/selectRed',
    method: 'get',
  })
}


/**
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function addOrUpdateTtYcjcRed(data) {
  return request({
    url: moduleUrl + '/addOrUpdateTtYcjcRed',
    method: 'post',
    data
  })
}

/**
 * 企业级-绿色管理-实时空气质量
 * @returns {AxiosPromise}
 */
export function selectYcjcDataByChild(params) {
  return request({
    url: moduleUrl + '/select/selectYcjcDataByChild',
    method: 'get',
    params
  })
}

/**
 * 企业级-绿色管理-项目告警统计
 * @returns {AxiosPromise}
 */
export function selectYcjcProByChild(params) {
  return request({
    url: moduleUrl + '/select/selectYcjcProByChild',
    method: 'get',
    params
  })
}
export function selectYcjcWarnByChild(params) {
  return request({
    url: moduleUrl + '/select/selectYcjcWarnByChild',
    method: 'get',
    params
  })
}


// 查询用电监测
export function selectYDJC(params) {
  return request({
    url: '/wxgc/plus/electric-work-date/select/selectByProjectIdLimitOne',
    method: 'get',
    params
  })
}

// 根据水电表的设备编号查询最新的表码数
export function getByMachineNumber(id) {
  return request({
    url: '/wxgc/plus/tt-ele-water/getByMachineNumber/' + id,
    method: 'get',

  })
}

// getPageYcjcHistory
export function getPageYcjcHistory(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/ycjc-work-data/select/list' ,
    method: 'get',
    params
  })
}

