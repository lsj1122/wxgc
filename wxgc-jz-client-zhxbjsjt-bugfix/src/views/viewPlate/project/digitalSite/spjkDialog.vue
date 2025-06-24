<template>
  <el-dialog
    title="视频监控"
    :visible.sync="spjkVisible"
    width="800"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <div style="height: 500px">
      <HikvisionWsPlayer
        :splitNum="1"
        v-if="playerOptions.sources[0].src"
        :resourceIds="[playerOptions.sources[0].src]"
      />
      <!-- <JGHikvision
        :deviceSerial="deviceSerial"
        ref="videoPlayer"
        class="vjs-custom-skin video-main securityVidoeBox"
        v-if="playerOptions.sources[0].src"
        :url="playerOptions.sources[0].src"
        :cameraIndexCode="playerOptions.sources[0].src"
        :showCtr="videoType != '枪机'"
      >
      </JGHikvision> -->
      <div
      v-else
        style="color: #fff; height: 100%; text-align: center; padding-top: 20px"
      >
        暂无播放的视频地址
      </div>
    </div>
  </el-dialog>
</template>

<script>
import JGHikvision from "@components/JGHikvision";

import { selectTtVideoById } from "@/views/digitalConstructionSite/spjk/api/ttvideo";
import HikvisionWsPlayer from "@/components/HikvisionWsPlayer/index";

export default {
  props: {
    spjkVisible: Boolean,
    deviceItem: Object,
  },
  components: {
    JGHikvision,
    HikvisionWsPlayer,
  },
  data() {
    return {
      deviceSerial: "",
      videoType: "",

      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:7", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        //   techOrder: ['flash', 'html5'], // 兼容顺序'flash', 'html5'
        sources: [
          //   {
          //     withCredentials: false,
          //     type: "rtmp/flv",
          //     src: "rtmp://36.7.153.130:1935/live/EUrl/OdSuLqE",

          //   },
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            src: "",
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
  watch: {
    spjkVisible: function (val) {
      if (!val) return;
      this.playerOptions.sources[0].src = "";
      selectTtVideoById(this.deviceItem.deviceId).then((res) => {
        this.videoType = res.data.videoType;
        this.playerOptions.sources[0].src = res.data.videoUrl;
        this.deviceSerial = res.data.deviceSerial;
      });
    },
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit("update:spjkVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
.video-main {
  width: 100%;
  height: 100%;
  // background: rgb(24, 24, 24);
}
@media screen and(max-width:1024px) {
  .vjs-custom-skin,
  video {
    object-fit: fill;
  }
}
</style>
