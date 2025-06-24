import request from '@/utils/request'


/**
 * 生成代码
 * @param data
 * @returns {AxiosPromise}
 */
export function generator(data) {
  return request({
    url: '/online/generator',
    method: 'post',
    data,
    timeout:20000
  })
}

/**
 * 获取当前数据库的所有表的信息
 * @returns {AxiosPromise}
 */
export function allConnTableInfo() {
  return request({
    url: '/online/allConnTableInfo',
    method: 'get',
  })
}


/**
 * 获取当前所有的模块名称
 * @returns {AxiosPromise}
 */
export function allModuleName() {
  return request({
    url: '/online/allModuleName',
    method: 'get',
  })
}



