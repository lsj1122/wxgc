import fetch from '../../utils/request'

export function getTowScrollData() {
    return fetch({
        url: '/api/machine/machine-tj/getTjScrollData',
        method: 'get',
        params:{}
    })
}

export function getTowStatistics() {
    return fetch({
        url: '/api/machine/machine-tj/getTjStatisticsData',
        method: 'get',
        params:{}
    })
}
export function selectOneTjWorkData(params) {
    return fetch({
        url: '/api/thing/tj/selectOneTjWorkData',
        method: 'get',
        params:params
    })
}

export function getTowDetail(tdId) {
    return fetch({
        url: '/api/machine/machine-tj/getTjBaseData',
        method: 'get',
        params: {
            deviceNo:tdId
        }
    })
}

export function queryTj(params) {
    return fetch({
        url: '/api/thing/tj/selectToTjWorkData',
        method: 'get',
        params
    })
}
export function selectliju(params) {
    return fetch({
        url: '/api/thing/tj/selectliju',
        method: 'get',
        params
    })
}
export function selectzaizhong(params) {
    return fetch({
        url: '/api/thing/tj/selectzaizhong',
        method: 'get',
        params
    })
}
