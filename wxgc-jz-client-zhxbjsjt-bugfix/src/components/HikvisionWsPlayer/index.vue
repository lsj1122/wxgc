<template>
  <div class="ws-player el-loading-parent--relative">
    <!-- 播放器容器   -->
    <div :id="playerId" :ref="playerId" class="player"></div>
  </div>
</template>

<script>
import {JSPlugin} from './js/h5player.min'
import $ from "jquery"
import moment from "moment"
import screenfull from 'screenfull'
import {getUrls, getController} from "@/components/HikvisionWsPlayer/js/api";
import {v4 as uuid} from 'uuid'

export default {
  name: "index",
  components: {},
  props: {
    controls: {  //是否显示控制面板
      type: Boolean,
      default: true
    },
    autoPlay: {  //是否自动播放
      type: Boolean,
      default: true
    },
    resourceIds: {  //监控资源唯一标志 集合 集合顺序就是播放顺序
      type: Array,
      default: () => []
    },
    resourceTitles: {  //监控资源唯一Name 集合 集合顺序就是播放顺序
      type: Array,
      default: () => []
    },
    splitNum: {  //拆分数量
      type: Number,
      default: 1
    },
    index: {
      type: Number,
      default: 0
    },
    type: {
      type: Boolean,
      default: false
    },
    videoType:{
      type: String,
      default: '枪机'
    }
  },
  data() {
    return {
      tabActive: (!!window.MediaSource) ? 'mse' : 'decoder', // 是否支持mse
      isMoveDevice: document.body.clientWidth < 992,// 是否移动设备
      player: null, //播放器
      urls: [], //播放的Url集合
      loadSrc: require('./img/player-loading.gif'),
      selectIndex: 0,
      // protocol: location.protocol,
      playerId: null,
      lock: {},
    }
  },
  watch: {
    resourceIds: {
      handler(newValue, oldValue) {
        this.loadWsUrls()
      },
    },
  },
  computed: {
    mode() {
      return this.tabActive === 'mse' ? 0 : 1
    },
    protocol() {
      return location.protocol
    }
  },
  created() {
    this.playerId = uuid()
    console.log('0', 0)
  },
  mounted() {
    this.init()
    this.createPlayer()
  },
  methods: {
    loadWsUrls() {
      //加载获取监控视频的ws播放地址信息
      console.log('=========================>', this.resourceIds)
      //暂时模拟
      this.urls = []
      for (let i = 0; i < this.resourceIds.length && i < (this.splitNum * this.splitNum); i++) {
        if (this.resourceIds[i]) {
          let data = {
            cameraIndexCode: this.resourceIds[i],
            //protocol: 'ws',
            protocol: this.protocol.includes("https") ? 'wss' : 'ws',
            streamType: 0
          }
          this.loadPlayerUrl(0, data)
        }
      }
    },
    /**
     * 加载视频到指定窗口，当前项目中由于美化所以是多个播放器的 0 窗口，所以下方的 index 总是 0
     * @param index 窗口
     * @param Obj 数据对象
     */
    loadPlayerUrl(index, Obj) {
      getUrls(Obj).then(res => {
        if (res.code == 'success') {
          if (res.data.status === 0) { //离线的
            this.loadUnOnlineInfo((this.type ? index : 0))
          } else {
            /*   //res.data.realplay= res.data.realplay.replace("www.hfwxsz.top")"wss://zhihuiyunpingtai.cn/ws-hikvision/openUrl/0J6LUVc"
               res.data.realplay="ws://192.168.0.46:9526/ws-hikvision/openUrl/0J6LUVc"*/
            this.urls.push(res.data)
            /* console.log("===========<",res.data)*/
            if (this.autoPlay) {
              //自动播放
              this.playerVideo(this.index)
            }
            //控制组件
            this.activeControls(this.index)
          }
        } else {
          this.loadErrorInfo(this.index)
        }
      }).catch(err => {
        //this.loadUrlErrInfo(i)
        setTimeout(() => {
          this.activeControls(this.index)
          this.loadPlayerUrl(this.index, Obj)
        }, 1000)
      })
    },
    /**
     * 格式化标题
     * @param code
     * @param color
     * @param custom
     * @param disbale
     * @returns {string}
     */
    //加载字体图标
    loadTitle(code, color, custom, disbale) {
      return '<span class=" ' + (disbale ? "playerIcon-disable" : "") + ' " style=" display: block; color: ' + color + '" ' + custom + ' >' + code + '</span>'
    },
    /**
     * 格式化图标
     * @param code
     * @param color
     * @param custom
     * @param disbale
     * @returns {string}
     */
    //加载字体图标
    loadIcon(code, color, custom, disbale) {
      return '<span class="icon playerIcon ' + (disbale ? "playerIcon-disable" : "") + ' " style=" display: block; color: ' + color + '" ' + custom + ' >' + code + '</span>'
    },
    loadIconFont(code, color, custom, disbale) {
      return '<span class="icon playerIcon iconfont' + (disbale ? "playerIcon-disable" : "") + ' " style=" display: block; color: ' + color + '" ' + custom + ' >' + code + '</span>'
    },
    /**
     * 给视频增加 loading 蒙版
     * @param index
     */
    //视频loading
    loadingInfo(index) {
      if (this.resourceIds[index] == null || this.resourceIds[index] == undefined || this.resourceIds[index] == '') {
        return
      }
      //let icon='<img src="'+this.loadSrc+'"/>'
      let icon = '<i class="el-icon-loading" style="font-size: 2em; color: white"></i>'
      this.appendFullInfoEl(index, icon, 'white', '加载视频中...')
    },
    //视频loading
    reLoadingInfo(index) {
      //let icon='<img src="'+this.loadSrc+'"/>'
      let icon = '<i class="el-icon-loading" style="font-size: 2em; color: white"></i>'
      this.appendFullInfoEl(index, icon, 'white', '尝试重新加载中...')
    },
    //停止信息
    pauseInfo(index) {
      if (this.resourceIds[index] == null || this.resourceIds[index] == undefined || this.resourceIds[index] == '') {
        return
      }
      let str = '<span class="icon playerIcon pause">&#xe61b;</span>';
      this.appendFullInfoEl(index, str, 'white', '已停止')
    },
    //清除提示
    clearFullInfo(index) {
      if (this.type) {
        $('.parent-wnd').eq(index).find('#player-container-0').find('.el-loading-mask').remove()
      } else {
        $('.videoPlayerBox').eq(index).find('#player-container-0').find('.el-loading-mask').remove()
      }
    },
    //视频加载失败
    loadErrorInfo(index) {
      if (this.resourceIds[index] == null || this.resourceIds[index] == undefined || this.resourceIds[index] == '') {
        return
      }
      this.appendFullInfoEl(index, this.loadIcon('&#xe627;', 'red'), 'red', '加载失败！')
    },
    //视频加载失败
    loadUnOnlineInfo(index) {
      if (this.resourceIds[index] == null || this.resourceIds[index] == undefined || this.resourceIds[index] == '') {
        return
      }
      this.appendFullInfoEl(index, this.loadIcon('&#xe627;', '#FF8C00'), 'red', '监控已离线！')
    },
    loadUrlErrInfo(index) {
      if (this.resourceIds[index] == null || this.resourceIds[index] == undefined || this.resourceIds[index] == '') {
        return
      }
      this.appendFullInfoEl(index, this.loadIcon('&#xe627;', 'red'), 'red', '获取监控地址失败！')
    },
    //初始化
    init() {
      // 设置播放容器的宽高并监听窗口大小变化
      window.addEventListener('resize', () => {
        this.player.JS_Resize()
      })
    },
    //创建播放器
    createPlayer() {
      this.player = new JSPlugin({
        szId: this.playerId,
        szBasePath: "/",
        iMaxSplit: 1,
        iCurrentSplit: this.isMoveDevice ? 1 : 1,
        openDebug: true,
        oStyle: {
          borderSelect: this.isMoveDevice ? '#000' : 'transparent',
        }
      })
      let that = this
      // 事件回调绑定
      this.player.JS_SetWindowControlCallback({
        windowEventSelect: (iWndIndex) => {  //插件选中窗口回调
          this.selectIndex = iWndIndex;
        },
        pluginErrorHandler: function (iWndIndex, iErrorCode, oError) {  //插件错误回调
          console.log('pluginError callback: ', iWndIndex, iErrorCode, oError);
        },
        windowEventOver: function (iWndIndex) {  //鼠标移过回调

        },
        windowEventOut: function (iWndIndex, event) {  //鼠标移出回调
          //console.log(iWndIndex);
          /*  let el=$('#player-container-'+iWndIndex);
            el.find('.player-controls').remove()*/
        },
        windowEventUp: function (iWndIndex) {  //鼠标mouseup事件回调
          //console.log(iWndIndex);
        },
        windowFullCcreenChange: function (bFull) {  //全屏切换回调
          console.log('fullScreen callback: ', bFull);
        },
        firstFrameDisplay: function (iWndIndex, iWidth, iHeight) {  //首帧显示回调
          console.log('firstFrame loaded callback: ', iWndIndex, iWidth, iHeight);
        },
        performanceLack: function () {  //性能不足回调
          this.$message.warning("当前浏览器性能不足,请减少监控查看数量!")
        }
      });
      this.arrangeWindow() //拆分播放器数量
      //加载获取监控的wsURl
      this.loadWsUrls()
    },


    playerVideo(index, reload) {
      let modeValue = this.mode
      //loading效果
      if (reload) {
        this.reLoadingInfo(index)
      } else {
        this.loadingInfo(index)
      }
      let playURL = this.urls[0].realplay
      this.player.JS_Play(playURL, {playURL, modeValue}, 0).then(() => {
          console.log(280,'index',index)
          //加载成功隐藏信息
          this.clearFullInfo(index)
          this.iconDisplay(index, "player", false)
          this.iconDisplay(index, "pause", true)
        },
        e => {
          //加载失败错误信息
          this.loadErrorInfo(index)
          this.iconDisplay(index, "player", true)
          this.iconDisplay(index, "pause", false)
          setTimeout(() => {
            this.playerVideo(index)
          }, 1000)
        }
      )
    },
    //拆分播放器数量
    arrangeWindow() {
      let splitNum = 1
      this.player.JS_ArrangeWindow(splitNum).then(() => {
          console.log(`arrangeWindow to ${splitNum}x${splitNum} success`)
        },
        e => {
          console.error(e)
        }
      )
    },
    iconDisplay(index, type, display) {
      console.log(309,'index, type, display',index, type, display)
      let el = $('.parent-wnd').eq(index).find('#player-container-0'  + ' span[type=' + type + ']');
      el[0].style.display = display ? 'block' : 'none'
    },
    activeControls(index) {
      console.log('activeControls', index)
      let el = null;
      if (this.type) {
        el = $('.parent-wnd').eq(index).find('#player-container-0');
      } else {
        el = $('.videoPlayerBox').eq(index).find('#player-container-0');
      }

      // let el = $('#player-container-' + index);
      /* $('[id^="player-container"]').find('.player-controls').remove()
 */
      // var arrLength = this.$store.state.video.videoLength; // 这是对象
      // console.log('arrLength',arrLength)
      if (el.find('.player-controls').length > 0) {
        return
      }

      console.log(337,'this.videoType',this.videoType)

      if (this.type) {
        let ct1 = '<div class="player-header" >' +
          '        <div>' +
          this.loadTitle(this.resourceTitles[index], 'white', 'title="抓图" index=' + (this.type ? index : 0) + '') +
          '        </div>' +
          '        <div>' +
          this.loadIcon('', 'white', 'title="关闭" index=' + this.index + ' type="close"', false) +
          '        </div>' +
          '      </div>'
        el.append(ct1)
      }

      let ct = '<div class="player-controls" >' +
        '        <div>' +
        this.loadIcon('&#xe611;', 'white', ' title="播放" index=' + this.index + ' type="player"') +
        this.loadIcon('&#xe61b;', 'white', 'title="停止" index=' + this.index + ' type="pause"') +
        // this.loadIcon('&#xe619;', 'white', 'title="开启对讲" index=' + index + ' type="voiceStart"') +
        // this.loadIcon('&#xe625;', 'white', 'title="关闭对讲" index=' + index + ' type="voiceStop"') +
        // this.loadIcon('&#xe61f;', 'white', 'title="开始录制" index=' + index + ' type="recordStart"') +
        // this.loadIcon('&#xe61d;', 'white', 'title="停止录制" index=' + index + ' type="recordStop"') +
        //  this.loadIcon('&#xe616;', 'white', 'title="查看回放" index=' + index + ' type="backStart"') +
        this.loadIcon('&#xe626;', 'white', 'title="抓图" index=' + this.index + ' type="snapshot"') +
        (this.videoType == '球机' ?  this.loadIconFont('&#xe628;', 'white', 'title="方向控制" index=' + this.index + ' type="direction"') : '')
        +
        '        </div>' +
        '        <div>' +
        this.loadIcon('&#xec13;', 'white', 'index=' + this.index + ' type="fullScreen"', false) +
        '        </div>' +
        '      </div>'
      el.append(ct)


      //创建控制
      let ctrBtn = document.createElement("div");
      ctrBtn.innerHTML =
        '<div class="component" style="display: none" >' +
        '<div class="vloading" style="display: none"><i class="el-icon-loading"></i><p>执行中</p></div>' +
        '      <ul class="clearfix">' +
        '        <li class="circle4 updateStatus" title="焦距变大" data-index="' + this.index + '" data-type="ZOOM_IN"><i class="el-icon-circle-plus"></i></li>' +
        '        <li class="circle2 updateStatus" title="焦距变小" data-index="' + this.index + '" data-type="ZOOM_OUT"><i class="el-icon-remove"></i></li>' +
        "      </ul>" +
        '      <div class="cn-wrapper opened-nav" id="cn-wrapper">' +
        "        <ul>" +
        '          <li  ><a href="#"  data-index="' + this.index + '"   data-type="UP"  class="updateStatus" title="向上"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '          <li  ><a href="#"  data-index="' + this.index + '"  data-type="RIGHT" class="updateStatus" title="向右"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '          <li  ><a href="#"  data-index="' + this.index + '"  data-type="DOWN" class="updateStatus"  title="向下"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '          <li ><a href="#"   data-index="' + this.index + '"  data-type="LEFT" class="updateStatus"  title="向左"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        "        </ul>" +
        "      </div>" +
        "    </div>";
      el.append(ctrBtn);

      el.find(".directionBtn").on("click", (el) => {
        let div = document.querySelector(".component");
        if (div.style.display == "block") {
          div.style.display = "none";
          return;
        }
        div.style.display = "block";
      });

      let _this = this;
      $(document).on("click", ".parent-wnd a.updateStatus", function (event) {
        console.log(393,'_this.index,index,',_this.index,index)
        // 多个实例会重复调用方法导致到处乱转
        if ($(this).data("index") != index) {
          return
        }
        if ($(this).data("type") == "UP") {
          _this.updateStatus("UP", 0, index);
        } else if ($(this).data("type") == "RIGHT") {
          _this.updateStatus("RIGHT", 0, index);
        } else if ($(this).data("type") == "DOWN") {
          _this.updateStatus("DOWN", 0, index);
        } else if ($(this).data("type") == "LEFT") {
          _this.updateStatus("LEFT", 0, index);
        } else if ($(this).data("type") == "ZOOM_IN") {
          _this.updateStatus("ZOOM_IN", 0, index);
        } else if ($(this).data("type") == "ZOOM_OUT") {
          _this.updateStatus("ZOOM_OUT", 0, index);
        }
        event.stopPropagation();

      });


      el.find('span').on('click', (el) => {
        let index = $(el.currentTarget).attr("index")
        let type = $(el.currentTarget).attr("type")
        let disable = $(el.currentTarget).hasClass("playerIcon-disable")
        if (!disable && index == this.selectIndex) {
          console.log(418,'index, type',index, type)
          this.buttonCallBack(index, type)
        } else if (!disable) {
          setTimeout(() => {
            this.buttonCallBack(this.index, type)
          }, 100)
        }
      })
      if (this.autoPlay) {
        this.iconDisplay(index, "player", false)
      }
      this.iconDisplay(index, "voiceStop", false)
      this.iconDisplay(index, "recordStop", false)
    },
    //插入满屏信息层
    appendFullInfoEl(index, icon, color, text) {
      //创建一个loading层级
      let el = null;
      el = $('.parent-wnd').eq(index).find('#player-container-0');
      el.find('.el-loading-mask').remove()
      let loadEl = $('<div class="el-loading-mask" style="background-color: transparent;display: block">' +
        '      <div class="el-loading-spinner">' +
        icon +
        '        <p class="el-loading-text" style="color:' + color + '" >' + text + '</p>' +
        '      </div>' +
        '    </div>')
      el.append(loadEl)
    },
    buttonCallBack(index, type) {
      switch (type) {
        case 'player':
          this.playerVideo(index)
          break
        case 'pause':
          this.stopPlay(index)
          break
        case 'backStart':
          this.backStart(index)
          break
        case 'close':
          this.closePlay(index)
          break
        case 'voiceStart':
          this.talkStart(index)
          break
        case 'voiceStop':
          this.talkStop(index)
          break
        case 'recordStart':
          this.recordStart(index, 'MP4')
          break
        case 'recordStop':
          this.recordStop(index)
          break
        case  'snapshot':
          // 抓图的时候必须使用第一个播放器，其中的原理就是我们为了美化把播放器强行拆分了，导致其实所有的播放器都是一个拆分后的播放器。
          this.capture(0, 'JPEG')
          break
        case  'direction':
          let style = $('.component').eq(index).css('display');
          style = style == 'block' ? 'none' : 'block'
          $('.component').eq(index).css('display', style);
          break
        case  'fullScreen': //全屏
          let event = new Event('dblclick');//创建一个click事件
          console.log(490,'index', index)
            let childNodes = document.getElementsByClassName('parent-wnd').item(index).childNodes;
            let successId = 'player-container-0' ;
            console.log('successId', successId)
            for (let i = 0; i < childNodes.length; i++) {
              let childNodesKey = childNodes.item(i);
              if (childNodesKey.id == successId) {
                childNodesKey.dispatchEvent(event)
                break;
              }
            }
          break
      }
    },
    stopPlay(index) { //停止播放
      this.player.JS_Stop().then(
        () => {
          this.pauseInfo(index)
          //this.playback.rate = 0; console.log('stop realplay success')
          this.iconDisplay(index, "player", true)
          this.iconDisplay(index, "pause", false)
        },
        e => {
          this.iconDisplay(index, "player", false)
          this.iconDisplay(index, "pause", true)
        }
      )
    },
    closePlay(index) {
      this.resourceIds[index] = '';
      console.log('this.resourceIds', this.resourceIds)
      // 关闭视频
      this.player.JS_Stop().then(
        () => {
          this.iconDisplay(index, "player", false)
          this.iconDisplay(index, "pause", false)
        },
        e => {
          this.iconDisplay(index, "player", false)
          this.iconDisplay(index, "pause", false)
        }
      )
      // 关闭 loading
      this.clearFullInfo(index)
      if (this.type) {
        $('#player-container-' + 0).html('');
      } else {
        let childNodes = document.getElementsByClassName('player').item(index).childNodes.item((this.type ? index : 0)).childNodes;
        console.log('childNodes', childNodes)
        let successId = 'player-container-' + 0;
        console.log('successId', successId)
        for (let i = 0; i < childNodes.length; i++) {
          let childNodesKey = childNodes.item(i);
          console.log('childNodesKey', childNodesKey)
          if (childNodesKey.id == successId) {
            childNodesKey.dispatchEvent(event)
            break;
          }
        }
      }
    },
    talkStart(index) { //开启对讲
      let url = this.urls[index].talk
      this.player.JS_StartTalk(url).then(
        () => {
          this.iconDisplay(index, "voiceStart", false)
          this.iconDisplay(index, "voiceStop", true)
        },
        e => {
          this.$message.error("开启语音对讲失败!")
          this.iconDisplay(index, "voiceStart", true)
          this.iconDisplay(index, "voiceStop", false)
        }
      )
    },
    talkStop() { //停止对讲
      this.player.JS_StopTalk().then(
        () => {
          this.iconDisplay(index, "voiceStart", true)
          this.iconDisplay(index, "voiceStop", false)
        },
        e => {
          this.$message.error("无法关闭语音对讲!")
          this.iconDisplay(index, "voiceStart", false)
          this.iconDisplay(index, "voiceStop", true)
        }
      )
    },
    //抓图
    capture(index, imageType) {
      this.player.JS_CapturePicture(index, 'img', imageType).then(
        () => {
          console.log('capture success', imageType)
        },
        e => {
          console.error(e)
          this.$message.error("抓图错误!")
        }
      )
    },
    //开始录像
    recordStart(index, type) {
      console.log(111, index);
      const codeMap = {MP4: 5, PS: 2}
      let fileName = `${moment().format('YYYYMMDDHHmm')}.mp4`
      let typeCode = codeMap[type]
      console.log(2, fileName);
      this.player.JS_StartSaveEx(index, fileName, typeCode).then(
        () => {
          // console.log(3);
          // this.iconDisplay(index, "recordStop", true)
          // this.iconDisplay(index, "recordStart", false)
          // console.log(4);
        },
        e => {
          console.error(e)
          this.$message.error("开启录像失败!")
          this.iconDisplay(index, "recordStop", false)
          this.iconDisplay(index, "recordStart", true)
        }
      )

    },
    //结束录像
    recordStop(index) {
      this.player.JS_StopSave(index).then(
        () => {
          this.iconDisplay(index, "recordStop", false)
          this.iconDisplay(index, "recordStart", true)
        },
        e => {
          console.error(e)
          this.$message.error("无法停止录像失败!")
          this.iconDisplay(index, "recordStop", true)
          this.iconDisplay(index, "recordStart", false)
        }
      )
    },
    // TODO bug 目前多少个窗口执行多少次操作
    /* 云台控制 */
    updateStatus(command, action, index) {
      this.loadingContrll = true;
      // if(vloading){
      //   vloading.style.display="block";
      // }
      getController({
        cameraIndexCode: this.resourceIds[0],
        command: command,
        action: action,
      })
        .then((res) => {
          if (res.code != "success") {
            // this.$message.error(res.msg);
            this.$message.error("摄像头不支持该操作");
          }
          if (action == 1) {
            this.loadingContrll = false;
            // if(vloading){
            //   vloading.style.display="none";
            // }
          }
        })
        .catch((error) => {
          this.$message.error("摄像头不支持该操作");
          this.loadingContrll = false;
          // if(vloading){
          //   vloading.style.display="none";
          // }
        });
      if (action == 0) {
        setTimeout(() => {
          this.updateStatus(command, 1);
        }, 500);
      }
    },
  }
}
</script>

<style scoped lang="scss">
/*引入图标样式*/
@import 'font/iconfont.css';
@import 'font_4072104_am6xd7symi5/iconfont.css';

.ws-player {
  width: 100%;
  height: 100%;

  .player {
    position: relative;
    //background-color: #2ac06d;
    width: 100%;
    height: 100%;

    .playbackSettings {
      position: absolute;
      z-index: 9999;
      background-color: rgba(222, 12, 12, 0.988);
      right: 0;
      bottom: 15%;
      color: #fff;
      width: 50%;
      height: 30%;
    }
  }

  ::v-deep .consolePanel {
    position: absolute;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.4);
    right: 0;
    bottom: 15%;
    color: #fff;
    width: 50%;
    height: 30%;
  }

  ::v-deep .player-controls {
    position: absolute;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.4);
    //background-color: #2ac06d;
    bottom: 0;
    color: white;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
    box-sizing: inherit;
    min-height: 30px;
    max-height: 50px;
    height: 10%;
    width: 100%;
    display: flex !important;
    flex-wrap: nowrap;
    align-items: center;

    > div {
      display: flex !important;
      flex-wrap: nowrap;
      align-items: center;
      height: 100%;
      //border: 1px solid white;
      .playerIcon {
        padding: 0.4em;
        font-size: 1.3em;
      }

      .playerIcon:hover {
        cursor: pointer;
        color: #2ac06d !important;
      }

      .playerIcon-disable {
        color: #a8a9a9 !important;
      }

      .playerIcon-disable:hover {
        cursor: not-allowed;
        color: #a8a9a9 !important;
      }
    }

    > div:first-child {
      width: 70%;
      padding-left: 1em;
    }

    > div:last-child {
      width: 30%;
      display: flex !important;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .vbtn {
    font-size: 30px;
  }

  ::v-deep .pause {
    color: white !important;
    // background-color: rgba(255, 255, 255, 0.3);
    padding: 0.3em;
    border-radius: 5px;
  }

  ::v-deep .component .el-loading-mask {
    border-radius: 50%;

    .el-icon-loading {
      font-size: 20px;
    }

    .el-loading-text {
      font-size: 12px;
    }
  }

  ::v-deep .circle4 {
    margin-top: 10px;
  }

  ::v-deep .circle2 {
    margin-top: 10px;
  }
}

</style>
