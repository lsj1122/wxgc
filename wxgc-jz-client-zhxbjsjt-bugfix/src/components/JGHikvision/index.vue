<template>
  <div :class="'liveView '+vid"
       v-loading="loading"
       element-loading-text="视频地址加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.6)"
       @dblclick="fullScreen"
  >
    <video-player v-if="videoVisible" class="vjs-custom-skin"
                  ref="videoPlayer"
                  :options="playerOptions"
                  @ready="onPlayerReadied"
                  @timeupdate="onTimeupdate"
                @pause="onPlayerPause($event)"
                @statechanged="playerStateChanged($event)"
                
                  :playsinline="playsinline">
    </video-player>
    <div class="errorMsg"  v-if="errorMsg">
      <div>{{errorMsg}}</div>
    </div>

    <!-- 截图预览   -->
    <el-dialog
      title="拍照成功"
      :visible.sync="showPreview"
      append-to-body
      width="50%">

      <img :src="previewImg" width="100%" height="100%">

      <span slot="footer" class="dialog-footer">
          <el-button @click="showPreview = false">取 消</el-button>
          <el-button type="primary" @click="downloadImg">下载</el-button>
      </span>
    </el-dialog>

<!--
这种无法在放大时候出现 放弃 保留这里
-->

<!--    <div class="component" v-if="showContr"
         v-loading="loadingContrll"
         element-loading-text="执行中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
         element-loading-customClass="videoCtr"
         style="z-index: 99999"
    >
      <ul class="clearfix">
        <li class="circle4" title="焦距变大" @click="updateStatus('ZOOM_IN',0)"><i class="el-icon-circle-plus"></i></li>
        <li class="circle2" title="焦距变小" @click="updateStatus('ZOOM_OUT',0)"><i class="el-icon-remove"></i></li>
      </ul>
      <div class="cn-wrapper opened-nav" id="cn-wrapper">
        <ul>
          <li><a href="#"  @click="updateStatus('UP',0)" title="向上"><span><i class="el-icon-caret-top"></i></span></a></li>
          <li><a href="#" @click="updateStatus('RIGHT',0)" title="向右"><span><i class="el-icon-caret-top"></i></span></a></li>
          <li><a href="#" @click="updateStatus('DOWN',0)"  title="向下"><span><i class="el-icon-caret-top"></i></span></a></li>
          <li><a href="#" @click="updateStatus('LEFT',0)"  title="向左"><span><i class="el-icon-caret-top"></i></span></a></li>
        </ul>
      </div>
    </div>-->


  </div>
</template>

<script>
import {getVideoUrl,updateVideoStatus} from "./api/hikvision";
import html2canvas from 'html2canvas'
//云台操作css
import  './api/controller.css'
import moment from 'moment';
import $ from 'jquery' //在需要使用的页面中

export default {
  name: 'live',
  components: {
    html2canvas,
  },
  props:{
    url:String,
    cameraIndexCode:String,
     className:{type:String,default:""},
    showCtr:{type:Boolean,default:false}
  },
  data () {
    return {
      fullScreenB:true,
      vid:new Date().getTime(),
      previewImg:null,
      blodImg:null,
      showPreview:false,
      showContr:false,
      streamType:0,
      apiPrefix:process.env.VUE_APP_VIDEO_API,
      loading:true,
      videoVisible:false,
      initialized: false,
      errorMsg:null,
      currentTech: '',
      streams: {
        rtmp: '',
        hls: ''
      },
      playerOptions: {
        language: 'zh-CN',
        overNative: true,
        preload: 'auto', //视频预加载
        autoplay: true, //如果true,浏览器准备好时开始回放。
        controls: true, //控制条
        //aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        //fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        notSupportedMessage: '当前视频网络环境不稳定,无法支持此格式的播放!', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        techOrder: ['html5'],
        sourceOrder: true,
        flash: {
          hls: { withCredentials: false }
        },
        html5: { hls: { withCredentials: false } },
        //poster: "http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg", //你的封面地址
        sources: [
          {
            withCredentials: false,
            type: 'application/x-mpegURL',
            src: this.url
          },
        ],
      },
      loadingContrll:false,
      checkTT:null,
    }
  },
 
  created() {
      this.vid = this.className + this.vid
    this.errorMsg=null;
    this.initUrl();
  },
   mounted() {

  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    currentStream () {
      return this.currentTech === 'Flash' ? 'RTMP' : 'HLS'
    },
    playsinline () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      // x5内核
      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        return false
      } else {
        // ios端
        return true
      }
    }
  },
  methods: {
    // 双击全屏
    fullScreen() {
         const player = this.$refs.videoPlayer.player
         if(!player.isFullscreen()){
        player.requestFullscreen()//调用全屏api方法
        player.isFullscreen(true)
        player.play()
         }else{
            // document.webkitCancelFullScreen();//退出全屏
         }
        
  
      },

//播放状态改变回调

 playerStateChanged(playerCurrentState) {
  var _this=this
  // console.log('player current update state', playerCurrentState)
 
  if(playerCurrentState.error ){
     // 样式修改
  document.getElementsByClassName(_this.vid)[0].getElementsByClassName('vjs-modal-dialog')[0].style.display ='none';
  document.getElementsByClassName(_this.vid)[0].getElementsByClassName('vjs-big-play-button')[0].style.display ='none';
  document.getElementsByClassName(_this.vid)[0].getElementsByClassName('vjs-modal-dialog-content')[0].style.display ='none';

    console.log('player current update state', playerCurrentState)
     _this.$refs.videoPlayer.player.pause() // 暂停
   setTimeout(function(){
    _this.$refs.videoPlayer.player.play() // 播放
   },25000)
   setTimeout(function(){
    //  _this.playerOptions.sources[0].src =''
  //      document.getElementsByClassName(_this.vid)[0].getElementsByClassName('vjs-modal-dialog')[0].style.display ='none';
  // document.getElementsByClassName(_this.vid)[0].getElementsByClassName('vjs-big-play-button')[0].style.display ='none';
  // document.getElementsByClassName(_this.vid)[0].getElementsByClassName('vjs-modal-dialog-content')[0].style.display ='none';
    //  _this.initUrl();
    _this.$refs.videoPlayer.player.src(_this.playerOptions.sources[0].src) // 重置进度条

    },30000)
  }

 },
 // 暂停回调
 onPlayerPause(player) {


 },
    initVbtn(){
      let that=this;
      //创建拍照按钮
      let takePhtoBtn = document.createElement('div');
      takePhtoBtn.innerHTML = '<button class="vjs-control jgBtn takePhoto"  title="拍照"><i class="el-icon-camera-solid vbtn"></i></button>';

      //创建方向按钮
      let directionBtn = document.createElement('div');
      directionBtn.innerHTML = '<button class="vjs-control jgBtn directionBtn"  title="方向控制"><i class="el-icon-help vbtn"></i></button>';

      //创建清晰度切换
      let byteBtn = document.createElement('div');
      byteBtn.innerHTML='<button class="vjs-control byteBtn" >' +
        '<select style="-webkit-appearance: none;background-color: silver;border-radius: 0px" >' +
        /*'onchange="resolutionChange(this.options[this.options.selectedIndex].text)">' +*/
        '<option value ="high" style="color: white" '+(this.streamType==0?'selected':'')+' >主码流</option>' +
        '<option value ="fluent"'+(this.streamType==1?'selected':'')+'>子码流</option>' +
        '</select></button>';


      //创建控制
      let ctrBtn = document.createElement('div');
       ctrBtn.innerHTML='<div class="component" style="display: none" >' +
         '<div class="vloading" style="display: none"><i class="el-icon-loading"></i><p>执行中</p></div>'+
        '      <ul class="clearfix">' +
        '        <li class="circle4 updateStatus" title="焦距变大" data="ZOOM_IN"><i class="el-icon-circle-plus"></i></li>' +
        '        <li class="circle2 updateStatus" title="焦距变小" data="ZOOM_OUT"><i class="el-icon-remove"></i></li>' +
        '      </ul>' +
        '      <div class="cn-wrapper opened-nav" id="cn-wrapper">' +
        '        <ul>' +
        '          <li><a href="#"  data="UP"    class="updateStatus" title="向上"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '          <li><a href="#"  data="RIGHT" class="updateStatus" title="向右"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '          <li><a href="#"  data="DOWN"  class="updateStatus"  title="向下"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '          <li><a href="#"  data="LEFT"  class="updateStatus"  title="向左"><span><i class="el-icon-caret-top"></i></span></a></li>' +
        '        </ul>' +
        '      </div>' +
        '    </div>';

      let insertBeforeNode = document.getElementsByClassName(that.vid)[0].getElementsByClassName('vjs-fullscreen-control')[0];
      let controlBar = document.getElementsByClassName(that.vid)[0].getElementsByClassName('vjs-control-bar')[0];

      controlBar.insertBefore(takePhtoBtn,insertBeforeNode);
      if(this.showCtr) {
        controlBar.insertBefore(directionBtn, insertBeforeNode);
        controlBar.insertBefore(ctrBtn, insertBeforeNode);
        //方向按钮
        document.getElementsByClassName(that.vid)[0].querySelector(".directionBtn").addEventListener("click",(event)=>{
          that.showContr=!that.showContr;
          let ctr=document.getElementsByClassName(that.vid)[0].querySelector(".component");
          if(ctr.style.display=="none"){
            ctr.style.display="block";
          }else{
            ctr.style.display="none";
          }
        })
        let btns=document.getElementsByClassName(that.vid)[0].getElementsByClassName("updateStatus");
        for(let i =0 ;i<btns.length;i++){
          btns[i].addEventListener("click",(event)=>{
            let el =event.target.tagName
            let data=null;
            if(el=='I'){
              data=event.target.parentNode.parentNode.getAttribute("data")||event.target.parentNode.getAttribute("data");
            }else if(el=='SPAN'){
              data=event.target.parentNode.getAttribute("data");
            }else if(el=='LI'){
              data=event.target.getAttribute("data");
            }
            let vloading=document.getElementsByClassName(that.vid)[0].querySelector(".vloading")
            that.updateStatus(data,0,vloading)
          })
        }
      }
      //拍照
      document.getElementsByClassName(that.vid)[0].querySelector(".takePhoto").addEventListener("click",(event)=>{
        this.previewImg=null;
        this.blodImg=null;
        that.getVideoPic();
      })
      if(!(this.url&&(this.url.includes("http")||this.url.includes("https"))||this.url.includes(this.apiPrefix))){
        controlBar.insertBefore(byteBtn, insertBeforeNode);
        //切换清晰度
        document.getElementsByClassName(that.vid)[0].querySelector(".byteBtn").addEventListener("change",(event)=>{
          console.log('改变了主码子码')
          let rs=event.target.value;
          this.streamType=rs=='high'?0:1
          this.loadVideo(this.streamType)
        })
      }
    },
    initUrl(){

      if(this.url&&(this.url.includes("http")||this.url.includes("https"))||this.url.includes(this.apiPrefix)){
        this.playerOptions.sources[0].src=this.url;
        this.videoVisible=true;
        this.loading=false;

      }else if(this.url){
        this.loadVideo(this.streamType)
      }else{
        this.errorMsg="无效的视频播放地址!";
      }
    },
    loadVideo(streamType,ck){
      let loc=window.location+"";
      let that=this;
      console.log(this.url)
      console.log(loc.includes("https"))
      console.log(streamType)
      getVideoUrl(this.url,loc.includes("https"),streamType).then(res=>{
        if(res.code=="success"){
          that.playerOptions.sources[0].src=res.data;
          that.videoVisible=true;
          if(that.checkTT!=null){
            clearInterval(that.checkTT);
          }
          if(ck==null){
            this.checkTT=setInterval(()=>{
              if(document.getElementsByClassName(that.vid)[0]){
                let obj=document.getElementsByClassName(that.vid)[0].querySelector(".vjs-modal-dialog-content");
                if(obj){
                  if(obj.innerHTML.includes("格式不支持")){
                    that.streamType=streamType==0?1:0;
                    that.loadVideo(that.streamType,'no');
                  }
                }
              }
            },1000)
          }
        }else{
          this.errorMsg=res.msg;
        }
        this.loading=false;
      }).catch(err=>{
        this.errorMsg="服务器异常无法获取到视频播放地址!";
        this.loading=false;
      });
    },
    onPlayerReadied () {
      if (!this.initialized) {
        this.initialized = true
        this.currentTech = this.player.techName_
      }
      this.initVbtn();
    },
    // record current time
    onTimeupdate (e) {
      // console.log('currentTime', e.cache_.currentTime)
    },
    onPlayerEnded(event){
    },
    //视频截图
    getVideoPic() {
      let video = document.getElementsByClassName(this.vid)[0].getElementsByClassName('vjs-tech')[0]
      let canvas = document.createElement('canvas')
      let w = window.innerWidth
      let h = window.innerWidth / 16 * 9
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, w, h)
      ctx.drawImage(video, 0, 0, w, h);
      //用于预览
      this.previewImg=canvas.toDataURL('image/png')
      canvas.toBlob((blob)=>{
        this.blodImg=blob;
      },'image/png',1)
      this.showPreview=true;
    },
    downloadImg(){
      let fname=moment().format("YYYY-MM-DD HH:mm:ss");
      fname+="_"+new Date().getTime()+".png"
      this.downloadBlobFile(fname, this.blodImg);
    },
    updateStatus(command,action,vloading){
      this.loadingContrll=true;
      if(vloading){
        vloading.style.display="block";
      }
      updateVideoStatus({cameraIndexCode:this.cameraIndexCode,command:command,action:action}).then(res=>{
        if(res.code!="success"){
          this.$message.error(res.msg);
        }
        if(action==1){
          this.loadingContrll=false;
          if(vloading){
            vloading.style.display="none";
          }
        }
      }).catch(error=>{
        this.loadingContrll=false;
        if(vloading){
          vloading.style.display="none";
        }
      })
      if(action==0){
        setTimeout(()=>{
          this.updateStatus(command,1,vloading)
        },500)
      }

    },
    downloadBlobFile(fileName, blob) {
      let aLink = document.createElement('a');
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
    },
  }
}
</script>

<style scoped lang="scss">
 ::v-deep.video-js ::v-deep .vjs-modal-dialog{
    display: none !important;
 }
 .vjs-custom-skin ::v-deep .vjs-modal-dialog{
    display: none !important;
 }
 .vjs-custom-skin ::v-deep .vjs-big-play-button {
    display: none !important;
 }
 ::v-deep .vjs-modal-dialog-content{
    display: none !important;
 }

.liveView{
  position: relative;
  width: 100%; height: 100%;
  ::v-deep .video-player{
    height: 100%;
    >div{
      height: 100%;
    }
  }
  .errorMsg{
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    >div{
      position: absolute;
      width: 100%;
      text-align: center;
      line-height: 30px;
      top: 43%;
      color:white;
    }
  }
  .vbtn{
    font-size: 30px;
  }
  ::v-deep .component .el-loading-mask{
    border-radius: 50%;
    .el-icon-loading{
      font-size: 20px;
    }
    .el-loading-text{
      font-size: 12px;
    }
  }
}



</style>


