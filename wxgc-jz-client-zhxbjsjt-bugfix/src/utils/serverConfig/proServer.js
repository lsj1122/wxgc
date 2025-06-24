
// 生产环境服务端地址配置

// web服务地址
const webServer = 'localhost'
// web api地址
const apiBaseUrl = 'http://' + webServer + ':8080'
// 信令websocket地址
const signalWSUrl = 'ws://' + webServer + ':8099'

module.exports = {
  webServer, apiBaseUrl, signalWSUrl
}
