
/**
 * @auther JIN_GE
 * @create 2021-03-11
 * @describe 文件块记录AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/file-chunk-info";

/**
 * 查询所有文件块记录数据
 * @returns {AxiosPromise}
 */
export function getAllErpChunkInfo() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}


/**
 * 分页查询文件块记录
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageErpChunkInfo(params) {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
        params
    })
}


/**
 * 增加文件块记录
 * @param data
 * @returns {AxiosPromise}
 */
export function addErpChunkInfo(data) {
    return request({
        url: moduleUrl+'/save',
        method: 'post',
        data
    })
}

/**
 * 修改文件块记录
 * @param data
 * @returns {AxiosPromise}
 */
export function updateErpChunkInfo(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}


/**
 * 删除文件块记录
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteErpChunkInfo(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

/**
 * 删除文件块全部记录
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteAll(id) {
  return request({
    url: moduleUrl+'/deleteAll',
    method: 'delete'
  })
}


