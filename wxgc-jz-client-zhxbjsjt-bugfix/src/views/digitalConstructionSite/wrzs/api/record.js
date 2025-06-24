/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

 import request from '@/utils/request'
 //当前模块的基本URL
 let moduleUrl = "/wxgc-base-system/wxgc/plus/weighbridgeWorkData";


  /**
 * 分页查询单次过磅数据
 * @returns {AxiosPromise}
 */
export function getSingleManager(params) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/select/single/list',
      method: 'get',
      params
    })
  }



    /**
 * 查询单次所有过磅数据
 * @returns {AxiosPromise}
 */
export function getSingleAllManager() {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/select/all',
      method: 'get',
    })
  }


 /**
   * 编辑单次过磅信息
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
 * 分页查询双次过磅数据
 * @returns {AxiosPromise}
 */
export function getdoubleManager(params) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/select/double/list?',
      method: 'get',
      params
    })
  }


