import fetch from '../../utils/request'

export function getjgData(params) {
    return fetch({
        url: '/api/machine/machine-tj/selectTjChartData',
        method: 'get',
        params
    })    
} 

export function getgzjlData(params) {
    return fetch({
        url: '/api/machine/machine-tj/selectTjWorkChartData',
        method: 'get',
        params
    })
} 