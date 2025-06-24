import player from './app'
// import { uploadGJY } from '../../api/gjyAPI'

function sendMsg (msg) {
  console.log('++++++++++++发送数据+++++++++++++')
  console.log(msg)
  console.log('+++++++++++++++++++++++++++++++++')
  player.sendMSG(msg)
  return msg.gjy
}

function sendMessages (messages, time) {
  if (!messages || time < 0) {
    return
  }
  setInterval(function () {
    let msg = messages.shift()
    if (msg) {
      sendMsg(msg)
    }
  }, 1000)
}

/**
 * 消息上传到服务端
 * @param msg
 */

let RTCMsgSender = {
  sendMsg,
  sendMessages
}

export default RTCMsgSender
