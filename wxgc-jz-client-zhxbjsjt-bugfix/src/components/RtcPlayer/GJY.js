/**
 * 生成gjy uuid
 * @returns {string}
 */
function createGJY () {
  let s = []
  let hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

/**
 * 创建功能GJY，默认状态为0
 * @param name 功能名称
 * @param params 自定义参数
 * @returns {{gjy: *, body: {type: string, params: {name: *, params: (*|{})}, status: number}}}
 */
function createFunctionOption (name, params) {
  return {
    gjy: createGJY(),
    body: {
      type: 'function',
      status: 0,
      params: {
        name: name,
        params: params || {}
      }
    }
  }
}

/**
 * 创建命令GJY，默认状态为1
 * @param cmd
 * @returns {{gjy: *, body: {type: string, params: *, status: number}}}
 */
function createCMDOption (cmd) {
  return {
    gjy: createGJY(),
    body: {
      type: 'cmd',
      status: 1,
      params: cmd
    }
  }
}

/**
 * 创建数据GJY，默认状态为1
 * @param name 数据名称
 * @param data  数据内容
 * @returns {{gjy: *, body: {type: string, params: *, status: number}}}
 */
function createDataOption (name, data) {
  return {
    gjy: createGJY(),
    body: {
      type: 'data',
      status: 1,
      params: {
        name: name,
        data: data
      }
    }
  }
}

let GJY = {
  createGJY,
  createCMDOption,
  createFunctionOption,
  createDataOption
}

export default GJY
