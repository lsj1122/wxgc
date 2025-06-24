<template>
  <div style="height: 100%; width: 100%">
    <div class="videoBox" v-show="showBox != null">
      <video-player
        v-if="type != 1 ? true : false"
        x5-video-player-type
        class="vjs-custom-skin video-player"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
      ></video-player>
      <iframe
        v-else
        class="ysopen"
        :src="iframeUrl"
        allowfullscreen
      >
      </iframe>
    </div>
    <div v-show="showBox == null">
      <p style="">暂无视屏内容</p>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "videojs-contrib-hls";

export default {
  components: { videoPlayer },
  props: [],
  data() {
    return {
      type:0,  // 0 是视频流 ，1是 可在页面播放的
      iframeUrl:null,
      showBox:null,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:7", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            src: null,
          },
        ],
        hls: true,
        // poster:
        //   "https://wxgc-erp.oss-cn-hangzhou.aliyuncs.com/video/video-cover.png", // 你的封面地址
        width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, //时间分割线
          durationDisplay: true, //总时间
          remainingTimeDisplay: false, //剩余播放时间
          progressControl: true, // 进度条
          fullscreenToggle: true, // 全屏按钮
        },
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    loadPageData(row) {
      console.log(62, row);
      this.showBox= row.name
      if(row.name.indexOf("/h5/iframe_se") =='-1'){ //0 是视频流
           this.type =0
            this.playerOptions.sources[0].src = row.name;
      }else{
         this.type =1  //1是 可在页面播放的
         this.iframeUrl =row.name
      }
     
    },
  },
};
</script>
<style lang="less" scoped>
.videoBox {
  height: 90%;
  width: 100%;
  text-align: center;
  min-height: 500px;
}


iframe {
  width: 100%;
  height: 500px !important;
  padding: 0;
  margin: 0;
}
#wrap {
  width: 100%;
  height: 100% !important;
}
iframe {
  border: none !important;
}
.vjs-custom-skin {
  height: 90% !important;
}
</style>
