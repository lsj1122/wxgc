/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-snbys-work-data";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllEleWaterWorkData() {
  return request({
    url: moduleUrl + '/select/all',
    method: 'get',
  })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageEleWaterWorkData(params) {
  return request({
    url: moduleUrl + '/select/list',
    method: 'get',
    params
  })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addEleWaterWorkData(data) {
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
export function updateEleWaterWorkData(data) {
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
export function deleteEleWaterWorkData(id) {
  return request({
    url: moduleUrl + '/delete/' + id,
    method: 'delete'
  })
}


/**
 * 企业级-绿色管理-总水电量
 * @param params
 * @returns {AxiosPromise}
 */
export function selectCountWaterByChild(params) {
  return request({
    url: moduleUrl + '/select/selectCountWaterByChild',
    method: 'get',
    params
  })
}

/**
 * 企业级-绿色管理-总用电量
 * @param params
 * @returns {AxiosPromise}
 */
export function selectCountEleByChild(params) {
  return request({
    url: moduleUrl + '/select/selectCountEleByChild',
    method: 'get',
    params
  })
}

// 获取水单表的设备编号
export function getSheBeiInfo(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tt-ele-water/select/equipmentList',
    method: 'get',
    params
  })
}


/**
 * 水泥标养室更新注册返回帧
 * @param data 注册帧数据
 * @param id 设备ID
 * @returns {AxiosPromise}
 */
export function machineRegisterSnbys(data, id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/snbys/' + id,
    method: 'post',
    data
  })
}

/**
 * 水泥标养室锁机
 * @param data 注册帧数据
 * @param id 设备ID
 * @returns {AxiosPromise}
 */
export function lockSnbys(id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/lockMachine/lockSnbys/' + id,
    method: 'post',
  })
}

//喷淋更新注册返回帧
export function machineRegisterPL(data, id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/pl/' + id,
    method: 'post',
    data
  })
}
//扬尘检测更新注册返回帧
export function machineRegisterycjc(data, id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/ycjc/' + id,
    method: 'post',
    data
  })
}

/**
 * 扬尘检测锁机
 * @param data 注册帧数据
 * @param id 设备ID
 * @returns {AxiosPromise}
 */
 export function lockYcjc(id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/lockMachine/lockYcjc/' + id,
    method: 'post',
  })
}

//machineRegisterszjc 水质检测更新注册返回帧
export function machineRegisterszjc(data, id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/szjc/' + id,
    method: 'post',
    data
  })
}

//lockXL 卸料平台锁机
export function lockXL(id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/lockMachine/lockXlpt/' + id,
    method: 'post',
  })
}

//machineRegisterXL
export function machineRegisterXL(data, id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/xlpt/' + id,
    method: 'post',
    data
  })
}

//lockRS 人数识别锁机
export function lockRS(id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/lockMachine/lockRssb/' + id,
    method: 'post',
  })
}

//machineRegisterRS 人数识别更新注册返回帧
export function machineRegisterRS(data, id) {
  return request({
    url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/rssb/' + id,
    method: 'post',
    data
  })
}