
//导入websocket工具组件
import { wxgcWebSocketExec, wxgcWebSocket, webSocketUtil } from "./websocket";
//消息框
import { MessageBox } from 'element-ui';
//存储对象
import store from '../store/index';
//路由
import router from '../router/index';



/**
 * =======================【和后台建立websocket连接】=======================================
 */

//第一种方式自定义各种事件回调（后续无法添加监听事件）

/*
export let  connWebsocket=function(){
  let self=connWebsocket;
  self.exit=false;
  //获得登录的用户名s
  let shortUrl="/"+store.state.user.name;
  let client= wxgcWebSocketExec(shortUrl,
    function() {
      console.log("=========>已与万像工程后台建立连接")
      //启动心跳
      if(!self.exit)
      webSocketUtil.startHeart(client)
      self.client=client;
      //存储到store中
      store.dispatch('websocket/addWebsocketClient',{socketName:"systemWebSocket",socketObj:client})
    },function(e) {
      if (typeof e.data === 'string') {
        let obj=JSON.parse(e.data);
        if(obj.type=="exit"){ //返回的信息是强制退出登录
            self.exit=true;
          client.close()
          MessageBox.alert(obj.data, '系统提示', {
            confirmButtonText: '确定',
            callback: action => {
              store.dispatch('user/logout')
              router.push(`/redirect/login`)
            }
          });
        }
      }
    },function(e) {
      console.log("=========>websocket 发生了错误:"+e)
    },function() {
      //断开连接后尝试重新连接
      if(!self.exit){
        console.log("------>尝试重新")
        webSocketUtil.reConnect(connWebsocket)
      }
    })

  //测试发送消息
  // setTimeout(()=>{
  //   //原始方式发送
  //   //client.send(JSON.stringify({type:'hello',data:[{'name':'zhangsan','age':33}]}))
  //   //万像消息体格式
  //   client.sendWxgcMsg('hello',[{'name':'zhangsan','age':33}],function(str) {
  //       console.log(str)
  //   })
  // },2000)

  return null;
}
*/
//第二种方式 ，这种方式可以无限制添加各种监听事件
export let connWebsocket = async function () {
  let self = connWebsocket;
  self.exit = false;
  //获得登录的用户名
  let shortUrl = "/" + store.state.user.name;
  let client = wxgcWebSocket(shortUrl);
  let existence = store.getters.socketClients.filter((item) => item.name == "systemWebSocket")

  //错误回调
  client.addErrorListeners((e) => {
    console.log("=========>websocket 发生了错误:" , e)
  });

  //关闭回调
  client.addCloseListeners(() => {
    //断开连接后尝试重新连接
    if (existence.length > 0 && !self.exit) {
      console.log("------>尝试重新")
      webSocketUtil.reConnect(connWebsocket)
    }
  });

  //建立连接
  client.addOpenListeners(() => {
    console.log("=========>已与万像工程后台建立连接")
    //启动心跳
    if (!self.exit)
      webSocketUtil.startHeart(client)
    self.client = client;
    //存储到store中
    store.dispatch('websocket/addWebsocketClient', { socketName: "systemWebSocket", socketObj: client })
  });

  //监听exit类型消息
  client.addMessageListeners("exit", (res) => {
    self.exit = true;
    // 清除store并跳转路由
    store.dispatch("user/logout");
    //清除store中指定的client
    store.dispatch('websocket/removeWebsocketClient', "systemWebSocket")
    MessageBox.alert(res.data||'该账户已超时或在其他地区登陆！', '系统提示', {
      confirmButtonText: '确定',
      callback: action => {}
    });
  });
  //获取指定的socket 对象
  //await store.dispatch('websocket/getWebsocketClient',"systemWebSocket")


  //测试发送消息
  // setTimeout(()=>{
  //   //原始方式发送
  //   //client.send(JSON.stringify({type:'hello',data:[{'name':'zhangsan','age':33}]}))
  //   //万像消息体格式
  //   client.sendWxgcMsg('hello',[{'name':'zhangsan','age':33}],function(str) {
  //       console.log(str)
  //   })
  // },2000)

  return null;
}

/**
 * =======================【你可以后面继续添加其他的websocket连接】=======================================
 * */


