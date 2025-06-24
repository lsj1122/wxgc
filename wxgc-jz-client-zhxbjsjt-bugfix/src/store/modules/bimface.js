import { getBimfaceToken, setBimfaceToken, removeBimfaceToken } from '@/utils/auth'

const state = {
  bimfaceToken: getBimfaceToken(),
}

const mutations = {
  SET_TOKEN: (state, bimfaceToken) => {
    state.bimfaceToken = bimfaceToken
    // console.log('重置token',bimfaceToken)  //Bearer cn-f333ea23-c7da-4e23-bba5-13d527b638f9
  },
} 

const actions = {
  //设置token 
  setToken({ commit }, bimfaceToken) {
    // console.log("设置token",bimfaceToken)
    commit('SET_TOKEN', bimfaceToken)
    setBimfaceToken(bimfaceToken)
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeBimfaceToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
