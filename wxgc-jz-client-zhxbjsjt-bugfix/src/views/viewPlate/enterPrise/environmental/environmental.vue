<template>
  <div class="content">
    <!-- <div class="time-controller" style="height: 40px; min-height: 40px">
      <el-button-group>
        <el-button type="primary" size="mini" @click="wifiChoose(0)"
          >今日</el-button
        >
        <el-button type="primary" size="mini" @click="wifiChoose(1)"
          >本周</el-button
        >
        <el-button type="primary" size="mini" @click="wifiChoose(1)"
          >当月</el-button
        >
      </el-button-group>
    </div> -->
    <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>
    <div class="content-box">
      <!--  -->
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'实时空气质量'"
          :title2="'Real time air quality'"
          
        >
          <template #head>
            <el-select
              v-model="airvalue"
              placeholder="请选择项目"
              @change="changeAir"
            >
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </template>
          <div class="icon-document">
            <div class="airQuality" style="height: 100%">
              <airQuality ref="spEcharts"></airQuality>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'报警项目统计'"
          :title2="'Alarm item statistics'"
        >
          

          <div class="icon-document">
            <div class="alarmItem" style="height: 100%">
              <alarmItem ref="attends"></alarmItem>
            </div>
          </div>
        </com-line>
      </div>
      <!--  -->
      <div class="content-mid">
        <com-line
          class="content-left-top"
          :title="'晴雨表'"
          :title2="'Barometer'"
        >
          <div class="icon-document">
            <div class="barometer" style="height: 100%">
              <barometer ref="attendCh"></barometer>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'扬尘报警统计'"
          :title2="'Statistics of dust alarm times'"
        >
          <div class="icon-document">
            <div class="dustStatistics" style="height: 100%">
              <dustStatistics ref="dustStatistics"></dustStatistics>
            </div>
          </div>
        </com-line>
      </div>

      <!--  -->
      <div class="content-right">
        <com-line
          class="content-left-top"
          :title="'绿色施工照片'"
          :title2="'Green construction photos'"
        >
        <template #head>
          
          </template>
          <div class="icon-document">
            <div class="totalWater" style="height: 100%">
              <totalWater></totalWater>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'喷淋管理'"
          :title2="'Spray management'"
        >
         
          <div class="icon-document">
            <div class="totalPower" style="height: 100%">
              <totalPower></totalPower>
            </div>
          </div>
        </com-line>
      </div>
    </div>
  </div>
</template>

<script>
import airQuality from "./modules/airQuality";
import alarmItem from "./modules/alarmItem";
import dustStatistics from "./modules/dustStatistics";
import totalWater from "./modules/totalWater";
import totalPower from "./modules/totalPower";
import barometer from "./modules/barometer";
import timeButton from "../aModules/timeButton";

import ComLine from "../../components/comline";
import { projectName } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  props: {},
  components: {
    ComLine,
    airQuality,
    alarmItem,
    dustStatistics,
    totalWater,
    totalPower,
    barometer,
    timeButton,
  },
  data() {
    return {
      isActive: "",
      airvalue: "",
      options: [],
    };
  },
  mounted() {
    this.projectName()
    this.changeAir(this.airvalue)
  },
  methods: {
    projectName() {
      projectName().then((res) => {
        if(res.code==='success'){
         for(let i in res.data){
          this.options.push(res.data[i].proName)
         }
        }
      });
    },
    zongLanChoose(index) {
      this.isActive = index;
      // 默认第一个：
      // this.peopleActive =0
      // this.warnActive =0
      this.$refs.attends.ways(index);
      this.$refs.dustStatistics.ways(index);
      //  this.$refs.aIboxEcharts.ways(index)
      //
      
    },
    complete() {
      this.$refs.attends.dialogVisible = true;
      this.$refs.attends.getProjectName();
      this.$refs.attends.onSubmit();
    },
    // 改变下拉选
    changeAir(a) {
      this.$refs.spEcharts.selectYcjcDataByChild(a)
    },
  },
};
</script>

<style lang="less" scoped>
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
.content-left-top{
  margin-bottom: 20px;
}
/*   内容的左边 */
.content-left {
  // width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //    border: 2px solid pink;
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 中间 */
.content-mid {
  //    border: 2px solid pink;
  position: relative;
  // width: 600px;
  flex: 1;
  min-width: 600px;
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 右边 */
.content-right {
  //    border: 2px solid pink;
  // width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}
/deep/ .el-dialog .el-dialog__header {
  margin-top: 20px;
  .el-dialog__title {
    color: #fff;
  }
}
/deep/ .el-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
/deep/ .el-dialog {
  width: 50%;
  height: 650px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0vh !important;
}
</style>