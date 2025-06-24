import request from '@/utils/request'

/**
 * 查询所有的路由
 */
export function getRoutes() {
  return request({
    url: '/wxgc/plus/sysRouterMenu/select/oneLevelRouterMenu',
    method: 'get',
    timeout:1000*60*5
  })
}

/**
 * 查询所有的角色
 */
export function getRoles() {
  return request({
    url: '/wxgc/wxresult/sysRole/select/allRole',
    method: 'get'
  })
}


/**
 * 查询所有的角色Tree
 */
export function getTreeRoles() {
  return request({
    url: '/wxgc/wxresult/sysRole/select/allTreeRole',
    method: 'get'
  })
}

/**
 * 查询注册所有的角色
 */
export function getRegisterRole() {
  return request({
    url: '/wxgc/wxresult/sysRole/select/registerRole',
    method: 'get'
  })
}

/**
 * 增加角色
 * @param data
 */
export function addRole(data) {
  return request({
    url: '/wxgc/wxresult/sysRole/save',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param id
 * @param data
 */
export function updateRole(data) {
  return request({
    url: `/wxgc/wxresult/sysRole/update`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/wxgc/wxresult/sysRole/delete/${id}`,
    method: 'get'
  })
}
