
/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

 import request from '@/utils/request'
//  //当前模块的基本URL
//  let moduleUrl="/wxgc/plus/ele-water-work-data";
 
//  /**
//   * 查询所有数据
//   * @returns {AxiosPromise}
//   */
//  export function getAllEleWaterWorkData() {
//      return request({
//          url: moduleUrl+'/select/all',
//          method: 'get',
//      })
//  }
 
 
//  /**
//   * 分页查询
//   * @param params
//   * @returns {AxiosPromise}
//   */
//  export function getPageEleWaterWorkData(params) {
//      return request({
//          url: moduleUrl+'/select/list',
//          method: 'get',
//          params
//      })
//  }
 
 
//  /**
//   * 增加
//   * @param data
//   * @returns {AxiosPromise}
//   */
//  export function addEleWaterWorkData(data) {
//      return request({
//          url: moduleUrl+'/save',
//          method: 'post',
//          data
//      })
//  }
 
//  /**
//   * 修改
//   * @param data
//   * @returns {AxiosPromise}
//   */
//  export function updateEleWaterWorkData(data) {
//      return request({
//          url: moduleUrl+'/update',
//          method: 'put',
//          data
//      })
//  }
 
 
//  /**
//   * 删除
//   * @param id
//   * @returns {AxiosPromise}
//   */
//  export function deleteEleWaterWorkData(id) {
//      return request({
//          url: moduleUrl+'/delete/'+id,
//          method: 'delete'
//      })
//  }
 
//  /**
//   * 企业级-绿色管理-总水电量
//   * @param params
//   * @returns {AxiosPromise}
//   */
//  export function selectCountWaterByChild(params) {
//    return request({
//      url: moduleUrl+'/select/selectCountWaterByChild',
//      method: 'get',
//      params
//    })
//  }
 
//  /**
//   * 企业级-绿色管理-总用电量
//   * @param params
//   * @returns {AxiosPromise}
//   */
//  export function selectCountEleByChild(params) {
//    return request({
//      url: moduleUrl+'/select/selectCountEleByChild',
//      method: 'get',
//      params
//    })
//  }
 
 
//  // 用电监测历史，记录
//  export function getPagehistoryYDJC(params) {
//      return request({
//          url: '/wxgc/plus/electric-work-date/select/selectByPorjectIdPage',
//          method: 'get',
//          params
//      })
//  }


 
 // 新增喷淋设备  addPenLinSheBeiInfo
  export function addPenLinSheBeiInfo(data) {
     return request({
         url: '/wxgc/plus/tt-switch/save',
         method: 'post',
         data
     })
 }
 // 编辑  upPenLinSheBeiInfo
 export function upPenLinSheBeiInfo(data) {
    return request({
        url: '/wxgc/plus/tt-switch/update',
        method: 'put',
        data
    })
}
//deleteSheBei 删除设备
export function deleteSheBei(id) {
    return request({
        url: '/wxgc/plus/tt-switch/delete/'+id,
        method: 'delete'
    })
}

 

//getPenLinControlInfo 查询喷淋控制的信息  
 export function getPenLinControlInfo(params) {
   return request({
     url: '/wxgc/plus/tt-switch/select/list',
     method: 'get',
     params
   })
 }
 //updateHandleControl
 // 喷淋控制 手动/自动 修改的状态
export function updateHandleControl(data) {
    return request({
        url: '/wxgc/plus/tt-switch/update',
        method: 'put',
        data
    })
}
