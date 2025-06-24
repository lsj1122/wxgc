import fetch from '../../utils/request';



export function getList(data) {
    return fetch({
        url: `/api/qualitySafe/ss-safety-manager/selectManager?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data
    })
}

export function exportManager(params) {
    return fetch({
        url: '/api/qualitySafe/ss-safety-manager/exportManager',
        method: 'get',
        params
    })
}



