<template>
  <div class="videoScreen">
    <div class="video-top" ref="videoTop">
      <i class="ich" @click="changeVideoBox(1)"></i>
      <i class="ich2" @click="changeVideoBox(4)"></i>
      <i class="ich3" @click="changeVideoBox(9)"></i>
      <i class="ich4" @click="changeVideoBox(16)"></i>
      <el-button type="primary" @click="lunbo()" class="ich5"
        >视频轮播</el-button
      >
    </div>
    <div class="video-center">
      <div
        class="videoBox"
        v-for="(item, index) in videobox"
        :key="index"
        :style="{ width: videoWidth, height: videoheight }"
      >
        <div class="videoBox-top"></div>
        <span class="right-close" @click="close(item)"></span>
        <span class="left-title"
          >{{ item.videxObject ? item.videxObject.videoName : "" }}
        </span>
        <!-- <div class="hint">
                 <p>请点击左侧视频列表添加</p>
                 <p>若无法正常显示，请先尝试重启浏览器重试当前操作，<br> 若问题仍然存在，建议检查网络。</p>
               </div> -->
        <div class="videoPlayerBox">
          <div class="videokz" v-if="item.videoType === '球机'">
            <i
              class="el-icon-caret-top"
              @click="controlVideo(item.deviceSerial, item.channelNumber, 0)"
            ></i>
            <i
              class="el-icon-caret-bottom"
              @click="controlVideo(item.deviceSerial, item.channelNumber, 1)"
            ></i>
            <i
              class="el-icon-caret-right"
              @click="controlVideo(item.deviceSerial, item.channelNumber, 3)"
            ></i>
            <i
              class="el-icon-caret-left"
              @click="controlVideo(item.deviceSerial, item.channelNumber, 2)"
            ></i>
            <i
              class="el-icon-zoom-in"
              @click="controlVideo(item.deviceSerial, item.channelNumber, 8)"
            ></i>
            <i
              class="el-icon-zoom-out"
              @click="controlVideo(item.deviceSerial, item.channelNumber, 9)"
            ></i>
          </div>
          <div
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 100%;
              height: 100%;
              transform: translate(-50%, -50%);
            "
          >
            <div class="hint" v-if="playerOptions[index].sources[0].src == ''">
              <p>请点击左侧视频列表添加</p>
              <p>
                若无法正常显示，请先尝试重启浏览器重试当前操作，<br />
                若问题仍然存在，建议检查网络。
              </p>
            </div>
            <div v-else>
              <!-- <video-player
                v-if="item.videxObject.type != 1 ? true : false"
                ref="videoPlayer"
                class="vjs-custom-skin video-main securityVidoeBox"
                :playsinline="true"
                :options="playerOptions[index]"
              /> -->
              <!-- <JGHikvision
              v-if="item.videxObject.type != 1 ? true : false"
               ref="videoPlayer"
               class="vjs-custom-skin video-main securityVidoeBox"
              :id="'vd' + item.videxObject.id"
              :url="playerOptions[index].sources[0].src"
                :deviceSerial='item.deviceSerial'
               :cameraIndexCode="playerOptions[index].sources[0].src"
               :showCtr ="item.videxObject.videoType != '枪机'"
                :className="'vd' + item.videxObject.id"
            >

            </JGHikvision> -->
              <HikvisionWsPlayer :splitNum="1" :index="index" :videoType="item.videxObject ? item.videxObject.videoType : ''" :resourceIds="[playerOptions[index].sources[0].src]"/>
              <!-- <iframe
              v-else
                class="ysopen11"
                ref="ysopen"
                :src="playerOptions[index].sources[0].src"
                allowfullscreen
              >
              </iframe> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var $ = require("jquery");
import JGHikvision from "@components/JGHikvision";
import { videoPlayer } from "vue-video-player";
import "videojs-contrib-hls";
import HikvisionWsPlayer from "@/components/HikvisionWsPlayer/index";

export default {
  components: { videoPlayer, JGHikvision, HikvisionWsPlayer },
  props: [""],
  data() {
    return {
      playerOptions: [],
      videobox: ["", "", "", ""], //循环的数组
      videoboxNumber: "",
      videoWidth: "49%",
      videoheight: "48%",
      urlArr: [],
      numberTime: -1,
      timer: null,
      splitNum: 1,
    };
  },
  created() {
    this.changeVideoBox(4);
  },
  mounted() {},
  computed: {
    player() {
      return this.$refs.videoPlayer.player; //自定义播放
    },
  },
  methods: {
    // 给父组件调用的方法
    playVideo() {
      var _this = this;
      //  console.log('视屏监控：',this.videoLength+1)
      console.log('this.$store.state.video.videoLength',this.$store.state.video.videoLength);

      var arrLength = this.$store.state.video.videoLength; // 这是对象

      console.log(102, arrLength);

      //  this.playerOptions =arrLength.playerOptions
      if (this.videoboxNumber == 1) {
        //单个
        this.videobox = [""];
        this.videobox[0] = arrLength.playerOptions[0];
        this.playerOptions[0] = arrLength.playerOptions[0];
      }
      if (
        this.videoboxNumber == 4 ||
        this.videoboxNumber == 9 ||
        this.videoboxNumber == 16
      ) {
        this.videobox = arrLength.playerOptions;
        this.playerOptions = arrLength.playerOptions;
      }
      return;
      this.$nextTick(function () {
        var player = document
          .getElementsByClassName("ysopen11")[0]
          .contentWindow.document.getElementsByTagName("body")[0];

        // $(".ysopen11").eq(0).contents().find(".panel-top").hide();
        $(".ysopen11").eq(0).contentWindow;
        console.log($(".ysopen11").eq(0).contentWindow);

        console.log(player);
      });

      setTimeout(() => {
        _this.func1();
      }, 20000);
    },
    reloadPlayerOptions(obj){
      this.playerOptions = obj;
      console.log('reloadPlayerOptions',this.playerOptions)
    },
    func1() {
      this.$refs.videoTop.style.background = "pink";
      console.log(150, this.$refs.videoTop);
      console.log(150, this.$refs.videoTop.getElementsByClassName("ich")[0]);

      console.log(150, this.$refs.ysopen[0]);
      console.log(150, this.$refs.ysopen[0].contentWindow);
      console.log(
        150,
        this.$refs.ysopen[0].contentWindow.document.getElementsByTagName(
          "div"
        )[1]
      );

      console.log($(".ysopen11").eq(0).find("body"));
    },
    onPlayerPlay() {
      console.log(110);
    },
    changeVideoBox(n) {
      this.splitNum = Math.sqrt(n);
      // 清空定时器
      clearInterval(this.timer);

      // 先把 要播放几个视屏的值传过去
      this.$store.dispatch("video/changePlayNumber", n);

      this.playerOptions = [];
      for (var i = 0; i < n; i++) {
        // alert(1)
        var Options = {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: true, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:5", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
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
            remainingTimeDisplay: true, //剩余播放时间
            progressControl: true, // 进度条
            fullscreenToggle: true, // 全屏按钮
          },
        };
        // Options.sources[0].src = urlB[i];
        this.playerOptions.push(Options);
        // this.videobox.push(this.videoArr[i])
      }
      if (n == 1) {
        this.videobox = [""];
        //
        this.videoboxNumber = 1;
        this.videoWidth = "99%";
        this.videoheight = "99%";
        // 清空左边list的数据
        this.$emit("closeName", "1"); //1控制 视屏的个数 2 关闭单个视频
      }
      if (n == 4) {
        this.videobox = ["", "", "", ""];
        this.videoboxNumber = 4;
        this.videoWidth = "49%";
        this.videoheight = "48%";
        // 清空左边list的数据
        this.$emit("closeName", "1");
      }
      if (n == 9) {
        this.videobox = ["", "", "", "", "", "", "", "", ""];
        this.videoboxNumber = 9;
        this.videoWidth = "32.2%";
        this.videoheight = "32%";
        // 清空左边list的数据
        this.$emit("closeName", "1");
      }
      if (n == 16) {
        this.videobox = [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ];
        this.videoboxNumber = 16;
        this.videoWidth = "24%";
        this.videoheight = "24%";
        // 清空左边list的数据
        this.$emit("closeName", "1");
      }
    },
    close(item, type) {
      // 关闭视频窗口
      console.log(190, item);
      console.log('this.playerOptions',this.playerOptions);
      this.$store.dispatch("video/getCloseName", item);
      this.$emit("closeName", "2");
    },
    lunbo: function () {
      var _this = this;
      //清空数据
      this.urlArr = [];
      clearInterval(_this.timer);
      _this.numberTime = -1;
      this.$emit("closeName", "1"); //1控制 视屏的个数 2 关闭单个视频
      // console.log(11,this.$store.state.video.videoList)
      // 给视频增加 active 类

      var videoListA = this.$store.state.video.videoList;
      let length = videoListA.length;
      let allVideoNum = 0;
      for (let i = 0; i < length; i++) {
        if (videoListA[i] == null || videoListA[i] == undefined){
          continue
        }
        let item = videoListA[i].videoList;
        allVideoNum += item.length;
      }


      for (var i = 0; i < videoListA.length; i++) {
        if (videoListA[i].videoList.length > 0) {
          console.log(videoListA[i].videoList);
          this.urlArr.push(...videoListA[i].videoList);
        }
      }
      // 获得数据
      console.log('this.urlArr', this.urlArr);
      console.log('this.playerOptions', this.playerOptions);
      console.log('this.videobox', this.videobox);

      // 刚点击视屏轮播
      for (var a = 0; a < Number(_this.videoboxNumber) && a < allVideoNum; a++) {
        _this.numberTime = Number(_this.numberTime) + 1;
        if (_this.numberTime >= _this.urlArr.length) {
          _this.numberTime = 0;
        }
        //判断 type

        _this.playerOptions[a].sources[0].src =
          _this.urlArr[_this.numberTime].videoUrl;
        _this.playerOptions[a].videxObject = _this.urlArr[_this.numberTime];
      }
      _this.videobox = _this.playerOptions;

      // 回调填充 active
      console.log(' _this.playerOption', _this.playerOptions)
      this.$emit("fillLunBoActive", _this.playerOptions);

      //开启定时器
      // _this.timer = setInterval(function () {
      //   for (var a = 0; a < Number(_this.videoboxNumber); a++) {
      //     _this.numberTime = Number(_this.numberTime) + 1;
      //     if (_this.numberTime >= _this.urlArr.length) {
      //       _this.numberTime = 0;
      //     }
      //     //判断 type
      //
      //     _this.playerOptions[a].sources[0].src =
      //       _this.urlArr[_this.numberTime].videoUrl;
      //     _this.playerOptions[a].videxObject = _this.urlArr[_this.numberTime];
      //   }
      //   _this.videobox = _this.playerOptions;
      // }, 60000);
    },
  },
};
</script>



<style lang="less" scoped>
.video-player {
  width: 100%;
  height: 100%;
  /deep/.video-js {
    //  background: none;
    height: 110%;
    //  border: 1px solid #5BBBFF;
    border-top: 0;
    //  box-sizing: border-box;
  }
  /deep/.vjs-tech {
    // background-color:pink;
  }
  /deep/.vjs_video_3962 {
    width: 100%;
  }
  /deep/.vjs-control-bar {
    // margin-bottom: 10px;
  }
  /deep/.vjs-volume-bar {
    margin: 0px;
    margin-top: -20px;
  }
  // /deep/#vjs_video_3{
  //      background: none;
  //      height: 100%;
  // }
}
.videoScreen {
  height: 100%;
  // min-height: 600px;
}
.video-top {
  padding-top: 5px;
  position: relative;
  margin-bottom: 20px;
  .ich {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background: url("../../../../../assets/compent/one.png") no-repeat;
    background-size: 100% 100%;
  }
  .ich2 {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background: url("../../../../../assets/compent/four.png") no-repeat;
    background-size: 100% 100%;
  }
  .ich3 {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background: url("../../../../../assets/compent/nine.png") no-repeat;
    background-size: 100% 100%;
  }
  .ich4 {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("../../../../../assets/compent/sixteen.png") no-repeat;
    background-size: 100% 100%;
  }
  .ich5 {
    position: absolute;
    top: 5px;
    right: 1%;
  }
}
.video-center {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  .videoBox {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 1%;
    margin-bottom: 1%;
    width: 49%;
    height: 48%;
    // background: url('../../../../../assets/compent/video.png') no-repeat ;
    // background-size:100% 100%;
    .videoBox-top {
      width: 100%;
      height: 40px;
      background: url("../../../../../assets/compent/video2.png") no-repeat;
      background-size: 100% 100%;
    }
    .right-close {
      display: inline-block;
      // background-color: #fff;
      cursor: pointer;
      width: 6%;
      height: 25px;
      position: absolute;
      top: 10px;
      right: 0px;
    }
    .left-title {
      display: inline-block;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      position: absolute;
      top: 10px;
      left: 7%;
    }
    .hint {
      // display: flex;
      // flex-direction: column;
      // align-content: center;
      p:nth-child(1) {
        width: 100%;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
      p:nth-child(2) {
        width: 100%;
        height: 46px;
        text-align: center;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;
        opacity: 0.3;
      }
    }
  }
}

.videoPlayerBox {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #5bbbff;
  overflow: auto;
  div {
    height: 100%;
  }
  .videokz {
    height: 30px;
    position: absolute;
    left: 15px;
    top: 18px;
    z-index: 999;
    display: flex;
    i {
      margin-right: 10px;
      padding: 5px;
      background: #d7dee49e;
      font-size: 20px;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}

iframe {
  width: 100%;
  height: 100% !important;
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
</style>
<style lang="less">
/deep/.panel-top {
  background: none !important;
  height: 10px !important;
}
</style>

