import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/electronic-education-box-train";


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function selectPageList(params) {
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
export function save(data) {
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
export function update(data) {
  return request({
    url: moduleUrl + '/update',
    method: 'post',
    data
  })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteById(data) {
  return request({
    url: moduleUrl + '/deleteSensor',
    method: 'post',
    data
  })
}

// 查询所有设备
export function selectByMachineNo(params) {
  return request({
    url: moduleUrl + '/select/selectByMachineNo',
    method: 'get',
    params
  })
}

// 传感器实时刷新
export function sensorDataRefresh(data) {
  return request({
    url: moduleUrl + '/sensorDataRefresh',
    method: 'post',
    data
  })
}
