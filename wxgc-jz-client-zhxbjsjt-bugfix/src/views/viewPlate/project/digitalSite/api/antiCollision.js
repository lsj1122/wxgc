import request from '@/utils/request'
export function selectAllInfoList(params) {
    return request({
        url: '/wxgc/plus/tt-tj/selectAllInfoList',
        method: 'get',
        params
    })
}