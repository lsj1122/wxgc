/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

 import request from '@/utils/request'
 //当前模块的基本URL
 let moduleUrl = "/iotdatawarehouse/open/safetyhelmet/device/v1";
 let deviceInfourl = "/iotdatawarehouse/open/safetyhelmet/deviceInfo/v1";
 let workurl ="/iotdatawarehouse/open/safetyhelmet/workData/v1";


 /**
  * 发送语音
  * @returns {AxiosPromise}
  */
 export function getAllsendVoiceManager(data) {
   return request({
     baseURL: process.env.VUE_APP_SAFE_HAT_API,
     url: moduleUrl + '/sendVoice?projectId=1',
     method: 'post',
     data
   })
 }

  /**
  * 发送指定设备自定义语音
  * @returns {AxiosPromise}
  */
   export function getAllsendTextToAudio(data) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: moduleUrl + '/textToAudio?projectId=1',
      method: 'post',
      data
    })
  }
 

  /**
  * 全部数据
  * @returns {AxiosPromise}
  */
   export function getAllData(params) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: deviceInfourl + '/select/all?projectId=1',
      method: 'get',
      params
    })
  }
 

  /**
  * 全部数据
  * @returns {AxiosPromise}
  */
   export function getAlldatalistManager(params) {
    return request({
      baseURL: process.env.VUE_APP_SAFE_HAT_API,
      url: deviceInfourl + '/select/all?projectId=1',
      method: 'get',
      params
    })
  }


    /**
  * 全部数据
  * @returns {AxiosPromise}
  */
     export function getAlldataManager(params) {
      return request({
        baseURL: process.env.VUE_APP_SAFE_HAT_API,
        url: deviceInfourl + '/select/list?projectId=1',
        method: 'get',
        params
      })
    }


        /**
  * 主键查询工作全部数据
  * @returns {AxiosPromise}
  */
         export function getAllworkManager(params) {
          return request({
            baseURL: process.env.VUE_APP_SAFE_HAT_API,
            url: workurl + '/select/searchAll?projectId=1',
            method: 'get',
            params
          })
        }
