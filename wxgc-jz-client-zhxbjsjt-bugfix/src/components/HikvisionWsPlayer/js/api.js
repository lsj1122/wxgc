import request from '@/utils/request'
const moduleUrl = ''

export function getUrls(data) {
  return request({
    url: moduleUrl + '/wxgc/hikvision/video/v2/select/url',
    method: 'post',
    data
  })
}

// 云台控制
export function getController(params) {
  return request({
    url: moduleUrl + '/wxgc/hikvision/video/v2/videoController',
    method: 'GET',
    params
  })
}
