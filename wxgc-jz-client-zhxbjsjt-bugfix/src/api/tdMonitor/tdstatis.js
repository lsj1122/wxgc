import fetch from '../../utils/request'

export function getjgData(params) {
    return fetch({
        url: '/api/machine/machine-td/selectTdChartData',
        method: 'get',
        params
    })    
} 

export function getgzjlData(params) {
    return fetch({
        url: '/api/machine/machine-td/selectTdWorkChartData',
        method: 'get',
        params
    })
} 