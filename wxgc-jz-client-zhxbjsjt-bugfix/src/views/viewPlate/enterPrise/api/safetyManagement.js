import request from '@/utils/request'

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
//接口描述：企业-安全管理-安全问题统计-按项目(GET)
export function safetyProject(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualitySafeManagerChild?flag=' + params,
        method: 'get',
    })
}
// 企业安全优秀项目
export function safetyexcellentProject(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualitySafeMangerExcellent',
        method: 'get',
        params
    })
}




//接口描述：企业-安全管理-安全问题统计-所有项目(GET)
export function sumsafetyProject(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectProjectAlarmStatistics?flag=',
        method: 'get',
        params
    })
}

//接口描述：企业-安全管理-安全问题统计-按类型(GET)
export function safetyTypes(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/selece/selectQualitysafeManagerByInfluenceLevel?flag=' + params,
        method: 'get',
    })
}
//接口描述:企业级-安全管理-安全问题统计-按照时间(GET)
export function safetyTimes(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualitySafeManagerTime?flag=' + params,
        method: 'get',
    })
}
// 接口描述: 企业级-安全管理-优秀安全项目(GET)
export function outstandingProject(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualitySafeMangerExcellent',
        method: 'get',
        params
    })
}
// 接口描述: 企业级-安全管理-优秀安全项目(GET)
export function outstandingProjectnew(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/goodProject',
        method: 'get',
        params
    })
}



// 接口描述：企业级-安全管理-安全隐患整改-(GET)
export function SafetyMeasures(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualitySafeManagerStatusChild?flag=' + params,
        method: 'get',
    })
}
// 企业级-安全管理-按照隐患整改-按时间(GET)
export function SafeManagerTime(params) {
    return request({
        url: 'wxgc/plus/tt-qualitysafe-manager/select/selectQualitysafeManagerTimeByChild?flag=' + params,
        method: 'get',
    })
}
// 企业级-安全管理-机械设备统计(GET)
export function machineryEquipmentStatistics(params) {
    return request({
        url: '/wxgc/plus/tt-xlpt/select/selectMachineSumByChild',
        method: 'get',
        params
    })
}
// 安全问题统计详情(GET)
export function pageSelectQualitysafeManagerByDateByName(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/pageSelectQualitysafeManagerByDateByName',
        method: 'get',
        params
    })
}
// 7天安全问题统计详情(GET)
export function securityissues(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectStatisticsOfSafetyProblems',
        method: 'get',
        params
    })
}

// 安全隐患整改详情(GET)
export function QualitysafeManagerStatus(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/pageQualitysafeManagerStatus',
        method: 'get',
        params
    })
}
// 安全教育统计(GET)
export function selectSafetyDisclosureByDate(params) {
    return request({
        url: 'wxgc/plus/tt-safety-disclosure/select/selectSafetyDisclosureByDate',
        method: 'get',
        params
    })
}
// 质量问题整改(GET)
export function quailty(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectRectificationOfQualityProblems',
        method: 'get',
        params
    })
}
// 质量检查(GET)
export function quailtyprom(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualityTesting',
        method: 'get',
        params
    })
}

// 技术交底文件(GET)
export function quailtydesli(params) {
    return request({
        url: '/wxgc/plus/tt-upload-file/select/enterprise/all',
        method: 'get',
        params
    })
}

// 质量知识库(GET)
export function quailtykhow(params) {
    return request({
        url: '/wxgc/plus/tt-knowledge-base-file/select/enterprise/all',
        method: 'get',
        params
    })
}


// 获取喷淋系统项目名称(GET)
export function sprayproname(params) {
    return request({
        url: '/wxgc/plus/tt-spray/select/selectHasSprayProjectName',
        method: 'get',
        params
    })
}


// 获取喷淋系统项目表格(GET)
export function sprayname(params) {
    return request({
        url: '/wxgc/plus/tt-spray/select/selectSprayManagement',
        method: 'get',
        params
    })
}