/**
 * @auther JIN_GE
 * @create 2021-04-01
 * @describe AIP接口
 */

import request from "@/utils/request";
//当前模块的基本URL
let moduleUrl = "/wxgc/plus/tt-unload";

/**
 * 查询所有数据
 * @returns {AxiosPromise}
 */
export function getAllXlptWorkData() {
  return request({
    url: moduleUrl + "/select/all",
    method: "get",
  });
}

/**
 * 分页查询
 * @param params  
 * @returns {AxiosPromise}
 */
export function getPageXlptWorkData(params) {
  return request({
    url: moduleUrl + "/select/list",
    method: "get",
    params,
  });
}

/**
 * 增加
 * @param data
 * @returns {AxiosPromise}
 */
export function addXlptWorkData(data) {
  return request({
    url: moduleUrl + "/save",
    method: "post",
    data,
  });
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateXlptWorkData(data) {
  return request({
    url: moduleUrl + "/update",
    method: "put",
    data,
  });
}

/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteXlptWorkData(id) {
  return request({
    url: moduleUrl + "/delete/" + id,
    method: "delete",
  });
}
