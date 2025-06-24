import request from '@/utils/request'


// 查询全部预警螺母数据
export function getAllYuJingLm() {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-warning-nut/select/all',
        method: 'get',
    })
}

// 增加预警螺母数据
export function addYuJingLm(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-warning-nut/save',
        method: 'post',
        data: params
    })
}


// 删除预警螺母数据
export function deleteYuJingLm(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-warning-nut/delete/' + params,
        method: 'get',
    })
}

//getYuJingLuoMoList  预警螺母监测预警

export function getYuJingLuoMoList() {
    return request({
        url: '/wxgc/plus/tt-warning-nut-data/select/selectToDayList',
        method: 'get',
       
    })
}

/// TaJiInfo 塔机的信息  
export function TaJiInfo(params) {
    return request({
        url: '/wxgc/plus/tt-tj/select/list?pageIndex=' +params.pageIndex +"&pageSize="+params.pageSize,
        method: 'get',
    })
}
