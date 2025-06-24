import fetch from '../../utils/request'


export function addDeepTag(data) {
    return fetch({
        url: '/api/machine/deepTag',
        method: 'post',
        data
    });
}

export function getDeepTagList(params) {
    return fetch({
        url: `/api/machine/deepTag/getPageList`,
        method: 'get',
        params
    });
}

export function deleteDeepTag(id) {
    return fetch({
        url: '/api/machine/deepTag/'+id,
        method: 'DELETE'
    });
}

export function editDeepTag(data) {
    return fetch({
        url: '/api/machine/deepTag',
        method: 'put',
        data
    });
}

export function deleteDeepTagLocation(id) {
    return fetch({
        url: '/api/machine/deepTag/deleteLocation/'+id,
        method: 'DELETE'
    });
}

export function selectDeepFile(params) {
    return fetch({
        url: `/api/machine/deepFile/selectDeepFile`,
        method: 'get',
        params
    });
}

export function addDeepFile(data) {
    return fetch({
        url: '/api/machine/deepFile/saveFile',
        method: 'post',
        data
    });
}

export function getDeepAlertList(params) {
    return fetch({
        url: `/api/machine/deepAlert/getPageList`,
        method: 'get',
        params
    });
}