import fetch from '../../utils/request';

export function page(query) {
    return fetch({
        url: '/api/admin/auth-user/page',
        method: 'get',
        params: query
    });
}

export function getList(data) {
    return fetch({
        url: `/api/system/project/selectProjectPost?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data
    })
}
 
export function delPro(str) {
    return fetch({
        url: `/api/system/project/delete?ids=${str}`,
        method: 'post',
        data:{}
    })
}

export function addPro(data) {
    return fetch({
        url: '/api/system/project',
        method: 'post',
        data
    })
}

export function editPro(data) {
    return fetch({
        url: '/api/system/project/update',
        method: 'put',
        data
    })
}
export function editProject(data) {
    return fetch({
        url: '/api/system/project',
        method: 'put',
        data
    })
}

export function getoptions() {
    return fetch({
        url: '/api/system/project/selectDict',
        method: 'post',
        data:{}
    })
}
export function getProList(data) {
    return fetch({
        url: '/api/system/project/selectProjectList?data='+data,
        method: 'get'
    })
}

export function uploadFile(data) {
    return fetch({
        url: '/api/system/projectSpeed/importEvent/',
        method: 'post',
        data
    })
}

export function selectUnit() {
    return fetch({
        url: '/api/person/buildUnit/selectSsBuildUnit',
        method: 'get',
    })
}

export function updateUnit(data) {
    return fetch({
        url: `/api/person/buildUnit/updateSsBuildUnit?id=${data.id}&lable=${data.lable}`,
        method: 'get',
    })
}

export function addSsBuildUnit(data) {
    return fetch({
        url: `/api/person/buildUnit/addSsBuildUnit?parentId=${data.id}&lable=${data.lable}`,
        method: 'get',
    })
}

export function getData(data) {
    return fetch({
        url: `/api/machines/ss-material-equipment/selectProjectPost/selectData?page=${data.page}&size=${data.size}`,
        method: 'post',
        data
    })
}