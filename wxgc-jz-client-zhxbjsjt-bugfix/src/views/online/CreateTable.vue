<template>
  <div class="liveView">
    <video-player ref="videoPlayer" class="video-player vjs-custom-skin" :playsinline="true" :options="playerOptions"
                  @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" />
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
// import 'video.js/dist-old/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'

export default {
  name: 'live',
  components: {
    videoPlayer
  },
  data () {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          withCredentials: false,
          type: 'application/x-mpegURL',
          src: 'https://hls01open.ys7.com/openlive/0b6b8844c72b4bc2a3f0018ac39f0f8b.hd.m3u8'
        },{
          withCredentials: false,
          type: 'application/x-mpegURL',
          src: 'https://hls01open.ys7.com/openlive/0b6b8844c72b4bc2a3f0018ac39f0f8b.hd.m3u8'
        }],
        hls: true,
        poster: 'https://wxgc-erp.oss-cn-hangzhou.aliyuncs.com/video/video-cover.png', // 你的封面地址
        width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,//时间分割线
          durationDisplay: true,//总时间
          remainingTimeDisplay: false,//剩余播放时间
          progressControl: true, // 进度条
          fullscreenToggle: true // 全屏按钮
        }
      },
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player //自定义播放
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .liveView{
    width: 100%; height: 100%;
  }
</style>
