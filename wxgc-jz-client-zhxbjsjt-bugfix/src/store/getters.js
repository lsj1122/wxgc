const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  bimfaceToken: state => state.bimface.bimfaceToken,
  avatar: state => state.user.avatar,
  userType: state => state.user.userType,
  name: state => state.user.name,
  userId: state => state.user.id,
  realName: state => state.user.realName,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  rolesCn: state => state.user.rolesCn,
  roleIds:state => state.user.rolesIds,
  permission_routes: state => state.permission.routes,
  myDbroutes:state => state.permission.myDbroutes,
  errorLogs: state => state.errorLog.logs,
  publicSecretKey: state => state.RSA.publicSecretKey,
  projectId: state => state.project.projectId,
  projectName: state => state.project.projectName,
  projectChildrenIds: state => state.project.projectChildrenIds,
  projectData:state => state.project.projectData,
  //获取全部的socket对象
  socketClients: state => state.websocket.socketClients,
  //获取指定的socket对象
  getSocketClient: (state) => {
    return (socketName) => {
      return state.websocket.socketClients.find((item) => item.name == socketName)
    }
  },
}
export default getters
