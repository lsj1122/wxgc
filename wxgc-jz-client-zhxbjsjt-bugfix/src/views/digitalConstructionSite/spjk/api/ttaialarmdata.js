
/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-ai-alarm-data";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtAiAlarmData() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtAiAlarmData(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}
//getPageTtAiAlarmDataCarWash 车辆冲洗的查询
export function getPageTtAiAlarmDataCarWash(params) {
  return request({
      url: '/wxgc-base-system/wxgc/plus/tt-spray/select/list',
      method: 'get',
      params
  })
}

/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTtAiAlarmData(data) {
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
export function updateTtAiAlarmData(data) {
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
export function deleteTtAiAlarmData(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

export function select1() {
  return request({
    url: moduleUrl+'/select1',
    method: 'get',
  })
}
//接口描述：AI统计(GET)
export function aisum(params) {
  return request({
      url: '/wxgc/plus/tt-video/select/selecAIStatistics',
      method: 'get',
      params
  })
}
export function select2() {
  return request({
    url: moduleUrl+'/select2',
    method: 'get',
  })
}

export function select3() {
  return request({
    url: moduleUrl+'/select3',
    method: 'get',
  })
}

export function select4() {
  return request({
    url: moduleUrl+'/select4',
    method: 'get',
  })
}
// 接口描述：企业级-智能视频监控-违规统计(GET)
export function violationsStatistics(params) {
  return request({
      url: 'wxgc/plus/tt-video/select/selectCountViolateByChild',
      method: 'get',
      params
  })
}

// 抓拍记录统计
export function Capture(params) {
  return request({
      url: '/wxgc/plus/tt-video/select/selectCaptureRecordStatistics',
      method: 'get',
      params
  })
}


