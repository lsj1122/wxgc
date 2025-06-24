
/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc-base-system/wxgc/plus/tj_attendance/";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getPageAttendance(params) {
  return request({
    url: moduleUrl+'/select/list',
    method: 'get',
    params
  })
}
