
/**
 * @auther JIN_GE
 * @create 2021-03-22
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllSysProject(params) {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
        params
    })
}

export function getAllClassSysProject() {
    return request({
        url: moduleUrl+'/select/allone',
        method: 'get',
    })
}


/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageSysProject(params) {
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
export function addSysProject(data) {
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
export function updateSysProject(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function resetProjectRole(data) {
  return request({
    url: moduleUrl+'/resetProjectRole',
    method: 'put',
    data
  })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSysProject(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}



/**
 * 查看班组信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtteam() {
    return request({
        url: '/wxgc/plus/tt-team'+'/select/selectAllTtTeamByProjectId',
        method: 'get'
    })
}



/**
 * 查看人员信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtPerson(params) {
    return request({
        url: '/wxgc/plus/tt-person'+'/select/list',
        method: 'get',
        params
    })
}


