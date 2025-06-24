import request from '@/utils/request'


export function selectAll(params) {
  return request({
    url: '/wxgc-base-system/auth/wxgc/plus/markdown/selectAll',
    method: 'get',
    params
  })
}


export function addMarkdown(data) {
  return request({
    url: '/wxgc-base-system/auth/wxgc/plus/markdown/addMarkdown',
    method: 'post',
    data
  })
}


/**
 * 增加
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteById(id) {
  return request({
    url: '/wxgc-base-system/auth/wxgc/plus/markdown/deleteById/' + id,
    method: 'delete',
  })
}

export function updateMarkdown(data) {
  return request({
    url: '/wxgc-base-system/auth/wxgc/plus/markdown/updateMarkdown',
    method: 'post',
    data
  })
}

export function simpleUpload(data) {
  return request({
    url: '/wxgc-base-system/auth/wxgc/plus/tt-file/simpleUpload',
    method: 'post',
    data
  })
}
