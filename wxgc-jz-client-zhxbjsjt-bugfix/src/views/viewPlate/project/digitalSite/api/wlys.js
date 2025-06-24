import request from '@/utils/request'

export function getNewWLinfo(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/bdcl-d/receive',
        method: 'get',
        params
    })
}
// getGeneral
export function getGeneral(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/bdcl-d/receiveCount',
        method: 'get',
        params
    })
}
 // 供货偏差
//getGongHUOinfo
export function getGongHUOinfo(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/bill/selectCount',
        method: 'get',
        params
    })
}

//getGongHUOinfoRight 供货偏差 右边
export function getGongHUOinfoRight(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/bill/selectGroupPercentage',
        method: 'get',
        params
    })
}
//getSHOULIAOINFO  收料情况分析
export function getSHOULIAOINFO(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/bdcl-d/selectSum',
        method: 'get',
        params
    })
}