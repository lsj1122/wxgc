import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */


//接口描述: 接口描述: 企业-项目管理-项目状态百分比(GET)
export function getPercent(params) {
    return request({
        url: '/wxgc/plus/tt-project/select/selectProjectStatusByChild',
        method: 'get',
        params
    })
}

//接口描述: 企业-项目管理-项目进度(GET)
export function getProjectProgressByChild(params) {
    return request({
        url: '/wxgc/plus/tt-project/select/selectProjectProgressByChild',
        method: 'get',
        params
    })
}

//接口描述: 企业-项目管理-项目类型统计(GET)
// 2021.6.30 后端接口修改 flag必须携带 目前写死flag=1
export function getProjectTypeStatisticsByChild(params) {   
    return request({
        url: '/wxgc/plus/tt-project/select/selectProjectTypeStatisticsByChild?flag=1',
        method: 'get',
    })
}
//接口描述: 企业-项目管理-项目库(GET) flag 0 全部项目 1 在建项目 2 未开工项目 3 完工项目
export function projectLibrary(params) {
    return request({
        url: 'wxgc/plus/tt-project/select/selectProjectWarehouseChile?flag=' + params,
        method: 'get',
        params
    })
}

export function searchProject(params) {
    return request({
        url: '/wxgc/plus/tt-project/select/selectProjectProName',
        method: 'get',
        params
    })
}