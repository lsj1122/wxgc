//动态路由菜单API
import request from "@/utils/request";

/**
 * 分页查询路由菜单数据 可以带搜索条件
 * @param params
 */
export function fetchRouterMenus(params) {
  return request({
    url: "/wxgc/plus/sysRouterMenu/select/list",
    method: "get",
    params: params,
  });
}

/**
 * 查询所有的一级路由菜单（包含素有子级）
 */
export function fetchOneLevelRouterMenu() {
  return request({
    url: "/wxgc/plus/sysRouterMenu/select/oneLevelRouterMenu",
    method: "get",
    timeout: 1000 * 60 * 5,
  });
}

/**
 * 查询所有路由菜单（不分子父级别）
 */
export function fetchAllLevelRouterMenu() {
  return request({
    url: "/wxgc/plus/sysRouterMenu/select/allLevelRouterMenu",
    method: "get",
  });
}

/**
 * 添加路由菜单
 */
export function addRouterMenu(data) {
  return request({
    url: "/wxgc/plus/sysRouterMenu/save",
    method: "post",
    data: data,
  });
}

/**
 * 修改路由菜单
 */
export function updateRouterMenu(data) {
  return request({
    url: "/wxgc/plus/sysRouterMenu/update",
    method: "post",
    data: data,
  });
}

/**
 * 删除路由菜单
 */
export function deleteRouterMenu(id) {
  return request({
    url: "/wxgc/plus/sysRouterMenu/delete/" + id,
    method: "get",
  });
}
