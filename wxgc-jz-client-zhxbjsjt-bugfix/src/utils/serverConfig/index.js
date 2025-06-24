
// 服务端地址配置文件

const devServer = require('./devServer')
const proServer = require('./proServer')
console.log(process.env.NODE_ENV)
const serverConfig = process.env.NODE_ENV === 'development' ? devServer : proServer

module.exports = serverConfig
