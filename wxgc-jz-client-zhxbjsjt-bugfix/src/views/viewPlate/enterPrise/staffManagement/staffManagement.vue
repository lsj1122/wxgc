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
    <timeButton  @zongLanChoose='zongLanChoose($event)'></timeButton>
    <div class="content-box">
      <!--  -->
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'用工统计'"
          :title2="'Worker statistics'"
          style="margin-bottom:25px"
        >

          <div class="icon-document">
            <div class="laborStatistics" style="height:100%">
              <laborStatistics ref="laborStatistics"></laborStatistics>
            </div>
          </div>
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="employment"
              />
              <!-- <span class="el-icon-s-unfold" @click="complete(1)"></span> -->
            </el-tooltip>
          </template>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'出勤人数统计'"
          :title2="'Attendance statistics'"
        >
          <template #head>
            <!-- <el-button-group>
              <el-button type="primary" :class="{ active: peopleActive1==1 }" size="mini" @click="attendChoose(1)"
                >按项目</el-button
              >
              <el-button type="primary" :class="{ active: peopleActive1==2 }" size="mini" @click="attendChoose(2)"
                >按时间</el-button
              >
            </el-button-group> -->
          </template>
          <div class="icon-document">
            <div class="attendanceSituation" style="height:100%">
              <attendanceSituation ref="attendanceSituation"></attendanceSituation>
            </div>
          </div>
          <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="Attendance"
              />
              <!-- <span class="el-icon-s-unfold" @click="complete(1)"></span> -->
            </el-tooltip>
          </template>
        </com-line>
      </div>
      <!--  -->
      <div class="content-mid">
        <com-line
          class="content-left-top"
          :title="'出勤率分析'"
          :title2="'Attendance analysis'"
        >
          <template #head>
            <!-- <el-button-group>
              <el-button type="primary" :class="{ active: peopleActive2==1 }" size="mini" @click="attendChoose2(1)"
                >按项目</el-button
              >
              <el-button type="primary" :class="{ active: peopleActive2==2 }" size="mini" @click="attendChoose2(2)"
                >按时间</el-button
              >
            </el-button-group> -->
          </template>
          <div class="icon-document">
            <div class="attendance" style="height:100%">
              <attendance ref="attendCh"></attendance>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'工资发放情况'"
          :title2="'Salary payment'"
        >
          <!-- <template #head>
            <el-button-group>
              <el-button type="primary" :class="{ active: peopleActive3==1 }" size="mini" @click="sEducationChoose(1)"
                >发放工资</el-button
              >
              <el-button type="primary" :class="{ active: peopleActive3==2 }" size="mini" @click="sEducationChoose(2)"
                >发放人数</el-button
              >
            </el-button-group>
          </template> -->
          <div class="icon-document">
            <div class="payoff" style="height:100%">
              <payoff ref="sEducation"></payoff>
            </div>
          </div>
        </com-line>
      </div>

      <!--  -->
      <div class="content-right">
        <com-line
          class="content-left-top"
          :title="'工种分析'"
          :title2="'Job analysis'"
        >
          <div class="icon-document">
            <div class="jobEvaluation " style="height:100%">
              <jobEvaluation ref="equipEcharts"></jobEvaluation>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'年龄分布'"
          :title2="'age distribution'"
        >
          <div class="icon-document">
            <div class=" ageDistribution " style="height:100%">
            <ageDistribution ref="ageDistribution"></ageDistribution>
          </div>
          </div>
        </com-line>
      </div>
    </div>
  </div>
</template>

<script>
import laborStatistics from "./modules/laborStatistics";
import attendanceSituation from "./modules/attendanceSituation";
import attendance from "./modules/attendance";
import payoff from "./modules/payoff";
import jobEvaluation from "./modules/jobEvaluation";
import ageDistribution from "./modules/ageDistribution";
import timeButton from "../aModules/timeButton";

import ComLine from "../../components/comline";
export default {
  props: {},
  components: {
    ComLine,
    laborStatistics,
    attendanceSituation,
    attendance,
    payoff,
    jobEvaluation,
    ageDistribution,
    timeButton
  },
  data() {
    return {
      isActive:2,
      peopleActive1:1,
      peopleActive2:1,
      peopleActive3:1,
    };
  },
  mounted() {},
  methods: {
  employment(){
    console.log("dianji");
    this.$refs.laborStatistics.dialogVisible = true
  },
  Attendance(){
    console.log(1111);
    this.$refs.attendanceSituation.dialogVisible = true
  },
    attendChoose(type) {
      //
       this.peopleActive1 =type;
       this.$refs.attendanceSituation.ways(this.isActive,type);

    },
    attendChoose2(type) {
       this.peopleActive2 =type;
       this.$refs.attendCh.ways(this.isActive,type);
      // if (item == 0) {
      //   this.$refs.attendCh.handelEcharts();
      // } else {
      //   this.$refs.attendCh.handelEcharts2();
      // }
    },
    sEducationChoose(type) {
      //
       this.peopleActive3 =type;
       this.$refs.sEducation.ways(this.isActive,type);
      // if (item == 0) {
      //   this.$refs.sEducation.handelEcharts();
      // } else {
      //   this.$refs.sEducation.handelEcharts2();
      // }
    },

      zongLanChoose(index) {

      this.isActive = index;
      // 调用 环境 人员 AI 抓拍 方法
      // 默认第一个：
       this.peopleActive1 =1;
       this.peopleActive2 =1;
       this.peopleActive3 =1;

       this.$refs.laborStatistics.ways(this.isActive); // 用工
       this.$refs.attendanceSituation.ways(this.isActive,this.peopleActive1); //出勤
       this.$refs.attendCh.ways(this.isActive,this.peopleActive2);//出勤 分析
       this.$refs.sEducation.ways(this.isActive,this.peopleActive3); //工资发放
       this.$refs.equipEcharts.ways(this.isActive); //工种分析
      //  this.$refs.ageDistribution.ways(this.isActive); //年龄分布

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
    height: 36.5vh;
    // min-height: 300px;
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
    height: 36.5vh;
    // min-height: 300px;
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
    height: 36.5vh;
    // min-height: 300px;
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
</style>
