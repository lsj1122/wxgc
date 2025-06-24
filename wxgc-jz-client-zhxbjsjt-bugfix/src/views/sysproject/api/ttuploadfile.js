
/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-upload-file";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtUploadFile() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

/**
 *按类型查询
 * 文件显示地址--0通知公告,1app首页图片,2航拍视频,3施工图纸,4质量工艺展示视频,5工程质量样板视频,6进度资料,7大事记,8技术交底文件,9质量图片轮播,10绿色施工现场图片,11喷淋控制图片,12项目实景图,13深基坑
 * 19  预警螺母布置图
 * @returns {AxiosPromise}
 */
export function selectType(param) {
    return request({
        url: moduleUrl+'/select/selectType?type='+param,
        method: 'get',
    })
}

// 查询 质量管理  工程质量样板 （模块）

export function gongchengSelect(param) {
    return request({
        url:'/wxgc-base-system/wxgc/plus/tt-project-url/selectByProjectId',
        method: 'get',
    })
}

/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtUploadFile(params) {
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
export function addTtUploadFile(data) {
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
export function updateTtUploadFile(data) {
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
export function deleteTtUploadFile(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}

//项目进度列表 (查询)
export function getProjectProgress(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-percentage/select/list',
        method: 'get',
        params
    })
}

//项目进度列表 (添加)
export function addProjectProgressList(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-percentage/save',
        method: 'post',
        data
    })
}

//项目进度列表 (编辑)
export function bianjiProjectProgress(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-percentage/update',
        method: 'put',
        data
    })
}

///项目进度列表 (删除)
export function deleteProjectProgress(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-percentage/delete/'+id,
        method: 'delete'
    })
}

