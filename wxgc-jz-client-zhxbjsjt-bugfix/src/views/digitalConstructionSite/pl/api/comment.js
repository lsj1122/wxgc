import request from '@/utils/request'
//addPL 增加操作喷淋设备管理
export function addPL(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-spray/save',
        method: 'post',
        data
    })
}
//getPagePL 基于IPage分页查询喷淋设备管理
export function getPagePL(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-spray/select/list',
        method: 'get',
        params
    })
}
// updatePL 修改操作喷淋设备管理
export function updatePL(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-spray/update',
        method: 'put',
        data
    })
}
//deletePL
export function deletePL(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-spray/delete/'+id,
        method: 'delete'
    })
}

//getPagePLData 基于IPage分页查询喷淋实时数据
export function getPagePLData(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/spray-work-data/select/list',
        method: 'get',
        params
    })
}

//upDataPL 喷淋设置
export function upDataPL(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/task/closeMachine',
        method: 'post',
        data
    })
}
