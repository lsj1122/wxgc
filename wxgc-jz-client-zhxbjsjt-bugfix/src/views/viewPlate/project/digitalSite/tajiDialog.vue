<template>
  <el-dialog
    :close-on-click-modal="false"
    title="塔机信息"
    :visible.sync="tj_visib"
    :modal-append-to-body="false"
    width="60%"
    :before-close="handleClose"
  >
    <div class="chartsBox">
      <div class="taji-dia-top">
        <div>
          <div class="taji-text-con">
            <div>
              <h3>塔机信息</h3>
              <ul>
                <li>
                  <!-- 设备名称：<span>{{ device.ttTj.machineName }}</span> -->
                </li>
                <li>
                  设备编号：<span>{{ device.ttTj.machineNumber }}</span>
                </li>
                <li>
                  产权备案号：<span>{{ device.ttTj.propertyNumber }}</span>
                </li>
                <li>
                  安装单位：<span>{{ device.ttTj.installationUnit }}</span>
                </li>
              </ul>
              <h3>运行状态</h3>
              <ul>
                <li>
                  工作时长：<span>{{ device.workTime }}</span>
                </li>
                <li>
                  设备状态：<span>{{
                    device.ttTj.machineState == 0
                      ? "在线"
                      : device.ttTj.machineState == 1
                      ? "离线"
                      : ""
                  }}</span>
                </li>
                <li>
                  今日告警：<span>{{ runData[3].value }}</span>
                </li>
              </ul>
            </div>
            <img
              src="@/assets/taji-dong.gif"
              class="tajidongtu"
              alt=""
              srcset=""
            />
          </div>
          <div class="site-chart-item" style="height: 200px; margin-top: 100px">
            <div class="canshu-item">
              <h3>高度(m)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.heightValue:'' }}</div>
       
            </div>
            <div class="canshu-item">
              <h3>幅度(m)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.rangeValue:'' }}</div>
            </div>
            <div class="canshu-item">
              <h3>回转(°)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.rotationValue:'' }}</div>
            </div>

            <div class="canshu-item">
              <h3>起重量(吨)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.weightValue:'' }}</div>
            </div>

            <div class="canshu-item">
              <h3>风速(m/s)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.windSpeed:'' }}</div>
            </div>
            <div class="canshu-item">
              <h3>倾角(°)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.dipAngle:'' }}</div>
            </div>

            <div class="canshu-item">
              <h3>重量百分比(%)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.weightPercent:'' }}</div>
            </div>

            <div class="canshu-item">
              <h3>力矩百分比(%)：</h3>
              <div class="taji-jindu">{{device.tjWorkData ? device.tjWorkData.momentPercent:'' }}</div>
            </div>
          </div>
        </div>

        <div class="taji-dia-right">
          <div class="site-chart-item" id="tajishebei">
            <!-- <video id="jiankongVideo" :src="device.video1" autoplay="autoplay" class="video-main"></video> -->
            <!-- <video-player
              ref="videoPlayer"
              class="vjs-custom-skin video-main securityVidoeBox"
              :playsinline="true"
              :options="playerOptions"
            /> -->
            <template>
              <el-tabs
                v-model="activeName"
                type="card"
                size="mini"
                @tab-click="handleActiveName"
              >
                <el-tab-pane label="吊钩可视化" name="吊钩可视化"></el-tab-pane>
                <el-tab-pane label="驾驶室监控" name="驾驶室监控"></el-tab-pane>
              </el-tabs>
            </template>
                <HikvisionWsPlayer
              v-if="playerOptions.sources[0].src && activeName == '吊钩可视化'"
              :splitNum="1"
              :key="activeName"
              :resourceIds="[playerOptions.sources[0].src]"
            />
            <HikvisionWsPlayer
              v-else-if="playerOptions.sources[1].src && activeName == '驾驶室监控'"
              :splitNum="1"
              :key="activeName"
              :resourceIds="[playerOptions.sources[1].src]"
            />
            <div
              v-else
              style="
                color: #fff;
                height: 100%;
                text-align: center;
                padding-top: 20px;
              "
            >
              暂无播放的视频地址
            </div>
          </div>
          <div class="sijixinxi" style="height: 200px">
            <img v-if="device.ttTj.picture2"
              :src="device.ttTj.picture2"
              alt
              class="sijihead"
              style="margin: 20px"
            />
            <img v-else 
            :src="imgpic" alt="" class="sijihead"
              style="margin: 20px">
            <div>
              <h3>司机信息</h3>
              <p class="siji-info">
                司机姓名：{{ device.ttTj.name?device.ttTj.name:'' }} <br />手机号：{{
                  device.ttTj.phone?device.ttTj.phone:''
                }}
                <br />特种作业证：{{ device.ttTj.specialCard?device.ttTj.specialCard:'' }} <br />更新时间：{{
                device.ttTj.admissionTime?device.ttTj.admissionTime:''
                }}
              </p>
                <img v-if="device.ttTj.picture1"
              :src="device.ttTj.picture1"
              alt
              class="sijihead"
             
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { videoPlayer } from "vue-video-player";
import JGHikvision from "@components/JGHikvision";
import "videojs-contrib-hls";

import { selectAllInfo } from "@/views/digitalConstructionSite/tj/api/tttj";
import HikvisionWsPlayer from "@/components/HikvisionWsPlayer/index";
// import {
//   selectTjCount,
//   selectTjWorkDataByNum,
// } from "@/views/digitalConstructionSite/tj/api/tjworkdata";

export default {
  components: { JGHikvision ,HikvisionWsPlayer},
  props: ["tj_visib", "deviceObj"],
  data() {
    return {
      imgpic: require("@/assets/avatar.png"),
      activeName: "吊钩可视化",
      activeIndex: 0,
      device: {
        tjAttendanceData: null,
        tjWorkData: {},
        ttTj: {},
        waringCount: 0,
        workTime: null,
      },
      workData: {},
      runData: [{ value: 3 }, { value: 11 }, { value: 175 }, { value: 0 }],
      data: [],
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
            src: "",
          },
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
    tj_visib: function (val) {
      if (val) {
           this.$nextTick(function(){
             this.getDetdata();
           })
      }
    },
  },
  methods: {
    getDetdata() {
      this.playerOptions.sources[0].src = null;
      this.playerOptions.sources[1].src = null;
      selectAllInfo(this.deviceObj.deviceNumber).then((res) => {
        if (res.code == "success") {
          console.log(8888,res);
          this.device = res.data || {};
          this.playerOptions.sources[0].src = this.device.ttTj.cliverVideo;
          this.playerOptions.sources[1].src = this.device.ttTj.towerCraneVideo;


          console.log(288, this.device)
          // this.$nextTick(()=>{
          //   let player = new EZUIPlayer('jiankongVideo');
          //   player.play();
          // })
        }
      });
    },
    handleClose() {
      this.$emit("update:tj_visib", false);
    },
    handleActiveName({ index }) {
      // 获取点击的索引index
      this.activeIndex = parseInt(index);
      console.log(this.activeIndex);
    },
  },
};
</script>

<style lang="less" scoped>
.taji-dia-right {
  display: flex;
  flex-direction: column;
}

.sijixinxi {
  margin-top: 100px;
  color: #e4ebee;
  display: flex;

  h3 {
    color: rgb(146, 168, 187);
  }

  p {
    line-height: 26px;
  }

  img {
    // margin-left: 100px;
    height: 130px;
  }
}

.taji-text-con {
  display: flex;
  justify-content: space-between;

  h3 {
    color: rgb(146, 168, 187);
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      color: aliceblue;
      padding: 2px 0;
    }
  }

  .tajidongtu {
    width: 50%;
    height: 100%;
    margin-right: 20px;
  }
}

.chartsBox {
  height: 620px;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;

  .site-chart-item {
    .sijihead {
      height: 130px;
      width: 90px;
    }

    video {
      height: 100%;
      width: 95%;
      background: rgb(32, 32, 32);
      object-fit: fill;
    }

    .siji-info {
      line-height: 24px;
      color: #c3e9fc;
    }

    .canshu-item {
      height: 90px;
      width: 22%;
      border: 1px solid #2287ef;
      float: left;
      border-radius: 8px;
      font-size: 14px;
      color: #c3e9fc;
      margin: 10px 10px 0 0;
      background: #0a2c56;

      h3 {
        width: 100%;
        margin: 0 15px;
        font-size: 14px;
        padding: 7px 0;
        color: aliceblue;
        font-weight: 400;
      }

      .taji-jindu {
        height: 24px;
        border-radius: 3px;
        margin: 0 10px;
        background: #4f768a;
      }

      span {
        padding: 8px 11px;
        display: block;
        display: flex;
        justify-content: space-between;
      }
    }

    margin-bottom: 15px;
    height: 270px;
    width: 500px;
    float: left;
  }
}

.taji-dia-top {
  display: flex;
  justify-content: space-between;
}

.jiankong-zhuangtai {
  h3 {
    color: rgb(146, 168, 187);
  }

  > div {
    span {
      color: rgb(238, 238, 238);
      padding: 15px 12px;
      border-right: 1px solid #2c4b6f;
    }

    a {
      display: inline-block;
      padding: 1px;
      border-radius: 50%;
      vertical-align: bottom;
      border: 1px solid #e4ebee;

      &::before {
        content: "";
        display: block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: rgb(13, 168, 104);
      }
    }

    a.error {
      &::before {
        background: rgb(216, 28, 22);
      }
    }
  }
}

::v-deep .el-tabs {
  .el-tabs__item {
    color: #ffffff;
  }

  .el-tabs__item.is-active {
    color: #0a94ff;
    border-bottom-color: #909090;
  }

  .el-tabs__nav {
    border: #909090 1px solid;
    border-bottom: none;
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__header {
    border-bottom: #909090 1px solid;
  }
}
</style>
