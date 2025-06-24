
/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request1'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-file";

export function downLoadFile(param) {
  return request({
    url: moduleUrl+'/downLoadFile?filePath='+param,
    method: 'get',
  })
}

/**
 * 上传单文件返回路径
 * @param data
 * @returns {AxiosPromise}
 */
export function simpleUpload(data) {
    return request({
        url: moduleUrl+'/simpleUpload',
        method: 'post',
        data
    })
}

/**
 * 上传多文件返回数组
 * @param data
 * @returns {AxiosPromise}
 */
export function simpleUploads(data) {
    return request({
        url: moduleUrl+'/simpleUploads',
        method: 'post',
        data
    })
}

export function simpleUploadsReturnTtFile(data) {
    return request({
        url: moduleUrl+'/simpleUploadsReturnTtFile',
        method: 'post',
        data
    })
}

export function selectFileById(param) {
    return request({
        url: moduleUrl+'/selectFileById?ids='+param,
        method: 'get',
    })
}

