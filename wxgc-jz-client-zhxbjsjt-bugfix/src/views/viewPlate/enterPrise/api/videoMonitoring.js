import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */

//接口描述：企业-总览-视频监控接口(GET)
export function videoListInfo(params) {
    return request({
        url: 'wxgc/plus/tt-video/select/selectVideoByChild',
        method: 'get',
        params
    })
}
//接口描述：企业级-智能视频监控-AI统计(GET)
export function AiStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-video/select/selectCountAIByChild',
        method: 'get',
        params
    })
}
// 接口描述：企业级-智能视频监控-违规统计(GET)
export function violationsStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-video/select/selectCountViolateByChild',
        method: 'get',
        params
    })
}
// 接口描述：企业级-智能视频监控-抓拍记录统计(GET)
export function captureStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-video/select/selectCountCaptureByChild',
        method: 'get',
        params
    })
}

// 接口描述：企业级-智能视频监控-项目告警统计(GET)
export function alarmStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-video/select/selectCountAlarmByChild',
        method: 'get',
        params
    })
}
// 企业级-智能视频监控-项目告警统计-日期范围查询
export function alarmDateRange(params) {
    return request({
        url: 'wxgc/plus/tt-video/select/selectCountAlarmDateRangeByChild',
        method: 'get',
        params
    })
}
