import axios from '@/utils/bimface-request'

// 获取bimface token
export function bimfaceToken(url, parameter, headers) {
    return axios({
        url: url,
        method: 'post',
        data: parameter,
        headers
    })
}

//post
export function bimfacePostAction(url, parameter) {
    return axios({
        url: url,
        method: 'post',
        data: parameter
    })
}

//post method= {post | put}
export function bimfaceHttpAction(url, parameter, method) {
    return axios({
        url: url,
        method: method,
        data: parameter
    })
}

//put
export function bimfacePutAction(url, parameter) {
    return axios({
        url: url,
        method: 'put',
        data: parameter
    })
}

//get
export function bimfaceGetAction(url, parameter) {
    return axios({
        url: url,
        method: 'get',
        params: parameter
    })
}

//deleteAction
export function bimfaceDeleteAction(url, parameter) {
    return axios({
        url: url,
        method: 'delete',
        params: parameter
    })
}