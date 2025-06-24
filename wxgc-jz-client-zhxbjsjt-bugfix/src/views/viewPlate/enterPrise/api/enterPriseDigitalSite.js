import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */


//接口描述：数字工地-现场设备统计(GET)

 export function equipmentOne(params) {
    return request({
        url: '/wxgc/plus/tt-tj/select/selectEquipmentMonthByChild',
        method: 'get',
        params
    })
}
export function equipmentTwo(params) {
    return request({
        url: '/wxgc/plus/tt-tj/select/selectCompareByChild',
        method: 'get',
        params
    })
}

//项目告警次数统计
export function alarStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-xlpt/select/selectProWarnByChild',
        method: 'get',
        params
    })
}
//数字工地-设备预警告警统计
export function equipmentStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-xlpt/select/selectMachineByChild',
        method: 'get',
        params
    })
}

//数字工地-设备进出场统计
export function equipmentOutTongji(params) {
    return request({
        url: 'wxgc/plus/tt-td/select/selectMachineByChild',
        method: 'get',
        params
    })
}

//企业级-数字工地-告警详情
export function alarmTongji(params) {
    return request({
        url: 'wxgc/plus/tt-qualitysafe-manager/select/selectMachineWarnByChild',
        method: 'get',
        params
    })
}
//实时空气质量下拉选择切换
export function selectAir(params) {
    return request({
        url: 'wxgc/plus/ycjc-work-data/select/selectYcjcDataByChild',
        method: 'get',
        params
    })
}