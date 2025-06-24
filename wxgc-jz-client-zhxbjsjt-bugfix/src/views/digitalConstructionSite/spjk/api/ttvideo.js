
/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

import request from '@/utils/request'
import fetch from "@/utils/request";
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-video";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtVideo() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectTtVideoByPro() {
    return request({
        url: moduleUrl+'/select/selectTtVideoByPro',
        method: 'get',
    })
}

export function selectTtVideoById(id) {
  return request({
    url: moduleUrl+'/select/'+id,
    method: 'get'
  })
}

/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtVideo(params) {
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
export function addTtVideo(data) {
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
export function updateTtVideo(data) {
    return request({
        url: moduleUrl+'/update',
        method: 'put',
        data
    })
}

export function updateTtVideoUp(data) {
    return request({
        url: moduleUrl+'/updateUp',
        method: 'put',
        data
    })
}
export function updateTtVideoDown(data) {
    return request({
        url: moduleUrl+'/updateDown',
        method: 'put',
        data
    })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtVideo(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

export function selectOpenVideo() {
  return request({
    url: moduleUrl+'/select/selectOpenVideo',
    method: 'get',
  })
}

export function addOpenVideo(data) {
  return request({
    url: moduleUrl+'/add/addOpenVideo',
    method: 'post',
    data:{
      ttVideo:data
    }
  })
}

export function controlVideo(ds,cno,dir) {
  return request({
    url: moduleUrl+`/select/changeVideo?deviceSerial=${ds}&channelNo=${cno}&direction=${dir}`,
    method: 'get'
  })
}
