import fetch from '../../utils/request'

export function getList(data) {
    return fetch({
        url: `/api/system/dict/selectDictPost?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data
    })
}

export function deldict(str) {
    return fetch({
        url: `/api/system/dict/delete?ids=${str}`,
        method: 'post',
        data:{} 
    })
}

export function addDic(data) { 
    return fetch({
        url: '/api/system/dict', 
        method: 'post',
        data
    })
}

export function editDic(data) {
    return fetch({
        url: '/api/system/dict',
        method: 'put',
        data
    })
}

export function selectCode(data) {
    return fetch({
        url: `/api/system/dict/selectCode?dictType=${data}`,
        method: 'get',
    })
}