import request from '@/utils/request'


//接口描述：AI统计(GET)
export function aisum(params) {
    return request({
        url: '/wxgc/plus/tt-video/select/selecAIStatistics',
        method: 'get',
        params
    })
}
// 项目违规统计
export function Violation(params) {
    return request({
        url: '/wxgc/plus/tt-video/select/selectProjectViolationStatistics',
        method: 'get',
        params
    })
}
// 抓拍记录统计
export function Capture(params) {
    return request({
        url: '/wxgc/plus/tt-video/select/selectCaptureRecordStatistics',
        method: 'get',
        params
    })
}