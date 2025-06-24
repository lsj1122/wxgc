
/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

 import request from '@/utils/request'
 //当前模块的基本URL
 let moduleUrl="/wxgc/plus/tt-ele-water";
 
 /**
  * 查询所有数据
  * @returns {AxiosPromise}
  */
 export function getAllTtEleWater() {
     return request({
         url: moduleUrl+'/select/all',
         method: 'get',
     })
 }
 
 export function selectAllWaterEle() {
     return request({
         url: moduleUrl+'/select/selectAllWaterEle',
         method: 'get',
     })
 }
 
 export function selectEleWaterDualLine(param) {
     return request({
         url: moduleUrl+'/select/selectEleWaterDualLine?machineType='+param,
         method: 'get',
     })
 }
 
 
 /**
  * 分页查询
  * @param params
  * @returns {AxiosPromise}
  */
 export function getPageTtEleWater(params) {
     return request({
         url: moduleUrl+'/select/list',
         method: 'get',
         params
     })
 }
 
 
 /**
  * 增加
  * @param data
  * @returns {AxiosPromise}
  */
 export function addTtEleWater(data) {
     return request({
         url: moduleUrl+'/save',
         method: 'post',
         data
     })
 }
 
 /**
  * 修改
  * @param data
  * @returns {AxiosPromise}
  */
 export function updateTtEleWater(data) {
     return request({
         url: moduleUrl+'/update',
         method: 'put',
         data
     })
 }
 
 
 /**
  * 删除
  * @param id
  * @returns {AxiosPromise}
  */
 export function deleteTtEleWater(id) {
     return request({
         url: moduleUrl+'/delete/'+id,
         method: 'delete'
     })
 }
 










 
 //addPeopleM 增加操作人数识别管理
 export function addPeopleM(data) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/people-number-identify/save',
        method: 'post',
        data
    })
}
//getPagePeopleM 基于IPage分页查询人数识别管理
export function getPagePeopleM(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/people-number-identify/select/list',
        method: 'get',
        params
    })
}
//updatePeopleM
export function updatePeopleM(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/people-number-identify/update',
        method: 'put',
        data
    })
}
export function deletePeopleM(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/people-number-identify/delete/'+id,
        method: 'delete'
    })
}



//主键查询人数识别管理
export function lookOneInfoPeopleM(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/people-number-identify/select/'+id,
        method: 'get'
    })
}

//getPagePeopleMHistory 基于IPage分页查询人数识别考勤信息
export function getPagePeopleMHistory(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/people-attendance-info/select/list',
        method: 'get',
        params
    })
}
//getPagePeopleMZP 基于IPage分页查询人数识别抓拍信息
export function getPagePeopleMZP(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/people-capture-info/select/list',
        method: 'get',
        params
    })
} 
//realTimeOne 根据设备编号查询最新实时数据[TjWorkData]
export function realTimeOne(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tj-work-data/select/realTimeOne',
        method: 'get',
        params
    })
}