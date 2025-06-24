

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/electronic-education-box";

/**
 * 主键查询工作全部数据
 * @returns {AxiosPromise}
 */
export function selectStatistics() {
  return request({
    url: moduleUrl + '/select/statistics',
    method: 'get'
  })
}

export function selectTrainTable() {
  return request({
    url: moduleUrl + '/select/trainTable',
    method: 'get'
  })
}
