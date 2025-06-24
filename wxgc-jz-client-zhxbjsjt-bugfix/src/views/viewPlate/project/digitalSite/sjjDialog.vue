<template>
  <el-dialog
    title="升降机信息"
    :visible.sync="tdDialogvisib"
    width="1200px"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <div class="chartsBox">
      <div class="site-chart-item sijiinfo-div">
        <h5 class="deviceNo-title">编号：{{ device.tdAttendanceData?device.tdAttendanceData.machineNum:''  }}</h5>
        <img src="../../../../assets/avatar.png" alt class="sijihead" />
        <p class="siji-info">
                司机姓名：{{ device.tdAttendanceData?device.tdAttendanceData.userName:'' }} <br />身份证号：{{
                  device.tdAttendanceData?device.tdAttendanceData.idCard:''
                }}
                <br />操作证号：{{ device.tdAttendanceData?device.tdAttendanceData.workPermitNo:'' }} <br />打卡时间：{{
                device.tdAttendanceData?device.tdAttendanceData.inTime:''
                }}
              </p>
      </div>
      <div class="site-chart-item" id="tajishebei">
        <!-- <video-player
              ref="videoPlayer"
              class="vjs-custom-skin video-main securityVidoeBox"
              :playsinline="true"
               :options="playerOptions"
            /> -->
        <JGHikvision
          ref="videoPlayer"
          class="vjs-custom-skin video-main securityVidoeBox"
          v-if="playerOptions.sources[0].src"
          :url="playerOptions.sources[0].src"
          :deviceSerial="deviceSerial"
        >
        </JGHikvision>
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
      <div class="site-chart-item">
        <div class="canshu-item">
          <h3>电梯实时高度</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.elevatorCurrentHeight:''}} m</span>
        </div>
        <div class="canshu-item">
          <h3>电梯实时楼层</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.elevatorCurrentFloor:''}}</span>
        </div>
        <div class="canshu-item">
          <h3>实时重量</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.weightValue:'' }} Kg</span>
        </div>
        <div class="canshu-item">
          <h3>实时速度</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.speedValue:''}} m/s</span>
        </div>
        <div class="canshu-item">
          <h3>实时倾角X</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.angleXValue:'' }} °</span>
        </div>
        <div class="canshu-item">
          <h3>实时倾角Y</h3>
          <span>{{device.tdWorkData?device.tdWorkData.angleYValue:'' }} °</span>
        </div>
        <div class="canshu-item">
          <h3>实时风速</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.windSpeed : '' }} m/s</span>
        </div>
        <div class="canshu-item">
          <h3>实时风力</h3>
          <span>{{ device.tdWorkData?device.tdWorkData.windPower : '' }} 级</span>
        </div>
      </div>
      <div class="site-chart-item" id="tajishebei2_sjj"></div>
    </div>
  </el-dialog>
</template>

<script>
import JGHikvision from "@components/JGHikvision";

import echarts from "echarts";


import { selectAllInfo } from "@/views/digitalConstructionSite/td/api/tttd";
export default {
  props: ["tdDialogvisib", "deviceItem"],
  components: {
    // videoPlayer,
    JGHikvision,
  },
  data() {
    return {
      deviceSerial: "",
      device: {},
      workData: {},
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
    tdDialogvisib: function (val) {
      if (val) {
        setTimeout(() => {
         this.getDetdata()

        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      this.playerOptions.sources[0].src = "";
      selectAllInfo(this.deviceItem.deviceNumber).then((res) => {
        console.log('升降机',res)
        if (res.code == "success") {
          this.device = res.data;

          this.playerOptions.sources[0].src = this.device.video;
          // this.deviceSerial = res.data.deviceSerial;
          
       this.loadCharts();
        }
      });

    },
    handleClose() {
      this.$emit("update:tdDialogvisib", false);
    },
    loadCharts() {

      let myChart = echarts.init(document.getElementById("tajishebei2_sjj"));
      // Generate data
      let category = [
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ];
      let lineData = [];
      let barData = [];

      // 
    

     this.device.y.forEach(item=>{
console.log('item',item)
lineData.push(item[0])
barData.push(item[1])
      })


      // let rateData = [];

      // for (let i = 0; i < 33; i++) {
      //   // var date = i+2001;
      //   // category.push(date)
      //   let rate = (barData[i] / lineData[i]) * 1;
      //   rateData[i] = rate.toFixed(2);
      // }

      // option
      let option = {
        title: {
          text: "",
          x: "center",
          y: 0,
          textStyle: {
            color: "#B4B4B4",
            fontSize: 16,
            fontWeight: "normal",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255,255,255,0.1)",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
              backgroundColor: "#7B7DDC",
            },
          },
        },
        legend: {
          data: ["电梯实时高度", "电梯实时重量"],
          top: "2%",
          textStyle: {
            color: "rgba(250,250,250,0.6)",
            fontSize: 12,
          },
        },
        grid: {
          left: "45",
          right: "30",
          top: "30",
          bottom: "30",
        },
        xAxis: {
          data: category,
          axisLine: {
            lineStyle: {
              color: "#B4B4B4",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: "#B4B4B4",
              },
            },

            axisLabel: {
              formatter: "{value} ",
            },
          },
          {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: "#B4B4B4",
              },
            },
            axisLabel: {
              formatter: "{value} ",
            },
          },
        ],

        series: [
          {
            name: "电梯实时高度",
            type: "line",

            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "#F02FC2",
              },
            },
            data: lineData,
            markLine: {
              symbolSize: [10, 20],
              symbol: ["none", "rect"],
              label: {
                show: true,
                distance: 15,
              },
              data: [
                {
                  name: "载重比预警值",
                  yAxis: 1,
                  type: "none",
                  lineStyle: {
                    color: "red",
                  },
                },
              ],
              lineStyle: {
                width: 1,
                color: "blank",
              },
            },
          },
          {
            name: "电梯实时重量",
            type: "line",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#956FD4" },
                  { offset: 1, color: "#3EACE5" },
                ]),
              },
            },
            data: barData,
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.close-btn {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 18px;
}
.sijiinfo-div {
  background: url("../../../../assets/viewplate/sjj_ico.png") no-repeat;
  background-position: 233px -5px;
  background-size: 117px;
  text-align: left;
}
.chartsBox {
  height: 580px;
  position: relative;
  width: 100%;
  .site-chart-item {
    video {
      height: 92%;
      width: 95%;
    }
    .sijihead {
      margin: 0 0 0 0;
      height: 130px;
      width: 90px;
    }
    .siji-info {
      line-height: 24px;
      color: @scolor;
    }
    .canshu-item {
      height: 120px;
      min-width: 120px;
      border: 1px solid rgb(12, 111, 141);
      float: left;
      border-radius: 8px;
      text-align: center;
      font-size: 14px;
      color: @scolor;
      margin: 10px 10px 0 0;
      h3 {
        margin: 0 15px;
        padding: 7px 0;
        border-bottom: 1px solid #ddd;
        font-weight: 400;
        font-size: 14px !important;
      }
      span {
        padding: 8px 0;
        display: block;
      }
    }
    margin-bottom: 15px;
    height: 270px;
    width: 50%;
    float: left;
  }
}
.deviceNo-title {
  position: absolute;
  top: 232px;
  left: 258px;
  z-index: 9;
  color: #c3e9fc;
  font-weight: 400;
}
</style>
