import {login, logout, getInfo, refreshToken} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'

import {removeProjectId, removeProjectChildrenIds} from '@/utils/project'
import router, {resetRouter} from '@/router'
import {MessageBox, Message} from 'element-ui'

let tt;//续签token的计时器

const state = {
  token: getToken(),
  realName: '',
  name: '',
  id: '',
  avatar: '',
  userType: '',
  introduction: '',
  roles: [],
  rolesCn: [],
  email: '',
  rolesIds: [], //用户权限的id,
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROULEIDS: (state, rolesIds) => {
    state.rolesIds = rolesIds
  },
  SET_NAMErealName: (state, realName) => {
    state.realName = realName

  },
  SET_NAMEemail: (state, email) => {
    state.email = email

  },

  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERTYPE: (state, avatar) => {
    state.userType = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLES_CN: (state, rolesCN) => {
    state.rolesCn = rolesCN
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password, verifyCode, timeStamp} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password, verifyCode: verifyCode, timeStamp}).then(response => {
        const WxgcResult = response
        if (WxgcResult.code == "success") {
          commit('SET_TOKEN', WxgcResult.data)
          setToken(WxgcResult.data)
          resolve()
        } else {
          Message({
            message: WxgcResult.msg || 'Error',
            type: 'error',
            duration: 2 * 1000
          })
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.data;
        console.warn("用户信息：", data)
        if (!data) {
          reject('获取用户身份信息失败,请尝试更换用户登录。')
        }

        let roleStr = [];
        let roleCnStr = [];
        for (let obj of data.roles) {
          roleStr.push(obj.name);
          roleCnStr.push(obj.cnName);
        }
        const roles = roleStr;
        const rolesCn = roleCnStr;
        const name = data.username;
        const rolesIds = data.rolesIds
        const id = data.id
        const avatar = data.avatar;
        const userType = data.userType;
        const introduction = '';
        // 名字
        const realName11 = data.realname;
        // email
        const realemail = data.email;

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('当前账户没有任何操作权限。请联系管理员授予角色后在登录')
        }
        commit('SET_ROLES_CN', rolesCn)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_NAMErealName', realName11)
        commit('SET_NAMEemail', realemail)
        commit('SET_AVATAR', avatar)
        commit('SET_USERTYPE', userType)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_ID', id)
        commit('SET_ROULEIDS', rolesIds)
        resolve(state)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state, dispatch}) {
    if (tt != null) {
      clearInterval(tt)
    }
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeProjectId()
        removeProjectChildrenIds()
        // 或者直接打开新页面 通过刷新到登录页面以关闭websocket
        router.push('/login');
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, {root: true})
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  //续签token
  refreshToken({commit}) {
    let errorTime = 0;
    tt = setInterval(() => {
      refreshToken(getToken())
        .then(res => {
          if (res.code == "success") {
            commit('SET_TOKEN', res.data)
            setToken(res.data)
            console.log("=====>token续签成功")
          } else {
            console.log(tt)
            clearInterval(tt);
            console.log("=====>token续签失败:" + res.msg)
            dispatch('tagsView/delAllViews', null, {root: true})
          }
        }).catch(error => {
        errorTime++
        if (errorTime > 3) {
          clearInterval(tt);
          return;
        }
        console.log("=====>token续签失败:" + error)
      })
    }, 1000 * 60) // `
  },
  // dynamically modify permissions
  async changeRoles({commit, dispatch}, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {roles} = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {root: true})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
