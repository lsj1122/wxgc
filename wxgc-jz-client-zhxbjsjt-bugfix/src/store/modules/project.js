//导入cookies操作
import {
  getProjectId,
  setProjectId,
  setProjectName,
  getProjectName,
  removeProjectName,
  removeProjectId,
  setProjectChildrenIds,
  removeProjectChildrenIds,
  getProjectChildrenIds
} from '@/utils/project'
import {getAllSysProject}  from  '@views/sysproject/api/sysproject.js'
import {setToken} from "@/utils/auth";
/**
 * 当前选择使用的项目ID
 * @type {{projectId: string}}
 */
const state = {
  projectId: getProjectId(), //默认从cookie中取项目ID
  projectData:[], //项目的数据
  projectName:getProjectName(),//项目名称
  projectChildrenIds:getProjectChildrenIds(),//选中节点的所有子节点ID
}

const mutations = {
  //设置选中的项目主键
  SET_PROJECT_ID: (state, projectId) => {
    state.projectId=projectId;
  },
  SET_PROJECT_NAME: (state, projectName) => {
    state.projectName=projectName;
  },
  //清楚选中的项目主键
  CLEAR_PROJECT_ID: (state) => {
    state.projectId="";
    state.projectName="";
  },
  //设置项目数据
  SET_PROJECT_DATA: (state, projectData) => {
    state.projectData=projectData;
  },
  //清空项目数据
  CLEAR_PROJECT_DATA: (state) => {
    state.projectData.length = 0;
  },
  //设置选中的项目子节点主键
  SET_PROJECT_CHILDREN_IDS: (state, projectChildrenIds) => {
    state.projectChildrenIds=projectChildrenIds;
  },
  //清除选中的项目子节点主键
  CLEAR_PROJECT_CHILDREN_IDS: (state, projectChildrenIds) => {
    state.projectChildrenIds.length = 0;
  },
}

const actions = {
  //设置选中的项目主键
  setProjectId({ commit }, projectId) {
    commit('SET_PROJECT_ID', projectId)
    setProjectId(projectId)
  },
  setProjectName({ commit }, projectName) {
    commit('SET_PROJECT_NAME', projectName)
    setProjectName(projectName)
  },
  setProjectChildrenIds({ commit }, projectChildrenIds) {
    commit('SET_PROJECT_CHILDREN_IDS', projectChildrenIds)
    setProjectChildrenIds(projectChildrenIds)
  },
  //清楚选中的项目主键
  clearProjectId({ commit }) {
    commit('CLEAR_PROJECT_ID')
    commit('CLEAR_PROJECT_CHILDREN_IDS')
    removeProjectId()
    removeProjectName()
    removeProjectChildrenIds()
  },
  //加载项目数据
  loadProjectData({ commit },) {
   return  new Promise((resolve, reject) => {
      getAllSysProject({isNode:true}).then(res => {
        if (res.code == "success") {
          commit('SET_PROJECT_DATA', res.data)
          resolve()
        }else{
          reject(res.msg)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
