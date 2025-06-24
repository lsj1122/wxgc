
/**
 * @auther JIN_GE
 * @create 2021-03-31
 * @describe AIP接口
 */

import request from '@/utils/request'
//当前模块的基本URL
let moduleUrl="/wxgc/plus/tt-qualitysafe-manager";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllTtQualitysafeManager() {
    return request({
        url: moduleUrl+'/select/list',
        method: 'get',
    })
}

/**
 * 质量检查和安全隐患图表
 * @returns {AxiosPromise}
 */
export function selectAmount() {
    return request({
        url: moduleUrl+'/select/selectAmount',
        method: 'get',
    })
}

/**
 * 机械汇总
 * @returns {AxiosPromise}
 */
export function selectMachineCount() {
    return request({
        url: moduleUrl+'/select/selectMachineCount',
        method: 'get',
    })
}

export function selectStateAmount(param) {
    return request({
        url: moduleUrl+'/select/selectStateAmount?type='+param,
        method: 'get',
    })
}

export function selectMachineWarn() {
    return request({
        url: moduleUrl+'/select/selectMachineWarn',
        method: 'get',
    })
}


/**
 * 分页查询劳务人员统计
 * @param params
 * @returns {AxiosPromise}
 */
// export function getPageTtQualitysafeManager(params) {
//     return request({
//         url: moduleUrl+'/select/list',
//         method: 'get',
//         params
//     })
// }
export function getPageTtQualitysafeManager(params) {   // 用的手机端的接口
    return request({
        url:'/wxgc/plus/tt-qualitysafe-manager/selectQualitySafe',
        method: 'get',
        params
    })
}

export function selectQualitySafe(params) {
    return request({
        url: moduleUrl+'/selectByManagerId',
        method: 'get',
        params
    })
}


/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addTtQualitysafeManager(data) {
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
export function updateTtQualitysafeManager(data) {
    return request({
        url: moduleUrl+'/userupdate',
        method: 'put',
        data
    })
}


/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTtQualitysafeManager(id) {
    return request({
        url: moduleUrl+'/delete/'+id,
        method: 'delete'
    })
}


//  整改单 ，查询
export function zhanggaiDanBianHao(params) {
    return request({
        url: "/wxgc/plus/word/test2",
        method: 'get',
        params
    })
}

//问题分类的 获取
export function selectProblemList(data) {
    return request({
        url: `/wxgc/plus/tt-qualitysafe-type/select/allType?type=${data}`,
        method: 'get',
    })
}

// h5 页面的 整改人，复查人，页面接口，
export function getPerson(params){
	return request({
		url:'/wxgc/wxresult/sysUser/select/list',
        method: 'get',
		params
	})
}

//  使用app的提交接口

export function addItem(data){

	data.hasDel = 0
	return request({
		url:'/wxgc/plus/tt-qualitysafe-manager/addQualitySafe',
		method:'post',
		data
	})
}
// 审批流程
export function updataItem(data){

	data.hasDel = 0
	return request({
		url:'/wxgc/plus/tt-qualitysafe-manager/userUpdate',
		method:'post',
		data
	})
}
// //问题分类添加
export function problemAdd(data){
	return request({
		url:'/wxgc-base-system/wxgc/plus/tt-qualitysafe-type/save',
		method:'post',
		data
	})
}

// //问题分类列表
export function problemList(data){
	return request({
		url:'/wxgc-base-system/wxgc/plus/tt-qualitysafe-type/select/all',
		method:'get',
		data
	})
}


// 修改回复的状态 已回复，未回复
export function changeReplyState(data) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/update',
        method: 'put',
        data
    })
}
