<template>
  <div class="liveView"
       v-loading="loading"
       element-loading-text="视频地址加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <video-player v-if="videoVisible" class="vjs-custom-skin"
                  ref="videoPlayer"
                  :options="playerOptions"
                  @ready="onPlayerReadied"
                  @timeupdate="onTimeupdate"
                  :playsinline="playsinline">
    </video-player>
    <div class="errorMsg"  v-if="errorMsg">
      <div>{{errorMsg}}</div>
    </div>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  // import 'video.js/dist-old/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  import 'videojs-contrib-hls'
  import {getVideoUrl} from "@/views/hikvision/api/hikvision";

  //npm install vue-video-player --save

  export default {
    name: 'live',
    components: {
      videoPlayer
    },
    props:{
      url:String
    },
    data () {
      return {
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
          overNative: true,
          autoplay: true,
          controls: true,
          techOrder: ['html5'],
          sourceOrder: true,
          flash: {
            hls: { withCredentials: false }
          },
          html5: { hls: { withCredentials: false } },
          sources: [
            {
              withCredentials: false,
              type: 'application/x-mpegURL',
              src: this.getUrl
            }
          ]
        }
      }
    },
    mounted() {
    },
    created() {
      this.errorMsg=null;
      this.initUrl();
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
      initUrl(){
        if(this.url&&this.url.includes("http")){
          this.playerOptions.sources[0].src=this.url;
          this.videoVisible=true;
          this.loading=false;
        }else if(this.url){
          getVideoUrl(this.url).then(res=>{
            if(res.code=="success"){
              this.playerOptions.sources[0].src=res.data;
              this.videoVisible=true;

            }else{
              this.errorMsg=res.msg;
            }
            this.loading=false;
          }).catch(err=>{
            this.errorMsg="服务器异常无法获取到视频播放地址!";
            this.loading=false;
          });
        }else{
          this.errorMsg="无效的视频播放地址!";
        }
      },
      onPlayerReadied () {
        if (!this.initialized) {
          this.initialized = true
          this.currentTech = this.player.techName_
        }
      },
      // record current time
      onTimeupdate (e) {
        console.log('currentTime', e.cache_.currentTime)
      },
    }
  }
</script>

<style scoped lang="scss">
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
  }
</style>
