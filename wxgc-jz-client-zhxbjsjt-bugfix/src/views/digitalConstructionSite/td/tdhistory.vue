<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <!--      <el-input v-model="listQuery.alarmReason" placeholder="警报原因" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <el-input
        v-model="listQuery.machineNum"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="date"
        align="right"
        type="datetimerange"
        clearable
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <!-- <el-date-picker
        v-model="listQuery.eDate"
        align="right"
        type="date"
        clearable
        value-format="yyyy-MM-dd"
        placeholder="选择结束时间"
      >
      </el-date-picker> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <!-- <dataSource v-model="listQuery.ds" @changeSwitch="loadPageData" /> -->
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button> -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
    </div>
    <!--显示列表-->
    <div class="tablebox">
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        height="100%"
        row-key="id"
        stripe
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
            }}
          </template>
        </el-table-column>
        <el-table-column prop="machineNum" label="设备编号" align="center" />

        <el-table-column prop="operatorName" label="司机姓名" align="center">
        </el-table-column>
        <el-table-column prop="operatorNo" label="司机工号" align="center">
        </el-table-column>
        <el-table-column
          prop="elevatorCurrentHeight"
          label="电梯实时高度(m)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="elevatorCurrentFloor"
          label="电梯实时楼层"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="weightValue" label="实时重量(kg)" align="center">
        </el-table-column>
        <el-table-column prop="speedValue" label="实时速度(m/s)" align="center">
        </el-table-column>
        <!-- <el-table-column prop="runDirection" label="运行方向" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.runDirection == 0">静止</span>
            <span v-if="scope.row.runDirection == 1">向上</span>
            <span v-if="scope.row.runDirection == 2">向下</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="angleXValue" label="实时倾角X(°)" align="center">
        </el-table-column>
        <el-table-column
          prop="angleYValue"
          label="实时倾角Y(°)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="windSpeed"
          label="实时风速(m/s)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="windPower" label="实时风力(级)" align="center">
        </el-table-column>

        <el-table-column prop="personNum" label="实时人数" align="center">
        </el-table-column>
        <!-- <el-table-column prop="weightPercent" label="重量百分比" align="center">
        </el-table-column>
        <el-table-column prop="speedPercent" label="速度百分比" align="center">
        </el-table-column> -->
        <!-- <el-table-column prop="test" label="卸吊点角度(°)" align="center">
        </el-table-column> -->
        <!-- <el-table-column
          prop="angleXPercent"
          label="倾角X百分比"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="angleYPercent"
          label="倾角Y百分比"
          align="center"
        >
        </el-table-column> -->
        <!-- <el-table-column prop="windPercent" label="风速百分比" align="center">
        </el-table-column> -->

        <el-table-column
          prop="wearingHelmetPeople"
          label="已带安全帽人数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="withoutHelmetPeople"
          label="未带安全帽人数"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="remainAttendTime"
          label="考勤剩余时间"
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="brakeControlStatus"
          label="制动控制状态"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.brakeControlStatus == 0">允许上升</span>
            <span v-if="scope.row.brakeControlStatus == 1">禁止上升</span>
          </template>
        </el-table-column>
        <el-table-column prop="sensorStatus" label="传感器状态" align="center">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.sensorStatus == 0">正常</span>
            <span v-if="scope.row.sensorStatus == 1">未启用</span>
            <span v-if="scope.row.sensorStatus == 2">故障</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="alarmStatus" label="报警状态" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="上报时间" align="center">
        </el-table-column>
      </el-table>
    </div>
    <!--分页组件-->
    <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadPageData"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getPageTdWorkData, getAllTdWorkData } from "./api/tdworkdata.js";
import dataSource from "@/components/dataSource";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "tdhistory",
  components: { Pagination, dataSource },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备编号", field: "machineNum" },
        { label: "司机姓名", field: "operatorName" },
        { label: "司机工号", field: "operatorNo" },
        { label: "电梯实时高度(m)", field: "elevatorCurrentHeight" },
        { label: "电梯实时楼层", field: "elevatorCurrentFloor" },
        { label: "实时重量(kg)", field: "weightValue" },
        { label: "实时速度(m/s)", field: "speedValue" },
        { label: "实时倾角X(°)", field: "angleXValue" },
        { label: "实时倾角Y(°)", field: "angleYPercent" },
        { label: "实时风速(m/s)", field: "leanPercent1" },
        { label: "实时风力(级)", field: "windSpeed" },
        { label: "实时人数", field: "personNum" },
        { label: "已带安全帽人数", field: "wearingHelmetPeople" },
        { label: "未带安全帽人数", field: "withoutHelmetPeople" },
        { label: "制动控制状态", field: "brakeControlStatus" },
        { label: "传感器状态", field: "sensorStatus" },
        { label: "报警状态", field: "alarmStatus" },
        { label: "上报时间", field: "uploadDate" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        tdNum: undefined,
        sTime: undefined,
        eTime: undefined,
        ds: "",
        dataType: "td-work-data",
      },
      downloadLoading: false,
      date: "",
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  watch: {
    date(date) {
      if (date) {
        this.listQuery.sTime = date[0];
        this.listQuery.eTime = date[1];
      } else {
        this.listQuery.sTime = undefined;
        this.listQuery.eTime = undefined;
      }
    },
  },
  methods: {
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageTdWorkData(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    //搜索
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPageTdWorkData({ ...this.listQuery})
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].brakeControlStatus =
                this.allTableData[i].brakeControlStatus == 0
                  ? "允许上升"
                  : this.allTableData[i].brakeControlStatus == 1
                  ? "禁止上升"
                  : "";
            }
            import("@/vendor/Export2Excel").then((excel) => {
              const tHeader = [];
              const filterVal = [];
              for (let column of self.columns) {
                tHeader.push(column.label);
                filterVal.push(column.field);
              }
              const data = this.formatJson(filterVal);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: "列表",
              });
              this.downloadLoading = false;
            });
          } else {
            this.errorMsg("下载数据失败");
          }
        })
        .catch((err) => {
          this.errorMsg();
        });
    },
    formatJson(filterVal) {
      return this.allTableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    //错误提示
    errorMsg(msg) {
      if (!msg) msg = "服务器异常,稍后再试试";
      this.$notify({
        title: "操作提示",
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
}
.tablebox {
  height: calc(100% - 100px);
}
.el-pagination {
  margin-top: 20px;
}
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
.el-icon-male {
  color: #42b983;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-female {
  color: palevioletred;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-question {
  color: rebeccapurple;
  font-size: 20px;
  font-weight: bold;
}
// @media screen and (max-width:1024px) {
//   .app-container{
// height: 100%;
//   }
//   .tablebox{
//   height: 82%;
//   overflow: auto;
// }
// }
</style>
