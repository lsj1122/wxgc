<template>
  <div class="demo">
       <div :id="easyPlayOption.divName" style="width: 100%;height: 100%;"
        ref="baseVideoBox"  @dblclick ='fullScreenSingle()'></div>
       <!-- fullSreen  fullScreenSingle-->
      <!-- <div id="play_window"></div> -->
    <div class="button_box" style="display:none">
        <!-- <div class="items">
            <div>加密类型：<select name="" id="secretKeyType">
                <option value="0">不加密</option>
                <option value="1">AES加密</option>
            </select>  秘钥：<input type="text" id="secretKey" id="secretKey"/>
            <button type="button" @click="SetSecretKey()">加密</button>
            <button @click="Destroy()">销毁worker（插件）</button>
            <button @click="getVersion()">获取版本</button>
            </div>
        </div> -->
        <!-- <div class="items">
            <div>设备认证</div>
            &nbsp;&nbsp;host: <input type="text" id="loginAddr" value="10.19.81.81" /><br />
            &nbsp;&nbsp;user: <input type="text" id="loginUser" value="admin" />&nbsp;&nbsp;password <input type="text" id="loginPassword" value="Abc123++" />
            <button type="button" @click="login()">认证</button>
        </div> -->
        <div class="items">
            <div>
                解码播放方式：
                <!-- <input type="radio" name="streamType" value="0" checked> 普通模式 &nbsp;&nbsp;
                <input type="radio" name="streamType" value="1"> 高级模式 -->
            </div>
            <div>日志打印：
            <button type="button" @click="triggerJSDecoderLog(1)">开启</button>
                <button type="button" @click="triggerJSDecoderLog(0)">关闭</button>
            </div>
            <!-- <div>hasAudio：
                <input type="radio" name="hasAudio" value="true" checked> 是 &nbsp;&nbsp;
                <input type="radio" name="hasAudio" value="false"> 否
            </div> -->
        </div>
        <div class="items">

            <div>
                URL: &nbsp;&nbsp;<input style="width: 600px;" id="url" type="text"
                    value="ws://36.7.153.130:559/EUrl/OdrfgWs" />
            </div>
            <div>预览：
                <button type="button" @click="realplay()">预览</button>
                <button type="button" @click="stop()">停止预览</button>
                <button type="button" @click="multiPlay()">多路预览</button>
                <button type="button" @click="StopRealPlayAll()">关闭所有预览</button>
            </div>
            <!-- <button type="button" @click="GetOSDTime()">获取OSD</button> -->
            <div>录像：
                <button type="button" @click="record()">开始录像</button>
                <button type="button" @click="stopRecord()">停止录像</button>
            </div>
            <div>抓图：
                <button type="button" @click="CapturePicture('BMP')">抓图(BMP)</button>
                <button type="button" @click="CapturePicture('JPEG')">抓图(JPEG)</button>
            </div>
            <!-- <button type="button" @click="selectWnd()">选中窗口</button> -->
            <!-- <button type="button" @click="startTalk()">对讲</button> -->
            <!-- <button type="button" @click="setPCMCallback()">设置音频回调</button> -->
        </div>
		<div class="items">
            <div>语音对讲：
                TalkURL: &nbsp;&nbsp;<input style="width: 600px;" id="talkurl" type="text"
                    value="ws://10.2.145.66:559/openUrl/CLJ52BW" />
                <button type="button" @click="startTalk()">开始对讲</button>
                <button type="button" @click="stopTalk()">停止对讲</button>
                <button type="button" @click="TalkGetVolume()">获取声音</button>
                <!-- <button type="button" @click="SetVolume()">设置声音</button> -->
                设置声音<input
                    type="range"
                    min="0"
                    max="100"
                    id="talkvolume"
                    step="1"
                    value="50"
                    onchange="TalkSetVolume()"
                    />
            </div>
        </div>
        <div class="items">
            <div>
                URL: &nbsp;&nbsp;<input style="width: 600px; margin-bottom: 2px;" id="urlPlayback" type="text"
                    value="ws://10.2.145.66:559/openUrl/CLJ52BW"/><br/>
                开始时间 <input type="text" id="sDate" value="2021-03-15T00:00:00Z" /> -
                结束时间 <input type="text" id="eDate" value="2021-03-15T23:59:59Z" />
            </div>
            <div>回放：
                <button type="button" @click="playback()">回放</button>
                <button type="button" @click="Pause()">暂停</button>
                <button type="button" @click="Resume()">恢复</button>
                <button type="button" @click="stop()">停止回放</button>
            </div>
            <div>快/慢放：
                <button type="button" @click="Fast()">快放</button>
                <button type="button" @click="Slow()">慢放</button>
            </div>
            <div>抓图：
                <button type="button" @click="CapturePicture('BMP')">抓图(BMP)</button>
                <button type="button" @click="CapturePicture('JPEG')">抓图(JPEG)</button>
            </div>
            <div>单帧：
                <button type="button" @click="FrameForward()">单帧进</button>
            </div>
            <div>剪辑：
                <button type="button" @click="record()">开始剪辑</button>
                <button type="button" @click="stopRecord()">停止剪辑</button>
            </div>
            <div>定位：
                开始时间 <input type="text" id="sDate1" value="2021-03-15T14:09:00Z" /> -
                结束时间 <input type="text" id="eDate1" value="2021-03-15T23:59:59Z" />
                <button type="button" @click="playbackLocation()">定位</button>
            </div>
        </div>
        <div class="items">
            <button type="button" @click="EnableZoom()">开启电子放大</button>
            <button type="button" @click="DisableZoom()">关闭电子放大</button>
            <!-- <button type="button" @click="Enable3DZoom()">开启3D放大</button> -->
            <!-- <button type="button" @click="Disable3DZoom()">关闭3D放大</button> -->
        </div>
        <div class="items">
            <button type="button" @click="OpenSound()">开启声音</button>
            <button type="button" @click="GetVolume()">获取声音</button>
            <!-- <button type="button" @click="SetVolume()">设置声音</button> -->
            设置声音<input
                type="range"
                min="0"
                max="100"
                id="volume"
                step="1"
                value="100"
                onchange="SetVolume()"
                />
            <button type="button" @click="CloseSound()">关闭声音</button>
        </div>
       
        <div class="items">
            <div>画面分割</div>
            <button type="button" @click="arrangeWindow(1)">1x1</button>
            <button type="button" @click="arrangeWindow(2)">2x2</button>
            <button type="button" @click="arrangeWindow(3)">3x3</button>
            <button type="button" @click="arrangeWindow(4)">4x4</button>
            <button type="button" @click="fullScreenSingle()">单窗口全屏</button>
            <button type="button" @click="fullSreen()">插件全屏</button>
        </div>
        <!--<div class="items">
            <div>跨域测试</div>
            &nbsp;&nbsp;<input type="text" id="corsAddr" value="10.6.38.103:80" />
            <button type="button" @click="corsTest()">测试</button>
        </div>

        <div class="items">
            <div>录像搜索摘要测试</div>
            &nbsp;&nbsp;地址: <input type="text" id="recordDigest" value="10.5.147.204:80" />
            &nbsp;&nbsp;用户名 <input type="text" id="recordDigestUser" value="admin" />
            &nbsp;&nbsp;密码 <input type="text" id="recordDigestPassword" value="web12345" />
            <button type="button" @click="search()">测试</button>
        </div>-->
        <!-- <div class="items">
            <div>websocket透传</div>
            <button type="button" @click="transmission()">测试</button>
        </div> -->
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
export default {
props: ['easyPlayOption'],
  components: {},
  data () {
    return {
       aScript:["./h5player.min.js"],
    //    oPlugin:null,
       create:null,
       iWind:0, // //窗口索引
       clickIndex:0 , // 鼠标点击的下标
      
    }
  },
  mounted(){
     

     this.ways() 
       
  },
   beforeDestroy(){
       this.StopRealPlayAll()
   },
  methods: {
      ways(){
         var _this =this
      //1.得到地址，引入文件
    // this.getScript(this.aScript,function() {
    //     console.log(206,aScript)
      
    //   //初始化插件
    //   //初始化插件
    //   oPlugin = new JSPlugin({
    //     szId: "playWind",  //需要英文字母开头 必填
    //     // iWidth: 600,  // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
    //     // iHeight: 400,
    //     iMaxSplit: 4,       // 分屏播放，默认最大分屏4*4   1*1  2*2
    //     iCurrentSplit: 4, // 分屏播放，默认最大分屏4*4
    //     szBasePath: "./",  // 必填,引用H5player.min.js的js相对路径
    //     oStyle: {
    //       border: "#343434",
    //       borderSelect: "#FFCC00",
    //       background: "#000"
    //     },
    //     openDebug: true
    //   });
    //   console.log(224,oPlugin)
    //   _this.initPlugin();
    // });


    var curIndex = 0; // 当前窗口下标
    this.oPlugin = new JSPlugin({
      szId: _this.easyPlayOption.divName, //需要英文字母开头 必填
      szBasePath: './', // 必填,引用H5player.min.js的js相对路径

      // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
    //   iWidth: 600,
    //   iHeight: 400,

      // 分屏播放，默认最大分屏4*4
      iMaxSplit: 1,
      iCurrentSplit: 1,

      // 样式
      oStyle: {
        border: "#343434",
        borderSelect: "#FFCC00",
        background: "#000"
      }
       })
     this.initPlugin()

     this.realplay()  // 自动播放
    //  this.arrangeWindow(1)
        
      },
      getScript(url, fn) {
        console.log(266,url)
        console.log(266,fn)
      if ("string" === typeof(url)) {
        url = [url]; //如果不是数组带个套
      };
      var ok = 0;            //加载成功几个js
      var len = url.length;  //一共几个js
      var head = document.getElementsByTagName("head").item(0);
      var js = null;
      var _url;
      this.create = function(url) {//创建js
        var oScript = null;
        oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = url;
        head.appendChild(oScript);
        return oScript;
      };
      console.log(282,this.create)
      for (var i = 0; i < len; i++) {
        _url = url[i];
        js = this.create(_url);//创建js
        console.log(286,js)
        fn && (js.onload = function() {
           
          if (++ok >= len) {//如果加载完所有的js则执行回调
            console.log(289,ok)
            fn();
          }
        });
      };
    },
     initPlugin() {
        this.oPlugin.JS_SetWindowControlCallback({
            windowEventSelect: function (iWndIndex) {  //插件选中窗口回调
                this.iWind = iWndIndex;
                console.log(iWndIndex);
            },
            pluginErrorHandler: function (iWndIndex, iErrorCode, oError) {  //插件错误回调
                console.error(`window-${iWndIndex}, errorCode: ${iErrorCode}`, oError);
            },
            windowEventOver: function (iWndIndex) {  //鼠标移过回调
                //console.log(iWndIndex);
            },
            windowEventOut: function (iWndIndex) {  //鼠标移出回调
                //console.log(iWndIndex);
            },
            windowEventUp: function (iWndIndex) {  //鼠标mouseup事件回调
                // console.log(iWndIndex);
            },
            windowFullCcreenChange: function (bFull) {  //全屏切换回调
                console.log(bFull);
            },
            firstFrameDisplay: function (iWndIndex, iWidth, iHeight) {  //首帧显示回调
                console.log(iWndIndex, iWidth, iHeight);
            },
            performanceLack: function () {  //性能不足回调
                
            }
        });
        this.oPlugin.JS_SetOptions({
            bSupportSound: false , //是否支持音频，默认支持
            bSupporDoubleClickFull: false,  //是否双击窗口全屏，默认支持
            bOnlySupportMSE: true,  //只支持MSE
            bOnlySupportJSDecoder: true  //只支持JSDecoder
        }).then(function () {
            console.log("JS_SetOptions");
        });
    },

    // 各种方法
    getVersion () {
        this.oPlugin.JS_GetPluginVersion().then(function (szVersion) {
            console.log(szVersion);
        });
    },
    Destroy() {
        this.oPlugin.JS_DestroyWorker().then(function () {
            console.log("destroyWorker success");
        });
    },
    SetSecretKey() {
        var secretKey =  document.getElementById("secretKey").value;
        this.oPlugin.JS_SetSecretKey(this.iWind, secretKey).then(function () {
            console.log("JS_SetSecretKey success");
        }, function () {
            console.log("JS_SetSecretKey failed");
        });
    },
    // 预览（播放）
    realplay () { 
        console.log( this.iWind)
        // 先获取地址
        // var url = document.getElementById("url").value; // + "?token=" + szToken;  //"ws://10.19.141.64:7314/EUrl/ybcwxHO"; 联网共享下该url和playurl是一样的
     var url =this.easyPlayOption.url
      console.log(327,url)
        // let streamType = getRadioValue('streamType');
        // 普通为0 ，高级模式为1
        let streamType = 1;
      console.log(111)
        this.oPlugin.JS_Play(url, {
          playURL: url,
          mode: 1,
          //session: szWebsocketSessionID,  //定制设备
          //token: szToken,
        }, this.iWind).then(function() {
            console.log("realplay success");
        },function () {
            console.log("realplay failed");
        });
    },
    // 取 radio 值得 （暂时无用）
    getRadioValue (radioName) {
        let value = '';
        document.getElementsByName(radioName).forEach(el => {
            if (el.checked) {
                value = el.value
            }
        })
        return value
    },
    // 回放
    playback () {
        var url = document.getElementById("urlPlayback").value;  //"ws://10.19.141.64:7314/EUrl/ybcwxHO";
        var szStartDate = document.getElementById("sDate").value;
        var szEndDate = document.getElementById("eDate").value;
        // let streamType = getRadioValue('streamType');
        let streamType = 1;
        if (document.getElementById("urlPlayback").value && szStartDate && szEndDate) {
            this.oPlugin.JS_Play(url, {
                // token: szToken,
                //流媒体
                playURL: url,  //联网共享的取流url
                mode: parseInt(streamType),
                //proxy: "10.5.6.8",  //proxy后面的属性为代理的目标地址，根据实际情况配置，联网共享https下需要用到该参数
                //mode: "media",  //建立连接的url新增一个media节点, 联网共享https下需要用到该参数
            }, this.iWind, szStartDate, szEndDate).then(function() {
                console.log("playback success");
            },function () {
                console.log("playback failed");
            });
        } else {
            return;
        }
    },
    // 定位
    playbackLocation () {
        var szStartDate = document.getElementById("sDate1").value;
        var szEndDate = document.getElementById("eDate1").value;
        this.oPlugin.JS_Seek(this.iWind, szStartDate, szEndDate).then(function () {
            console.log("playbackLocation success");
        }, function () {
            console.log("playbackLocation failed");
        });
    },
    // 暂停 ，停止预览
    stop () {
        this.oPlugin.JS_Stop(this.iWind).then(function () {
            console.log("stop success");
        }, function (e) {
            console.error("stop failed", e);
        });
    },
     arrangeWindow (i) {
        this.oPlugin.JS_ArrangeWindow(i).then(function () {
        
            console.log("JS_ArrangeWindow success");
        });
    },
    // 回放里面的 暂停
    Pause () {
        this.oPlugin.JS_Pause(this.iWind).then(function () {
            console.log("Pause success");
        }, function (e) {
            console.error("Pause failed", e);
        });
    },
    Resume () {
        this.oPlugin.JS_Resume(this.iWind).then(function () {
            console.log("Resume success");
        }, function (e) {
            console.error("Resume failed", e);
        });
    },
      Slow () {
        this.oPlugin.JS_Slow(this.iWind).then(function (iRate) {
            console.log("Slow success, current rate", iRate);
        }, function (e) {
            console.error("Slow failed", e);
        });
    },
     Fast () {
        this.oPlugin.JS_Fast(this.iWind).then(function (iRate) {
            console.log("Fast success, current rate", iRate);
        }, function (e) {
            console.error("Fast failed", e);
        });
    },
     FrameForward() {
        this.oPlugin.JS_FrameForward(this.iWind).then(function () {
            console.log("FrameForward success");
        }, function () {
            console.log("FrameForward failed");
        });
    },
     GetOSDTime () {
        this.oPlugin.JS_GetOSDTime(this.iWind).then(function(time) {
            console.log(new Date(time));
        });
    },
    
     CloseSound () {
        this.oPlugin.JS_CloseSound(this.iWind).then(function () {
            console.log("JS_CloseSound success");
        }, function () {
            console.log("JS_CloseSound failed");
        });
    },
     EnableZoom () {
         
        this.oPlugin.JS_EnableZoom(this.iWind).then(function () {
            console.log("EnableZoom success");
        }).catch(err => {
            console.warn(`EnableZoom failed: `, err)
        });
    },
     DisableZoom () {
        this.oPlugin.JS_DisableZoom(this.iWind).then(function () {
            console.log("DisableZoom success");
        }).catch(err => {
            console.error("DisableZoom failed: ", err)
        });
    },
     Enable3DZoom () {
        this.oPlugin.JS_Enable3DZoom(this.iWind, function (oRect) {
            console.log(oRect);
        })
    },
     Disable3DZoom () {
        this.oPlugin.JS_Disable3DZoom(this.iWind).then(function () {
            console.log("JS_Disable3DZoom success");
        }, function () {
            console.log("JS_Disable3DZoom failed");
        });
    },
     OpenSound () {
        var iRet = this.oPlugin.JS_OpenSound (this.iWind).then(function () {
            console.log("JS_OpenSound success");
        }, function () {
            console.log("JS_OpenSound failed");
        });
    },
      SetVolume () {
        // this.oPlugin.JS_SetVolume (this.iWind, 32500).then(function () {
        //     console.log("JS_SetVolume success");
        // }, function () {
        //     console.log("JS_SetVolume failed");
        // });
        let volume = document.getElementById('volume').value;
        this.oPlugin.JS_SetVolume(this.iWind, parseFloat(volume)).then(
            () => {
                console.log("JS_SetVolume success", volume);
            },
            (err) => {
                console.error("JS_SetVolume failed", err);
            }
        );
    },
     selectWnd () {
        this.oPlugin.JS_SelectWnd(3).then(function () {
            console.log("JS_SelectWnd success");
        }, function () {
            console.log("JS_SelectWnd failed");
        });
    },
      GetVolume () {
        this.oPlugin.JS_GetVolume (this.iWind).then(function (i) {
            console.log(i);
        });
    },
     CapturePicture(szType) {
        this.oPlugin.JS_CapturePicture (this.iWind, "img", szType).then(function () {
            console.log("CapturePicture success");
        }, function () {
            console.log("CapturePicture failed");
        });
    },
     StopRealPlayAll () {
         console.log(90079)
         if( this.oPlugin){
this.oPlugin.JS_StopRealPlayAll().then(function () {
            console.log("JS_StopRealPlayAll success");
        }, function () {
            console.log("JS_StopRealPlayAll failed");
        });
         }
        
    },
      dateFormat(oDate, fmt) {
        var o = {
            "M+": oDate.getMonth() + 1, //月份
            "d+": oDate.getDate(), //日
            "h+": oDate.getHours(), //小时
            "m+": oDate.getMinutes(), //分
            "s+": oDate.getSeconds(), //秒
            "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
            "S": oDate.getMilliseconds()//毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
     record() {
        var szTime = dateFormat(new Date(), "yyyyMMddhhmmssS");
        this.oPlugin.JS_StartSaveEx(this.iWind,"10.17.137.229_01_" + szTime + ".mp4", 2).then(function () {
            console.log("record success");
        }, function () {
            console.log("record failed");
        });;
    },
     stopRecord() {
        this.oPlugin.JS_StopSave(this.iWind).then(function () {
            console.log("stopRecord success");
        }, function () {
            console.log("stopRecord failed");
        });;
    },
	 startTalk () {
        var talkurl = document.getElementById("talkurl").value
        this.oPlugin.JS_StartTalk(talkurl).then(function () {
            console.log("startTalk success");
        }, function () {
            console.log("startTalk failed");
        });
    },

     stopTalk () {
        this.oPlugin.JS_StopTalk().then(function () {
            console.log("stopTalk success");
        }, function () {
            console.log("stopTalk failed");
        });
    },
	
	 TalkSetVolume () {
        let volume = document.getElementById('talkvolume').value;
        this.oPlugin.JS_TalkSetVolume(parseFloat(volume)).then(
            () => {
                console.log("JS_TalkSetVolume success", volume);
            },
            (err) => {
                console.error("JS_TalkSetVolume failed", err);
            }
        );
    },

     TalkGetVolume () {
        this.oPlugin.JS_TalkGetVolume ().then(function (i) {
            console.log(i);
        });
    },
     fullSreen() {
   
        this.oPlugin.JS_FullScreenDisplay(true).then(function () {
            console.log("JS_FullScreenDisplay success");
        }, function () {
            console.log("JS_FullScreenDisplay failed");
        });

  
    },
     fullScreenSingle () {
    //      let clickIndex =null
    //       $(".demo").click(function(){
    //     var Index=$(".demo").index(this)
    //       clickIndex =Index
    //     console.log(238,clickIndex)
      
    //    })
        // console.log($(".demo").index())
        //  console.log(624,clickIndex)
        //  console.log(1111111111111111111,this.oPlugin)
        // console.log(631,this.iWind)
        this.oPlugin.JS_FullScreenSingle(this.iWind).then(function () {
            console.log("JS_FullScreenSingle success");
        }, function () {
            console.log("JS_FullScreenSingle failed");
        });
    //   this.aa(this.iWind).then(res=>{
    //       console.log(res)
    //   })



    },
    aa(r){
         
                var a = this;
                return -1 === r && (r = this.iCurrentWndIndex), new f.default(function(e, t) {
                    if (a.aWndList[r].bPlay) {
                        var n = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || !1,
                            i = (1 === a.aWndList[r].iMode ? (0, m.default)(this).find("#player-container-" + r).find("video.play-window") : (0, m.default)(this).find("#player-container-" + r).find("canvas.play-window")).get(0);
                        if (n) {
                            if (a.oJSPlugin.find(".parent-wnd").eq(0).width() === (0, m.default)(window).width()) return void t();
                            document.exitFullscreen ? document.exitFullscreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.mozCancelFullScreen && document.mozCancelFullScreen()
                        } else i.requestFullScreen ? i.requestFullScreen() : i.webkitRequestFullScreen ? i.webkitRequestFullScreen() : i.mozRequestFullScreen && i.mozRequestFullScreen();
                        e()
                    } else t()
                })
            
    },
       triggerPrivateData (bTrue) {
        let nIntelType = parseInt(document.getElementById('nIntelType').value);
        let result = this.oPlugin.JS_RenderPrivateData(nIntelType, bTrue);
        console.info('triggerPrivateData', result)
    },
      triggerJSDecoderLog (bFlag) {
        this.oPlugin.JS_SetLogFlag(bFlag);
    }


  }
}
</script>

 <style scoped>
   .demo{
       width: 100%;
       height: 100%;
   }
        * {
            padding: 0;
            margin: 0;
            font-size: 12px;
        }

        #playWind {
            /* float: left; */
            display: inline-block;
        }
        body {
            margin: 10px;
        }
        
        input, select {
            padding: 3px 6px;
            font-size: 16px;
        }
        input:focus, select:focus {
            outline: 1px solid rgba(0,153,255, 1);
            border-color: rgba(0,153,255, 0);
        }

        button {
            margin: 10px 10px;
            padding:2px 5px;
        }
        .button_box {
           
            width: 800px;
           float: left;
        }
        .button_box div {
            margin: 10px 10px;
        }
        #volume {
            position: relative;
            top: 5px;
        }
        .items {
           
            border: 1px solid #444444;
        }

    </style>