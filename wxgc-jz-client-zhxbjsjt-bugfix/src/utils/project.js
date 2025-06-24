import Cookies from 'js-cookie'

//工程项目的cookieKEy
const ProjectKey = 'Project_Id'

//工程项目的cookieKEy
const ProjectChildrenKey = 'Project_Children_Id'

export function setProjectName(name) {  //设置项目名称
  return Cookies.set('Project_Name', name)
}

export function getProjectName() { // 获取项目名称
  return Cookies.get('Project_Name')
}

export function removeProjectName() {  //删除项目名称
  return Cookies.remove('Project_Name')
}

/**
 * 获取cookie中的项目ID
 */
export function getProjectId() {
  return Cookies.get(ProjectKey)
}

/**
 * 设置cookie中的项目ID
 * @param projectId
 * @returns {*}
 */
export function setProjectId(projectId) {
  return Cookies.set(ProjectKey, projectId)
}

/**
 * 删除cookie中的项目ID
 * @returns {*}
 */
export function removeProjectId() {
  return Cookies.remove(ProjectKey)
}


/**
 * 获取cookie中的项目子节点ID
 */
export function getProjectChildrenIds() {
  let idStr = Cookies.get(ProjectChildrenKey);

  if (idStr == null || typeof idStr === "undefined") {
    return [];
  }
  return JSON.parse(idStr)
}

/**
 * 设置cookie中的项目子节点ID
 * @returns {*}
 * @param childrenIds
 */
export function setProjectChildrenIds(childrenIds) {
  if (childrenIds == null || typeof childrenIds === "undefined" || childrenIds.length === 0) {
    return Cookies.set(ProjectChildrenKey, JSON.stringify([]))
  }
  return Cookies.set(ProjectChildrenKey, JSON.stringify(childrenIds))
}

/**
 * 删除cookie中的项目子节点ID
 * @returns {*}
 */
export function removeProjectChildrenIds() {
  return Cookies.remove(ProjectChildrenKey)
}


