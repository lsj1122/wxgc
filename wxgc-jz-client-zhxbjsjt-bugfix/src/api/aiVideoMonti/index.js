import fetch from '../../utils/request';

export function getList(data) {
    return fetch({
        url: `/api/machine/machine-video/selectAiAlarmData?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data || {}
    })
}


//面板  AI视频监控

export function getVideoList(data) {   //抓拍记录列表
    return fetch({
        url: `/api/thing/ai/selectPage?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data
    })
}

export function getAiStatic() {   // ai统计
    return fetch({
        url: `/api/thing/ai/select1`,
        method: 'get',
    })
}

export function getWarning() {  //  告警类型分析和抓拍记录统计
    return fetch({
        url: `/api/thing/ai/select2`,
        method: 'get',
    })
}

export function getViolations() {  //违规记录
    return fetch({
        url: `/api/thing/ai/select4`,
        method: 'get',
    })
}