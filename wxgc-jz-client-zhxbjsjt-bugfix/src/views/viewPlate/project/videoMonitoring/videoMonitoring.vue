<template>
  <div class="content">

<timeButton timeButtonShow='false'></timeButton>
    <!-- <div class="time-controller" style="height: 40px; min-height: 40px">
      <el-button-group>
        <el-button
          :class="{ active: index == 1 }"
          type="primary"
          size="mini"
          @click="videoChoose(0)"
          >视频监控</el-button
        > -->
        <!-- <el-button
          :class="{ active: index == 2 }"
          type="primary"
          size="mini"
          @click="videoChoose(1)"
          >AI抓拍</el-button
        > -->
      <!-- </el-button-group>
    </div> -->
    <div class="content-box" v-if="contentBoxShow">
      <!--  -->
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'视频监控列表'"
          :title2="'Video surveillance list'"
        >
          <div class="icon-document">
            <div class="videoList" style="height:100%">
              <videoList
                ref="spEcharts"
                :videoName="videoName"
                @creationArr="creationArr($event)"
              ></videoList>
            </div>
          </div>
        </com-line>
      </div>

      <!--  -->
      <div class="content-right">
        <com-line
          class="content-left-top"
          :title="'视频监控画面'"
          :title2="'Video surveillance screen'"
        >
          <div class="icon-document">
            <div class="videoScreen" style="height:100%">
              <videoScreen
                ref="videoScreenBox"
                :videoLength="videoLength"
                @closeName="closeName($event)"
              ></videoScreen>
            </div>
          </div>
        </com-line>
      </div>
    </div>
    <div class="content-box" v-if="!contentBoxShow">
      <div class="AI-left">
        <com-line
          class="content-left-top"
          :title="'AI统计'"
          :title2="'AI statistics'"
        >
          <div class="icon-document">
            <div class="aiCapturing" style="height:100%">
              <aiCapturing></aiCapturing>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'违规统计'"
          :title2="'Violation of statistics'"
        >
          <div class="icon-document">
            <div class="violation" style="height:100%">
              <violation></violation>
            </div>
          </div>
        </com-line>
      </div>
      <div class="AI-right">
        <com-line
          class="content-left-top"
          :title="'抓拍记录统计'"
          :title2="'Catch record statistics'"
        >
          <div class="icon-document">
            <div class="captureRecords" style="height:100%">
              <captureRecords></captureRecords>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'项目报警统计'"
          :title2="'Project alarm statistics'"
        >
          <template #head>
            <el-button-group>
              <el-button
                type="primary"
                size="mini"
                :class="{ active: proActive1 == 1 }"
                @click="pChooseFive1(1)"
                >当日</el-button
              >
              <el-button
                type="primary"
                size="mini"
                :class="{ active: proActive1 == 2 }"
                @click="pChooseFive1(2)"
                >本周</el-button
              >
              <el-button
                type="primary"
                size="mini"
                :class="{ active: proActive1 == 3 }"
                @click="pChooseFive1(3)"
                >当月</el-button
              >
            </el-button-group>
            <!-- <el-date-picker
              v-model="value1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker> -->
            <el-date-picker
              size="mini"
              v-model="value1"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-button :class="{ active: proActive1 == 4 }" type="primary" size="mini" @click="pChooseFive1(value1)"
              >查询</el-button
            >
          </template>
          <div class="icon-document">
            <div class="projectAlarm" style="height:100%">
              <projectAlarm ref="AlarmEcharts"></projectAlarm>
            </div>
          </div>
        </com-line>
      </div>
    </div>
  </div>
</template>

<script>
import videoList from "./modules/videoList";
import videoScreen from "./modules/videoScreen";
import aiCapturing from "./modules/aiCapturing";
import violation from "./modules/violation";
import captureRecords from "./modules/captureRecords";
import projectAlarm from "./modules/projectAlarm";
import ComLine from "../../components/combox";
import timeButton from "../aModules/timeButton";
import moment from "moment";
// import { log } from "video.js";
export default {
  props: {},
  components: {
    ComLine,
    videoList,
    videoScreen,
    aiCapturing,
    violation,
    captureRecords,
    projectAlarm,
    timeButton
  },
  data() {
    return {
      index: 1,
      value1: "",
      proActive1: 2,
      contentBoxShow: true,
      videoName: "华侨城城市广场材料堆场",
      videoLength: 0, //判断数组的长度
    };
  },
  mounted() {},
  methods: {
    pChooseFive1(num) {
      if (num != 1 && num != 2 && num != 3) {
        this.proActive1 = 4;
        let str = num[0] + "," + num[1];
        console.log("查询日期范围", num);
        this.$refs.AlarmEcharts.getAalarmStatistics(str);
        return;
      }
      this.proActive1 = num;
      this.$refs.AlarmEcharts.getAalarmStatistics(num);
    },
    creationArr(number) {
      // 把值传给视屏监控的画面 ，同时调用 其 方法

      this.$refs.videoScreenBox.playVideo();
    },
    closeName(number) {
      // 调用视屏列表方法spEcharts
      //  this.$refs.spEcharts.closeNameBgc();
      if (number == 1) {
        //控制 视屏的个数
        this.$refs.spEcharts.clearInfo();
      }
      if (number == 2) {
        // 关闭单个视屏
        this.$refs.spEcharts.closeNameBgc();
      }
    },
    videoChoose(index) {
      this.proActive1=1
      this.index = index + 1;
      if (index == 0) {
        this.contentBoxShow = true;
      }
      if (index == 1) {
        this.contentBoxShow = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.AI-right .el-input--medium {
  margin: 0 20px;
}
.AI-right .el-input--medium /deep/.el-input__inner {
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.AI-right .el-input--medium /deep/.el-input__icon {
  .el-input__icon {
    line-height: 30px;
  }
}
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // min-height: 830px;
  // overflow:auto;
  display: flex;
  flex-direction: column;
  .content-box {
    display: flex;
  }
}

/*   内容的左边 */
.content-left {
  min-width: 330px;
  width: 10%;
  // flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 20px;
  //    border: 2px solid pink;
  .icon-document {
    width: 100%;
    height: 80vh;
    min-height: 600px;
    box-sizing: border-box;
  }
}

/*   内容的 右边 */
.content-right {
   width: 90%;
  //    border: 2px solid pink;
  // width: 600px;
  // flex: 2;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-document {
    width: 100%;
    height: 80vh;
    min-height: 600px;
    box-sizing: border-box;
  }
}

.AI-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 20px;
  .icon-document {
    width: 100%;
    height: 34vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}
.AI-right {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-document {
    width: 100%;
    height: 34vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}
.vp-project-content .el-button{  // 默认状态
    background: none;
     color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0,186,255,0.5);
    }
.active { //选中状态
  color: #00baff !important;
  border: 1px solid rgba(0,186,255,1) !important;
}
.el-date-editor--daterange {
  width: 50%;
}

/deep/ .el-range-editor.el-input__inner {
  margin-left: 10px;
  margin-right: 10px;
  padding: 2px 10px;
}

/deep/ .el-date-editor .el-range-separator {
  color: #606266;
}

/deep/ .el-date-editor .el-range-input {
  color: #606266;
}
/deep/ .el-date-editor .el-range-input {
  background-color: #04283a;
}
</style>
