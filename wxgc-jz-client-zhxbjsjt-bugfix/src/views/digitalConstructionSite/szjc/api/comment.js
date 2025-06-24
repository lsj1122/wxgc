import request from '@/utils/request'

export function addSZ(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc/save',
        method: 'post',
        data
    })
}

export function getPageSZ(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc/select/list',
        method: 'get',
        params
    })
}


export function updateSZ(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc/update',
        method: 'put',
        data
    })
}

export function lookOneInfoSZ(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc-warning-threshold/select/one',
        method: 'get',
        params
    })
}

export function deleteSZ(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc/delete/'+id,
        method: 'delete'
    })
}



//getPageRealTimeSZ 基于IPage分页查询水质监测工作数据
export function getPageRealTimeSZ(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc-work-data/select/list',
        method: 'get',
        params
    })
}
//getPageAlarm 基于IPage分页查询水质监测设备阈值设置表
export function getPageAlarm(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-szjc-warning-data/select/list',
        method: 'get',
        params
    })
}

//waterQualityControl 水质监测阈值设置
export function waterQualityControl(data) {
    return request({
        url: '/wxgc-juzheng-iot/wxgc/juzheng/equipment/waterQualityControl',
        method: 'post',
        data
    })
}