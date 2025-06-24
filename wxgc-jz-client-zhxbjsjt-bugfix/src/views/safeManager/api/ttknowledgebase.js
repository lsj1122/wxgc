
/**
 * @auther JIN_GE
 * @create 2021-04-13
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-knowledge-base";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtKnowledgeBase() {
    return request({
        url: moduleUrl+'/select/all',
        method: 'get',
    })
}

export function selectAllTtKnowledgeBaseByType(data) {
    return request({
        url: moduleUrl+'/select/selectAllTtKnowledgeBaseByType',
        method: 'post',
        data
    })
}

export function selectKnowledgeCount(param) {
    return request({
        url: moduleUrl+'/select/selectKnowledgeCount?knowledgeBaseType='+param,
        method: 'get',
    })
}




/**
 * 分页查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getPageTtKnowledgeBase(params) {
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
export function addTtKnowledgeBase(data) {
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
export function updateTtKnowledgeBase(data) {
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
export function deleteTtKnowledgeBase(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}
//editType 质量知识库 新增类型的修改
export function editType(data) {
    return request({
        url: '/wxgc/plus/tt-knowledge-base/update',
        method: 'put',
        data
    })
}

