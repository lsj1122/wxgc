<template>
  <div class="boot" style="height:100%">
    <div class="top">
      <el-select
          clearable
          class="selectType"
          v-model="listQuery.proName"
          placeholder="请选择项目名称"
      >
        <el-option
            v-for="item in selectoptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
          style="width:180px; margin-left: 10px; margin-right: 8px"
          v-model="listQuery.date"
          type="date"
          placeholder="选择日期">
      </el-date-picker>
      <el-button type="primary" @click="seach">搜索</el-button>
    </div>
    <el-table
        :data="tableData"
        height="250"

        style="width: 100%">
      <el-table-column
          prop="goodsName"
          label="材料名称"
          width="100"
          align="center">
      </el-table-column>
      <el-table-column
          prop="goodsModel"
          label="规格型号"
          width="100"
          align="center">
      </el-table-column>
      <el-table-column
          prop="total"
          label="数量"
          align="center">
      </el-table-column>
      <el-table-column
          prop="unitOfMeasurement"
          label="单位"
          width="100"
          align="center">
      </el-table-column>
      <el-table-column
          prop="num"
          label="车次"
          width="100"
          align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment';
import {
  safetyStatistics,
  securityIssueStatisticsDate,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import {weightvehicise} from "@/views/viewPlate/enterPrise/api/mater";

export default {
  name: 'WxgcJzClientReceipt',

  data() {
    return {
      listQuery: {
        proName: "",
        date: "",
        startTime: "",
        endTime: ""
      },
      selectoptions: [],
      tableData: []
    };
  },

  mounted() {
    this.getProjectName();
    this.weightsum()
  },

  methods: {
    // 搜索
    seach() {
      this.weightsum()
    },
    // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          console.log("项目", this.selectoptions);
        }
      });
    },
    weightsum() {
      if (this.listQuery.date) {
        this.listQuery.startTime = moment(this.listQuery.date).format("YYYY-MM-DD 00:00:00");
        this.listQuery.endTime = moment(this.listQuery.date).format("YYYY-MM-DD 23:59:59");
        console.log("开始", this.listQuery.startTime);
      }else{
        this.listQuery.startTime = '';
        this.listQuery.endTime ='';
      }
      console.log("搜索时时间", this.listQuery.startTime,this.listQuery.endTime);

      weightvehicise(this.listQuery)
          .then((res) => {
            if (res.code == "success") {
              this.tableData = res.data
              //   this.totaltab = res.data
              //   this.proName = res.data.map((item) => {

              //   return item.name;
              // });
              //   this.value = res.data.map((item) => {
              //       return item.intValue;
              // });


              console.log("累计收料统计", res.data);

            }
            // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)


          });

    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: end;
  padding-top: 12px;
  padding-bottom: 24px;
}
</style>
