
import GJY from './GJY'
import RTCMsgSender from './RTCMsgSender'
import RTCMsgHandle from './RTCMsgHandle'
import { date } from 'quasar'

// 定时任务id
let interval
// 心跳间隔
const HEART_BEAT_TIME = 10000

// 心跳消息
let heartBeatGJY

/**
 * 开启心跳
 */
function startHeartBeat (store) {
  // 模拟数据
  setInterval(function () {
    store.commit('heartBeat/addHeartData', 0)
    store.commit('heartBeat/addHeartDate', date.formatDate(Date.now(), 'HH:mm:ss'))
  }, 1000)

  interval = setInterval(function () {
    if (heartBeatGJY && heartBeatGJY.body.status === 1) {
      console.log('未收到心跳信息')
    }
    heartBeatGJY = GJY.createDataOption('heart-beat')
    RTCMsgSender.sendMsg(heartBeatGJY)
    store.commit('heartBeat/addHeartData', JSON.stringify(heartBeatGJY).length)
    store.commit('heartBeat/addHeartDate', date.formatDate(Date.now(), 'HH:mm:ss'))
    RTCMsgHandle.addGJYListener(heartBeatGJY.gjy, heartBeatGJY.gjy, function (msg) {
      heartBeatGJY = msg
      let s = JSON.stringify(heartBeatGJY).length
      store.commit('heartBeat/addHeartData', s - s * 2)
      store.commit('heartBeat/addHeartDate', date.formatDate(Date.now(), 'HH:mm:ss'))
      RTCMsgHandle.removeGJYListener(heartBeatGJY.gjy, heartBeatGJY.gjy)
    })
  }, HEART_BEAT_TIME)
}

/**
 * 关闭心跳
 */
function stopHeartBeat () {
  if (interval) {
    clearInterval(interval)
  }
}

let HeartBeat = {
  startHeartBeat,
  stopHeartBeat
}

export default HeartBeat
