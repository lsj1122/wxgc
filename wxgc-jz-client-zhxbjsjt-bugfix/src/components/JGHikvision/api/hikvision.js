
/**
 * @auther JIN_GE
 * @create 2021-07-21
 * @describe 病害记录AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/system/wxgc/hikvision";


/**
 * 获取根区域信息
 * @returns {AxiosPromise}
 */
export function getRootRegion() {
    return request({
        url: moduleUrl+'/region/root',
        method: 'get',
    })
}


/**
 * 根据区域编号获取下一级区域列表v2
 * @param params
 * @returns {AxiosPromise}
 */
export function getSubRegions(params) {
    return request({
        url: moduleUrl+'/region/subRegions',
        method: 'get',
        params
    })
}

/**
 * 根据区域编号获取下一级区域列表v2结构树
 * @param params
 * @returns {AxiosPromise}
 */
export function getNodesRegions(params) {
  return request({
    url: moduleUrl+'/region/nodesRegions',
    method: 'get',
    params
  })
}


/**
 * 查询资源列表v2
 * @param params
 * @returns {AxiosPromise}
 */
export function getResources(params) {
  return request({
    url: moduleUrl+'/resource/list',
    method: 'get',
    params
  })
}


/**
 * 查询视频的真实播放地址
 * @param params
 * @returns {AxiosPromise}
 */
export function getVideoUrl(cameraIndexCode,ssl,streamType) {
  if(ssl){ //https
    return request({
      url: moduleUrl+'/video/select/ssl/url/'+cameraIndexCode,
      method: 'get',
      params:{streamType:streamType}
    })
  }else{ //http
    return request({
      url: moduleUrl+'/video/select/url/'+cameraIndexCode,
      method: 'get',
      params:{streamType:streamType}
    })
  }
}

/**
 * 更新监控状态
 * @param params
 * @returns {AxiosPromise}
 */
export function updateVideoStatus(params) {
  return request({
    url: moduleUrl+'/video/videoController',
    method: 'get',
    params
  })
}





