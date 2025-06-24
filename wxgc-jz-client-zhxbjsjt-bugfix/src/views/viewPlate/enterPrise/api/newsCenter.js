import request from '@/utils/request'

//当前模块的基本URL
// let moduleUrl="/wxgc/plus/sys-project";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */

//接口描述：视频监控接口(GET)
export function newsList(params) {
    return request({
        url: '/wxgc/plus/tt_news_center/select/selectTtNewsCenterByProjectChildrenIds',
        method: 'get',
        params
    })
}

// 新闻中心上传文件
export function addTtNewsCenter(data) {
    return request({
        url: '/wxgc/plus/tt_news_center/save',
        method: 'post',
        data
    })
}
// 新闻中心上传文件
export function editNewsCenter(params) {
    return request({
        url: '/wxgc/plus/tt_news_center/update',
        method: 'put',
        params
    })
}
// 企业平台，通知公告
export function newsList2(params) {
    return request({
        url: '/wxgc/plus/tt-upload-file/select/list',
        method: 'get',
        params
    })
}
// 企业平台，通知公告新
export function newsListnew(params) {
    return request({
        url: '/wxgc/plus/tt-upload-file/select/notice',
        method: 'get',
        params
    })
}



// 中台的 新闻中心的回复确定按钮
export function addTtNewsCenterHuiFu(data) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-news-reply/save',
        method: 'post',
        data
    })
}




//中台的 新闻中心的    查看回复   查看list （）
export function getPageHuiFui(params) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-news-reply/select/list',
        method: 'get',
        params
    })
}

//中台的 新闻中心的    查看回复   查看list 删除
export function lookHuiFuTableListDelete(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt-news-reply/delete/'+id,
        method: 'DELETE',
    })
}

//企业端 新闻中心的    删除
export function deletePageHuiFui(id) {
    return request({
        url: '/wxgc-base-system/wxgc/plus/tt_news_center/delete/'+id,
        method: 'DELETE',
    })
}