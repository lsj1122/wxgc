<template>
  <div>
    <el-row :gutter="20" class="row-box">
      <el-col span="8">
        <div style="height: 166px" class="col-bg">
          <div class="col-title">设备统计</div>
          <el-row :gutter="20">
            <el-col :span="6" align="center">
               <img
                 src="../../../../assets/djx/Group 5552@2x.png"
                 class="app-code"
               />
            </el-col>
            <el-col :span="18">
              <el-row>
                <el-col class="col-subtitle">设备总数</el-col>
                <el-col class="col-content">{{ totalMachine }}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col span="8">
        <div style="height: 166px" class="col-bg">
          <div class="col-title">人数统计</div>
          <el-row :gutter="20">
            <el-col :span="6" align="center">
              <img
                src="../../../../assets/djx/Group 4911@2x.png"
                class="app-code"
              />
            </el-col>
            <el-col :span="18">
              <el-row>
                <el-col class="col-subtitle">人员总数</el-col>
                <el-col class="col-content">{{ totalPerson }}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col span="8">
        <div style="height: 166px" class="col-bg">
          <div class="col-title">培训总数</div>
          <el-row :gutter="20">
            <el-col :span="6" align="center">
              <img
                src="../../../../assets/djx/Group 5553@2x.png"
                class="app-code"
              />
            </el-col>
            <el-col :span="18">
              <el-row>
                <el-col class="col-subtitle">培训总数</el-col>
                <el-col class="col-content">{{ totalTrain }}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="row-box">
      <el-col span="12">
        <div style="height: 250px" class="col-bg">
          <div class="col-title">培训合格率</div>
          <animated-pie-chart ref="pxhgl" :id="'pxhgl'" :value="pxhgl"></animated-pie-chart>
        </div>
      </el-col>
      <el-col span="12">
        <div style="height: 270px" class="col-bg">
          <div class="col-title"> 补考合格率</div>
          <animated-pie-chart ref="bkhgl" :id="'bkhgl'" :value="bkhgl"></animated-pie-chart>
        </div>
      </el-col>
    </el-row>
    <el-row class="row-box">
      <el-col>
        <div style="height: 350px" class="col-bg">
          <div class="col-title">补考信息</div>
          <el-table
            :data="tableData"
            height="300px"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="用户名">
            </el-table-column>
            <el-table-column
              prop="trainName"
              label="培训名称">
            </el-table-column>
            <el-table-column
              prop="machineName"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="machineNo"
              label="设备编号">
            </el-table-column>
            <el-table-column
              prop="idcard"
              label="身份证">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="markupResult"
              label="补考培训状况">
            </el-table-column>
            <el-table-column
              prop="markupScore"
              label="补考成绩">
            </el-table-column>
            <el-table-column
              prop="markupTime"
              label="补考时间">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AnimatedPieChart from "@/components/AnimatedPieChart";
import {
  selectStatistics,selectTrainTable
} from "./api/safetyEducation.js";

export default {
  name: 'WxgcJzClientSafetyEducation',
  components: {AnimatedPieChart},
  data() {
    return {
      tableData: [],
      pxhgl: 0.0,
      bkhgl: 0.0,
      totalMachine: 0,
      totalPerson: 0,
      totalTrain: 0,
    };
  },
  mounted() {
    this.initChartData();
    this.initTableData();
  },
  methods: {
    initChartData() {
      selectStatistics().then((res) => {
        let data = res.data;
        this.pxhgl = data.pxhgl;
        this.bkhgl = data.bkhgl;
        this.totalMachine = data.totalMachine;
        this.totalPerson = data.totalPerson;
        this.totalTrain = data.totalTrain;

        this.$refs.pxhgl.value = this.pxhgl * 100;
        this.$refs.bkhgl.value = this.bkhgl * 100;
        this.$refs.pxhgl.initChart();
        this.$refs.bkhgl.initChart();
      })
    },
    initTableData() {
      selectTrainTable().then((res)=>{
        this.tableData = res.data;
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.col-bg {
  background-color: rgba(126, 183, 255, 0.10);
}

.row-box {
  margin-bottom: 24px;
}

.col-title {
  color: #CBE6FF;
  font-size: 18px;
  font-weight: Bold;
  padding: 0px 0px 0px 10px;
  margin: 00px 0px 0px 10px;
  border-left: 2px solid #57ADFF;
}

.col-subtitle {

}

.col-content {
  font-size: 40px;
  font-family: Acens-Regular, Acens;
  font-weight: 400;
  line-height: 47px;
  background: linear-gradient(360deg, #E0D700 0%, #FFFFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-code{
  width: 50px;
  margin: 10px;
}
</style>
