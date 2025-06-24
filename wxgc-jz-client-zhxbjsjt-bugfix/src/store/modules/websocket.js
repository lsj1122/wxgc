const state = {
  socketClients: []
}

const mutations = {
  /**
   * 添加客户端
   * @param state
   * @param socketName socket客户端名称
   * @param socketObj socket客户端对象
   * @constructor
   */
  ADD_WEBSOCKET_CLIENT: (state, param) => {
    //socket对象信息 name:名称 socketObj:socket对象 listeners:[] 监听事件
    let objClient = { name: param.socketName, socketObj: param.socketObj };
    state.socketClients.push(objClient)
  },
  /**
   * 清除所有客户端
   * @param state
   * @constructor
   */
  CLEAR_WEBSOCKET_CLIENT: (state) => {
    if (state.socketClients.length > 0)
      for (let obj of state.socketClients) {
        if (obj.socketObj)
          if (obj.socketObj.readyState && obj.socketObj.readyState == 1) {
            obj.socketObj.close();
          }
      }
    state.socketClients.splice(0)
  },
  /**
   * 删除指定的客户端
   * @param state
   * @param name
   * @constructor
   */
  REMOVE_WEBSOCKET_CLIENT: (state, socketName) => {
    let socketClients = state.socketClients
    if (socketClients.length > 0) {
      for (let i = 0; i < socketClients.length; i++) {
        if (socketClients[i].name == socketName) {
          if (socketClients[i].socketObj.readyState == 1) {
            socketClients[i].socketObj.close();
          }
          socketClients.splice(i, 1)
        }
      }
    }
  }
}

const actions = {
  //增加
  addWebsocketClient({ commit }, param) {
    commit('ADD_WEBSOCKET_CLIENT', param)
  },
  //清除所有
  clearWebsocketClient({ commit }) {
    commit('CLEAR_WEBSOCKET_CLIENT')
  },
  //指定删除
  removeWebsocketClient({ commit }, socketName) {
    commit('REMOVE_WEBSOCKET_CLIENT', socketName)
  },
  //获取指定的socket对象
  getWebsocketClient({ commit }, socketName) {
    if (state.socketClients.length > 0)
      for (let obj of state.socketClients) {
        if (obj.name == socketName) {
          return obj
        }
      }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
