/**
 * 引用开源组件websocket
 */
const W3CWebSocket = require('websocket').w3cwebsocket;


/**
 * 工具组件
 */
let webSocketUtil={
  timeInterval: 3000, //心跳的间隔时间
  reConnInterval:3000,//尝试重新连接的时间间隔
  timeFunction:null,//心跳计时器函数
  excFunction:null,//创建连接的函数(一般就是调用者的函数)
  connectCount:-1, //尝试重新连接的次数 -1 表示一直尝试连接 ，您可以指定重连次数
  tempCount:0,//累计连接次数
  startHeart:function(client) { //执行心跳函数
    let self = this;
    if(self.timeFunction) self.timeFunction=clearInterval(self.timeFunction)
    //定时发送心跳请求
    self.timeFunction=setInterval(function() {
      if(client.readyState!=1){
        console.log('=======>连接失败，websocket心跳终止,请重新建立连接！');
        self.timeFunction=clearInterval(self.timeFunction)
        return;
      }
      //清除创建连接函数
      if(self.excFunction!=null){self.excFunction=null; self.tempCount=0;}
      console.log('=======>执行websocket心跳');
      let msg=stringifyWebSocketMsg("heart",{msg:"这是一个心跳请求"});
      client.send(msg)


    },self.timeInterval);
  },
  reConnect:function(excFunction) { //执行心跳 连接失败后尝试重新连接
    let self = this;
    self.excFunction=excFunction;
    setTimeout(()=>{
      if(self.excFunction!=null&& typeof(self.excFunction)==='function'){
        if(self.connectCount!=-1&&self.tempCount>=self.connectCount){  console.log("============>websocket重连次已达上限，将不在重新连接。"); return;}
        self.excFunction()
        self.tempCount++;
        console.log("============>websocket尝试第【"+self.tempCount+"】次连接")
      }
    },self.reConnInterval)
  }
}




/**
 * 获得普通的W3CWebSocket对象
 * @param wsUrl WebSocket 的地址
 * @returns {*}
 */
const defaultWebSocket= function (wsUrl) {
  let client = new W3CWebSocket(wsUrl);
  client.sendWxgcMsg=function(type,jsonData,success,error) {

    if(client.readyState!=1){
      if(error!=null&& typeof(error) ==='function') error(e,'连接错误，发送失败！')
      return;
    }
    let msg=stringifyWebSocketMsg(type,jsonData);
    client.send(msg)
    if(success!=null&& typeof(success) ==='function') success(msg,'发送成功！')

  }
  return client
}

/**
 * 获得普通W3CWebSocket对象并且可以自定义各种参数
 * @param wsUrl  WebSocket 的地址
 * @param onopen 建立连接的函数
 * @param onmessage 收取消息的函数
 * @param onerror  出错的函数（可选）
 * @param onclose  断开连接的函数（可选）
 * @returns {*}
 */
const  defaultWebSocketExec=function (wsUrl,onopen,onmessage,onerror,onclose) {
  if(onerror==null){
    onclose=function() {
      console.log(wsUrl+'连接失败');
    }
  }
  if(onclose==null){
    onclose=function() {
      console.log(wsUrl+'已断开连接');
    }
  }
  let client = new defaultWebSocket(wsUrl);
  client.onerror = onerror;
  client.onopen =onopen;
  client.onclose = onclose;
  client.onmessage = onmessage;
  return client
}

/**
 *  针对万像工程后台设计的W3CWebSocket对象
 *  默认根据【.env.development、 .env.production 】文件中配置的VUE_APP_WEB_SOCKET_BASE_URL
 *  此函数有默认的事件回调处理，如果需要监听回调则自
 *  添加监听对应监听事件即可
 *  addErrorListeners(callBackFun) 增加error监听事件
 *  addOpenListeners(callBackFun)  增加open监听事件
 *  addCloseListeners(callBackFun) 增加close监听事件
 *  addMessageListeners(typeName,callBackFun) 增加messgae监听事件 需要指定后台返回消息类型
 * @param wxgcUrl 万像工程后台注解 @ServerEndpoint("/websocket/xxxx")
 *        只需要传入XXX的地址即可
 * @returns {*}
 */
const  wxgcWebSocket =function (wxgcUrl) {
  let url=process.env.VUE_APP_WEB_SOCKET_BASE_URL;
  let client = new defaultWebSocket(url+wxgcUrl);
  //初始化各种监听事件
  //要求监听事件中的值格式为:{name:'',callBackFun:function(res){}}
  //注意：只有onMessageListeners 会根据name调用回调，其他监听事件 全部执行回调
  client.onErrorListeners=[];
  client.onOpenListeners =[];
  client.onCloseListeners = [];
  client.onMessageListeners = [];

  //添加监听事件的方法
  client.addErrorListeners=(callBackFun)=>{
    client.onErrorListeners.push({callBackFun:callBackFun});
  };
  client.addOpenListeners =(callBackFun)=>{
    client.onOpenListeners.push({callBackFun:callBackFun});
  };
  client.addCloseListeners = (callBackFun)=>{
    client.onCloseListeners.push({callBackFun:callBackFun});
  };
  client.addMessageListeners = (typeName,callBackFun)=>{
    client.onMessageListeners.push({name:typeName,callBackFun:callBackFun});
  };



  //error事件
  client.onerror = function(e) {
    console.log("WebSocket Error:"+wxgcUrl+',连接失败');
    if(client.onErrorListeners.length>0){
      for(let listener of client.onErrorListeners){
        //执行全部回调
        listener.callBackFun(e);
      }
    }
  };
  //open事件
  client.onopen =function() {
    console.log("====>WebSocket连接成功");
    if(client.onOpenListeners.length>0){
      for(let listener of client.onOpenListeners){
        //执行全部回调
        listener.callBackFun();
      }
    }
  };
  //连接关闭事件
  client.onclose = function() {
    console.log("====>WebSocket已关闭");
    if(client.onCloseListeners.length>0){
      for(let listener of client.onCloseListeners){
        //执行全部回调
        listener.callBackFun();
      }
    }
  };
  //接收消息
  client.onmessage = function(res) {
    console.log("====>WebSocket接收到全局消息:"+res.data);
    if (typeof res.data === 'string') {
      let obj=JSON.parse(res.data);
      if(client.onMessageListeners.length>0){
        for(let listener of client.onMessageListeners){
          if(obj.type==listener.name){
            //执行全部回调
            listener.callBackFun(obj);
          }
        }
      }
    }
  };
  return client
}


/**
 * 针对万像工程后台设计的W3CWebSocket对象 并且可以自定义各种参数
 *  默认根据【.env.development、 .env.production 】文件中配置的VUE_APP_WEB_SOCKET_BASE_URL
 *  注意：
 *    此方法主要用于自定义回调事件，所有的监听是不会生效的
 * @param wxgcUrl 万像工程后台注解 @ServerEndpoint("/websocket/xxxx")
 *        只需要传入XXX的地址即可
 * @param onopen 建立连接的函数
 * @param onmessage 收取消息的函数
 * @param onerror  出错的函数（可选）
 * @param onclose  断开连接的函数（可选）
 * @returns {*}
 */
const wxgcWebSocketExec= function (wxgcUrl,onopen,onmessage,onerror,onclose) {
  if(onerror==null){
    onclose=function() {
      console.log(wxgcUrl+'连接失败');
    }
  }
  if(onclose==null){
    onclose=function() {
      console.log(wxgcUrl+'已断开连接');
    }
  }
  let client = wxgcWebSocket(wxgcUrl);
  client.onerror = onerror;
  client.onopen =onopen;
  client.onclose = onclose;
  client.onmessage = onmessage;
  return client
}







/**
 *  将发送的数据转换成万像工程消息体格式
 * @param type 消息的类型 以此判断发送消息的用途
 *        自己和后台处理自定义字符串即可
 * @param jsonData 传递的数据 必须是json格式的数据
 * @returns {string} 格式化后的json字符串
 * @constructor
 */
const  stringifyWebSocketMsg=function(type,jsonData){
  return  JSON.stringify({type:type,data:jsonData});
}



//导出各种函数
module.exports={
  defaultWebSocket,defaultWebSocketExec,wxgcWebSocket,wxgcWebSocketExec,stringifyWebSocketMsg,webSocketUtil
}

