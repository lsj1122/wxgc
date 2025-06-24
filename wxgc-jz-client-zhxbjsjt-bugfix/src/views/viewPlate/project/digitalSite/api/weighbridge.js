/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

 import request from '@/utils/request'
 //当前模块的基本URL
 let moduleUrl = "/wxgc-base-system/wxgc/plus/weighbridgeWorkData";

  /**
  * 查询地磅大屏数据
  * @returns {AxiosPromise}
  */
   export function getAllweighbridgeManager() {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/select/allInfo',
      method: 'get',
    })
  }


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
 * 分页查询双次过磅数据
 * @returns {AxiosPromise}
 */
     export function getdoubleManager(params) {
      return request({
        baseURL: process.env.VUE_APP_SAFE_HAT_API,
        url: moduleUrl + '/select/double/list',
        method: 'get',
        params
      })
    }
