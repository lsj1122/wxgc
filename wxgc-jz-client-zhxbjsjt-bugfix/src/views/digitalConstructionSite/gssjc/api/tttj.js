import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-tj";


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function selectPageList(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tj-sensor/selectPageList',
    method: 'get',
    params
  })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function saveSensor(data) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tj-sensor/saveSensor',
    method: 'post',
    data
  })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSensor(data) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tj-sensor/updateSensor',
    method: 'post',
    data
  })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtTj(data) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tj-sensor/deleteSensor',
    method: 'post',
    data
  })
}

// 查询所有设备
export function selectTtTjByNum(params) {
  return request({
    url: '/wxgc-base-system/wxgc/plus/tt-tj/select/selectTtTjByNum',
    method: 'get',
    params
  })
}

// 传感器实时刷新
 export function sensorDataRefresh(data) {
    return request({
      url: '/wxgc-base-system/wxgc/plus/tj-sensor/sensorDataRefresh',
      method: 'post',
      data
    })
  }
  