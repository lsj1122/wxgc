import fetch from '../../utils/request'

export function getList(data) {
    return fetch({
        url: `/api/system/car/selectCarPost?page=${data.page}&size=${data.size}`,
        method: 'post',
        data: data.data
    })
} 