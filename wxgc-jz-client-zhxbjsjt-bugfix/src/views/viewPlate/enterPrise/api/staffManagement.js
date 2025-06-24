import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */

//接口描述：用工统计(GET)
export function yongGong(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/selectCountPersonByChild',
        method: 'get',
        params
    })
}
export function BuildName(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/selectBuildNameList',
        method: 'get',
        params
    })
}

//出勤情况统计
export function chuqing(params) {
    return request({
        url: '/wxgc/plus/tt-attendance/select/selectAttendDetailByChild',
        method: 'get',
        params
    })
}
//出勤情况统计表格
export function chuqingtab(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/selectLaborStatisticsPage',
        method: 'get',
        params
    })
}
//出勤率分析
export function chuqingFenxi(params) {
    return request({
        url: '/wxgc/plus/tt-attendance/select/selectAttendRateByChild',
        method: 'get',
        params
    })
}

//工资发放情况
export function payOff(params) {
    return request({
        url: '/wxgc/plus/tt-person-wages/select/selectWageByChild2',
        method: 'get',
        params
    })
}

//工种分析
export function jobFenxi(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/selectWorkTypeCountByChild',
        method: 'get',
        params
    })
}

// 年龄分布
export function ageFenbu(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/selectAgeTypeCountByChild',
        method: 'get',
        params
    })
}