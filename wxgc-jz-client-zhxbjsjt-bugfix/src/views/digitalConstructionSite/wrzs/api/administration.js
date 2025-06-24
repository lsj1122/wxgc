/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

 import request from '@/utils/request'
 //当前模块的基本URL
 let moduleUrl = "/wxgc-base-system/wxgc/plus/weighbridgeDeviceInfo";


 /**
 * 分页查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllWeighbridgeManager(params) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/select/list',
      method: 'get',
      params
    })
  }


/**
 * 增加设备信息
 * @returns {AxiosPromise}
 */
 export function addManager(data) {
  return request({
    baseURL: process.env.VUE_APP_SAFE_HAT_API,
    url: moduleUrl + '/save',
    method: 'post',
    data
  })
}



  /**
   * 编辑设备信息
   * @returns {AxiosPromise}
   */
   export function updataManager(data) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/update',
      method: 'put',
      data
    })
  }


  /**
 * 删除设备信息
 * @returns {AxiosPromise}
 */
export function deleteManager(id) {
  return request({
    baseURL: process.env.VUE_APP_SAFE_HAT_API,
    url: moduleUrl + '/delete/'+ id  ,
    method: 'delete',
  })
}
