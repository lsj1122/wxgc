/**
 * 秘钥存储的store
 * @author JINGE
 */
import {getRsaPublicKey} from '@/api/RSA'
import {Message} from "element-ui";

const state = {
  publicSecretKey: null
}

const mutations = {
  SET_PUBLIC_SECRET_KEY: (state, value) => {
    state.publicSecretKey=value;
  },
  CLEAR_PUBLIC_SECRET_KEY: (state) => {
    state.publicSecretKey=null;
  }
}

const actions = {
  setPublicSecretKey({ commit }, value) {
    commit('SET_PUBLIC_SECRET_KEY', value)
  },
  clearPublicSecretKey({ commit }) {
    commit('CLEAR_PUBLIC_SECRET_KEY')
  },
  loadPublicKey({ commit }){
    return new Promise((resolve, reject) => {
      getRsaPublicKey().then(WxgcResult=>{
        if(WxgcResult.code=="success"){
          commit('SET_PUBLIC_SECRET_KEY', WxgcResult.data)
          resolve()
        }else{
          /*Message({
            message: WxgcResult.msg || 'Error',
            type: 'error',
            duration: 2 * 1000
          })*/
          reject();
        }
      }).catch(err=>{
        console.error("======>无法获取RSA公钥!")
        reject();
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
