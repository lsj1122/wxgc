
import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-td";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtTd() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTtTdByNum(param) {
  return request({
    url: moduleUrl+'/select/selectTtTdByNum?machineNumber='+param,
    method: 'get',
  })
}

/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtTd(params) {
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
export function addTtTd(data) {
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
export function updateTtTd(data) {
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
export function deleteTtTd(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

/**
 * 主键查询升降机，施工电梯
 * @param id
 * @returns {AxiosPromise}
 */
 export function selectSingle(id) {
    return request({
        url: moduleUrl+'/select/'+id,
        method: 'get'
    })
}


/**
 *升降机更新注册返回帧
 * @param data 注册帧数据
 * @param id 设备ID
 * @returns {AxiosPromise}
 */
 export function machineRegisterTd(data,id) {
    return request({
      url: '/wxgc-juzheng-iot/wxgc/juzheng/machineRegister/td/' + id,
      method: 'post',
      data
    })
  }
  
  /**
   * 升降机锁机
   * @param id 设备ID
   * @returns {AxiosPromise}
   */
  export function lockTd(id) {
    return request({
      url: '/wxgc-juzheng-iot/wxgc/juzheng/lockMachine/lockTd/' + id,
      method: 'post',
    })
  }

  //selectAllInfo 升降机信息查询
  export function selectAllInfo(id) {
    return request({
      url: '/wxgc/plus/tt-td/selectAllInfo/' + id,
      method: 'get',
    })
  }
  