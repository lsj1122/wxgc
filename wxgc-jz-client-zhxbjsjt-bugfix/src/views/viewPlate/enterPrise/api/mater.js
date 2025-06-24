import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */

//接口描述: 接口描述: 企业-物料管理-本月收料统计(GET)
export function vehicise(params) {
    return request({
        url: '/wxgc/plus/weighbridgeWorkData/select/trainNoByTime',
        method: 'get',
        params
    })
}

//接口描述: 接口描述: 企业级-物料验收-本月收料单位统计(GET)
export function countvehicise(params) {
    return request({
        url: '/wxgc/plus/weighbridgeWorkData/select/countCompany',
        method: 'get',
        params
    })
}
//接口描述: 接口描述: 企业级-物料验收-本月收料单位统计(GET)
export function weightvehicise(params) {
    return request({
        url: '/wxgc/plus/weighbridgeWorkData/select/weighingStatistics',
        method: 'get',
        params
    })
}

//接口描述: 接口描述: 企业级-物料验收-本月材料重量统计(GET)
export function weightsumvehicise(params) {
    return request({
        url: '/wxgc/plus/weighbridgeWorkData/select/countWeight',
        method: 'get',
        params
    })
}

//接口描述: 接口描述: 企业级-物料验收-本月材料重量统计(GET)
export function weightdetailed(params) {
    return request({
        url: '/wxgc/plus/weighbridgeWorkData/select/detailed',
        method: 'get',
        params
    })
}