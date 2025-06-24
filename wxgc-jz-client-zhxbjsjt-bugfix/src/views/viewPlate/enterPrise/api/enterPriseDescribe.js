import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */


//接口描述：查询项目状态统计(GET)
 export function getProjectStatistics(params) {
    return request({
        url: '/wxgc/plus/tt-project/select/selectProjectChildrenIds',
        method: 'get',
        params
    })
}
//接口描述：企业-总览-物联网设备统计(GET)
export function InternetStatistics(params) {
    return request({
        url: '/wxgc/plus/tt-tj/select/selectStatisticsByChild',
        method: 'get',
        params
    })
}
//接口描述：企业-总览-安全问题统计(GET)
export function safetyStatistics(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectQualitysafeManagerByChild',
        method: 'get',
        params
    })
}

//环境监测统计
export function eMonitoring(params) {
    return request({
        url: '/wxgc/plus/ycjc-work-data/select/selectYcjcByChild2?flag=1',
        method: 'get',
    })
}


// 环境监测统计表格数据
export function eMonitoringing(params) {
    return request({
        url: '/wxgc/plus/ycjc-work-data/select/ycjcWorkDataPage',
        method: 'get',
        params
    })
}

//人员概况
export function personInfo(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/selectPersonByChild2?flag='+params,
        method: 'get',
    })
}
//出勤统计
export function attendance(params) {
    return request({
        url: '/wxgc/plus/tt-attendance/select/selectAttendByChild?flag='+params,
        method: 'get',
    })
}
//总览-AI抓拍(GET)

export function aiPicture(params) {
    return request({
        url: '/wxgc/plus/tt-ai-alarm-data/select/selectAIByChildNew?flag='+params,
        method: 'get',
    })
}

//报警实时记录(GET)
export function realTimeAlarm(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectMachineWarnByChild?flag='+params,
        method: 'get',
    })
}
//预警告警统计(GET)
export function earlyAlarm(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectWarnTongJi?flag='+params,
        method: 'get',
    })
}

// 总览页面的地球
export function mapInfo(params) {
    return request({
        url: '/wxgc/plus/sys-project/select/selectSysproject',
        method: 'get',
        params
    })
}

// 分页
export function getPageTtUploadFile(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/selectMachineWarnByChildPage',
        method: 'get',
        params
    })
}

// 企业级看板-项目管理-现场状态统计-告警项目百分比
export function alarmProjectPercentage(params) {
    return request({
        url: 'wxgc/plus/tt-project/select/selectProjectAlarm',
        method: 'get',
        params
    })
}
// 企业级看板-项目管理-现场状态统计-告警项目统计
export function alarmProjectStatistics(params) {
    return request({
        url: 'wxgc/plus/tt-project/select/selectProjectStatistics',
        method: 'get',
        params
    })
}
// 企业级看板-项目管理-现场状态统计-告警项目统计
export function deviceStatisticsTbale(params) {
    return request({
        url: '/wxgc/plus/tt-tj/select/selectStatisticsByType',
        method: 'get',
        params
    })
}

// 企业级看板-项目管理-安全问题统计-按日期
export function securityIssueStatisticsDate(params) {
    return request({
        url: '/wxgc/plus/tt-qualitysafe-manager/select/pageTtQualitysafe',
        method: 'get',
        params
    })
}


// 出勤统计弹框数据
export function chuqingInfo(params) {
    return request({
        url: '/wxgc/plus/tt-attendance/select/pageTtAttendanceByDateByPro',
        method: 'get',
        params
    })
}

// 出勤统计弹框数据
export function zaichePeeple(params) {
    return request({
        url: '/wxgc/plus/tt-person/select/personName',
        method: 'get',
        params
    })
}


//AI抓拍统计 弹出数据

export function aizhuapai(params) {
    return request({
        url: 'wxgc/plus/tt-ai-alarm-data/select/selectAlarmPageList',
        method: 'get',
        params
    })
}


//塔式起重机 查看接口
export function tashiList(params) {
    return request({
        url: '/wxgc/plus/tj-work-data/select/list',
        method: 'get',
        params
    })
}
//塔式起重机 查看接口2 升降
export function tashiList2(params) {
    return request({
        url: '/wxgc/plus/td-work-data/select/list',
        method: 'get',
        params
    })
}
//塔式起重机 查看接口2
export function tashiList3(params) {
    return request({
        url: '/wxgc/plus/ycjc-work-data/select/list',
        method: 'get',
        params
    })
}


// 得到 地图导航选择的项目名称

export function getMapInfoTitle(params) {
    return request({
        url: 'wxgc/plus/tt-project/select/selectSysProjectProName',
        method: 'get',
        params
    })
}
//获取项目名称
export function projectName(params) {
    return request({
        url: '/wxgc/plus/sys-project/select/proName',
        method: 'get',
        params
    })
}

// 获取所有接口
export function projectNameAll(params) {
    return request({
        url: '/wxgc/plus/sys-project/select/selectSysproject',
        method: 'get',
        params
    })
}

//获取告警详情数据
export function selectYcJcWorkDataByProNameData(params) {
    return request({
        url: '/wxgc/plus/ycjc-work-data/select/selectYcJcWorkDataByProNameData',
        method: 'get',
        params
    })
}

//晴雨表
export function selectAirLevelLimit30(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-weather/select/selectAirLevelLimit30',
        method: 'get',
        params
    })
}