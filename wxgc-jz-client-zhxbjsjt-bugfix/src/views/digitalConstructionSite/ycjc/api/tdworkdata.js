
import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/td-work-data";
let moduleUrl1="/wxgc/plus/td-circle-data";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTdWorkData() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTdWorkDataByNum(param) {
  return request({
    url: moduleUrl+'/select/selectTdWorkDataByNum?machineNumber='+param,
    method: 'get',
  })
}


/**
 * 分页查询升降机实时数据
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTdWorkData(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}

/**
 * 分页查询升降机认证信息
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTdRz(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/td-attendance/select/list',
        method: 'get',
        params
    })
}

/**
 * 分页查询升降机抓拍考勤照片
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTdZp(params) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/td-attendance-photo/select/list',
        method: 'get',
        params
    })
}

/**
 * 分页查询升降机工作循环
 * @param params
 * @returns {AxiosPromise}
 */
 export function getPageTdCycle(params) {
    return request({
        url: moduleUrl1+'/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTdWorkData(data) {
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
export function updateTdWorkData(data) {
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
export function deleteTdWorkData(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

