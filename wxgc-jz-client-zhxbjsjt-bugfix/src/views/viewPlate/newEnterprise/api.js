import request from '@/utils/request'

/**
 * 查询累计设备统计
 * @returns {AxiosPromise}
 */
export function cumulateEquipmentStatistics(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/cumulateEquipmentStatistics',
    method: 'get',
    params
  })
}

/**
 * 新增设备统计(近90天)
 * @returns {AxiosPromise}
 */
export function newEquipmentStatistics(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/newEquipmentStatistics',
    method: 'get',
    params
  })
}


/**
 * 项目统计
 * @returns {AxiosPromise}
 */
export function allProjectStatistics(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/allProjectStatistics',
    method: 'get',
    params
  })
}


/**
 * 大型设备统计
 * @returns {AxiosPromise}
 */
export function largeEquipmentStatistics(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/largeEquipmentStatistics',
    method: 'get',
    params
  })
}

/**
 * 设备在线统计
 * @returns {AxiosPromise}
 */
export function selectAllOnlineSituation(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/selectAllOnlineSituation',
    method: 'get',
    params
  })
}


/**
 * 各省份设备分布数量Top5
 * @returns {AxiosPromise}
 */
export function provinceTopFiveStatistics(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/provinceTopFiveStatistics',
    method: 'get',
    params
  })
}

/**
 * 各城市设备分布数量Top5
 * @returns {AxiosPromise}
 */
 export function cityTopFiveStatistics(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/cityTopFiveStatistics',
    method: 'get',
    params
  })
}


/**
 * 近30天报警设备统计
 * @returns {AxiosPromise}
 */
 export function selectEquipmentAlarmStatistics(params) {
  return request({ 
    url: '/wxgc-base-system/wxgc/jz/enterprise/selectEquipmentAlarmStatistics',
    method: 'get',
    params
  })
}

//大屏中心查询
export function selectBigScreenCore(params) {
  return request({
    url: '/wxgc-base-system/wxgc/jz/enterprise/selectBigScreenCore',
    method: 'get',
    params
  })
}