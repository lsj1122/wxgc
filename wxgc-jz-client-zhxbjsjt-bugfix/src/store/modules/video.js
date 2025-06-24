const state = {
    videoLength: null,
    name:null,
    isActive:2,
    playNumber:'',
    videoList:null,
  }
  
  const mutations = {
    chVideo: (state, log) => {
      state.videoLength =log
    },
    getName: (state, log) => {
      state.name =log
    },
    playNumber:(state, log) => {
      state.playNumber =log
    },
    getVideoListC:(state, log) => {
      state.videoList =log
    },
  }
  
  const actions = {
    changeVideoLength({ commit }, log) {
      commit('chVideo', log)
    },
    getCloseName({ commit }, log) {
      commit('getName', log)
    },
    changePlayNumber({ commit }, log) {
      commit('playNumber', log)
    },
    getVideoList({ commit }, log) {
      commit('getVideoListC', log)
    },
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }