import fetch from '../../utils/request';

export function add(data) {
    return fetch({
        url: '/api/system/ss-notice',
        method: 'post',
        data: data
    });
}

export function update(data) {
    return fetch({
        url: '/api/system/ss-notice',
        method: 'put',
        data: data
    });
}

export function del(str) {
    return fetch({
        url: `/api/system/ss-notice/delete?ids=${str}`,
        method: 'get',
    })
}
//分页查询
export function selectPage(data) {
    return fetch({
        url: `/api/system/ss-notice/selectPage?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data
    });
}
//全部查询
export function selectAll() {
    return fetch({
        url: '/api/system/ss-notice/all',
        method: 'get',
    });
}