import fetch from '../../utils/request';

export function getList(data) {
    return fetch({
        url: `/api/qualitySafe/ss-safety-manager/selectManager?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data
    })
}
export function getDetail(data) {
    return fetch({
        url: '/api/qualitySafe/ss-safety-manager/selectSafeCount',
        method: 'post',
        data
    })
}

export function addZSK(data) {
    return fetch({
        url: '/api/qualitySafe/ss-knowledge-base',
        method: 'post',
        data
    });
}

export function getZSKlist(params) {
    return fetch({
        url: '/api/qualitySafe/ss-knowledge-base/selectAllKnowledgeBase',
        method: 'get',
        params
    });
}

export function delzsk(id) {
    return fetch({
        url: `/api/qualitySafe/ss-knowledge-base/${id}`,
        method: 'delete'
    });
}

export function delzskFile(id) {
    return fetch({
        url: `/api/qualitySafe/ss-knowledge-base-file/${id}`,
        method: 'delete'
    });
}

export function getfileList(params) {
    return fetch({
        url: `/api/qualitySafe/ss-knowledge-base-file/selectPageData`,
        method: 'get',
        params
    });
}

export function addUploadFile(data) {
    return fetch({
        url: '/api/qualitySafe/ss-knowledge-base-file/save',
        method: 'post',
        data
    });
}
export function exportZGD(id) {
    return fetch({
        url: '/api/qualitySafe/ss-safety-manager/exportExcel?managerId='+id,
        method: 'get',
    });
}
export function exportAll(list) {
    return fetch({
        url: '/api/qualitySafe/ss-safety-manager/exportAll?managerId='+list,
        method: 'get',
    });
}

export function delSongj(id) {
    return fetch({
        url: '/api/qualitySafe/ss-check-date/deleteId?id=' + id,
        method: 'delete'
    })
}
 
export function getSongj() {
    return fetch({
        url: '/api/qualitySafe/ss-check-date/CheckDateList',
        method: 'get'
    })
}

export function editSongj(data) {
    return fetch({
        url: '/api/qualitySafe/ss-check-date/checkUpdate',
        method: 'post',
        data
    })
}

