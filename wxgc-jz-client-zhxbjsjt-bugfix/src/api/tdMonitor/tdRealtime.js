import fetch from '../../utils/request'

export function getTdScrollData() {
    return fetch({
        url: '/api/machine/machine-td/selectTdScrollData',
        method: 'get',
        params:{}
    })
} 

export function getTdStatistics() {
    return fetch({
        url: '/api/machine/machine-td/getTdStatisticsData',
        method: 'get',
        params:{}
    })
}

export function getTdDetail(tdId) {
    return fetch({
        url: '/api/machine/machine-td/selectSsMachineTdByDeviceNo',
        method: 'get',
        params: { 
            deviceNo:tdId
        }
    })
}

export function queryTd(params) {
    return fetch({
        url: '/api/thing/td/selectToTdWorkData',
        method: 'get',
        params
    })
}