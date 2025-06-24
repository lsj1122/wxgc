
/**
 * @auther JIN_GE
 * @create 2021-02-24
 * @describe 数据字典表AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/sys-dictionary";

/**
 * 查询所有数据字典表数据
 * @returns {AxiosPromise}
 */
export function getAllSysDictionary() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

/**
 * 根据类型查询数据字典表数据
 * @returns {AxiosPromise}
 */
export function getSysDictionaryByType(type) {
  return request({
    url: moduleUrl+'/select/type/'+type,
    method: 'get',
  })
}



/**
 * 分页查询数据字典表
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageSysDictionary(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加数据字典表
 * @param data
 * @returns {AxiosPromise}
 */
export function addSysDictionary(data) {
    return request({
        url: moduleUrl+'/save',
        method: 'post',
        data
    })
}

/**
 * 修改数据字典表
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSysDictionary(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}


/**
 * 删除数据字典表
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSysDictionary(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

