// gjy监听器，key为gjy，value为(k:name v:listener)的键值对
let gjyListeners = new Map()
// 事件监听器，key为事件名称，value为(k:name v:listener)的键值对
let eventListeners = new Map()
// 监听所有消息
let listeners = new Map()

// 添加监听
function addListener (name, listener) {
  listeners.set(name, listener)
}

// 移除监听
function removeListener (name) {
  if (gjyListeners.has(name)) {
    gjyListeners.delete(name)
  }
}

// 添加gjy的监听
function addGJYListener (name, gjy, listener) {
  if (!gjyListeners.has(gjy)) {
    gjyListeners.set(gjy, new Map())
  }
  gjyListeners.get(gjy).set(name, listener)
}

// 移除gjy的监听
function removeGJYListener (name, gjy) {
  if (gjyListeners.has(gjy)) {
    gjyListeners.get(gjy).delete(name)
    if (gjyListeners.get(gjy).size <= 0) {
      gjyListeners.delete(gjy)
    }
  }
}

/**
 * 添加事件监听器
 * @param eventName 要监听的事件名
 * @param listenerName 监听器名称，移除监听器使用
 * @param listener 监听器
 */
function addEventListener (eventName, listenerName, listener) {
  if (!eventListeners.has(eventName)) {
    eventListeners.set(eventName, new Map())
  }
  eventListeners.get(eventName).set(listenerName, listener)
}
/**
 * 添加事件监听器
 * @param eventName 要监听的事件名
 * @param listenerName 监听器名称，移除监听器使用
 * @param listener 监听器
 */
function removeEventListener (eventName, listenerName) {
  if (!eventListeners.has(eventName)) {
    return
  }
  eventListeners.get(eventName).delete(listenerName)
}

// 处理所有消息
function handleMsg (msg) {
  if (msg) {
    console.log('------------收到数据-------------')
    console.log(msg)
    console.log('---------------------------------')
    msg = JSON.parse(msg)
    handleListeners(msg)
    handleGJYListeners(msg)
    if (msg.body && msg.body.type) {
      handleTypeListeners(msg)
    }
  }
}

// 根据消息类型处理分别处理监听器
function handleTypeListeners (msg) {
  switch (msg.body.type) {
    case 'event':// 事件消息
      handleClickListeners(msg)
      break
    case 'scene':// 场景切换消息
    default:
      break
  }
}

// 处理监听所有消息的监听器
function handleListeners (msg) {
  listeners.forEach(listener => {
    if (typeof listener === 'function') {
      listener(msg)
    }
  })
}

// 处理gjy监听事件
function handleGJYListeners (msg) {
  if (gjyListeners.has(msg.gjy)) {
    for (let listener of gjyListeners.get(msg.gjy).values()) {
      listener(msg)
    }
  }
}

// 处理点击监听事件
function handleClickListeners (msg) {
  let eventName = msg.body.params.name
  if (eventListeners.has(eventName)) {
    for (let listener of eventListeners.get(eventName).values()) {
      if (typeof listener === 'function') {
        listener(msg)
      }
    }
  }
}

let RTCMsgHandle = {
  addListener,
  removeListener,
  addEventListener,
  removeEventListener,
  addGJYListener,
  removeGJYListener,
  handleMsg
}

export default RTCMsgHandle
