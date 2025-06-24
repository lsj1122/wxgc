<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.hostNumber"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.sDate"
        align="right"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @keyup.enter.native="handleFilter"
      >
      </el-date-picker>
      <el-select v-model="listQuery.alarmReason" clearable placeholder="选择报警类型">
        <el-option
          v-for="item in callThePoliceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
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
      <!-- <dataSource v-model="listQuery.ds" @changeSwitch="loadPageData"/> -->

    </div>
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      height="calc(100vh - 260px)"
      fit
      highlight-current-row
    >
      <el-table-column prop="tjNum" label="塔机编号" align="center">
      </el-table-column>
      <el-table-column prop="hostNumber" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="heightValue" label="高度(m)" align="center">
      </el-table-column>
      <el-table-column prop="rangeValue" label="幅度(m)" align="center">
      </el-table-column>
      <el-table-column prop="rotationValue" label="回转(°)" align="center">
      </el-table-column>

      <el-table-column prop="weightValue" label="起重量(吨)" align="center">
      </el-table-column>

      <el-table-column prop="windSpeed" label="风速(m/s)" align="center">
      </el-table-column>

      <el-table-column prop="dipAngle" label="倾角(°)" align="center">
      </el-table-column>

      <el-table-column prop="weightPercent" label="重量百分比(%)" align="center">
      </el-table-column>

      <el-table-column prop="momentPercent" label="力矩百分比(%)" align="center">
      </el-table-column>


      <el-table-column prop="brakingStatus" label="制动状态" align="center">
        <template slot-scope="scope">
          {{ isBrake(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="alarmReason" label="设备状态" align="center">
        <template slot-scope="scope">
          {{ getAlermReason(scope.row.alarmReason) }}
        </template>
      </el-table-column>

      <el-table-column prop="uploadDate" label="记录时间" align="center">
      </el-table-column>
    </el-table>
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
import {getPageTjWorkData, getAllTjWorkData} from "./api/tjworkdata.js";
import {deepClone, parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import dataSource from "@/components/dataSource"
import {getAlermReason} from "@/json/tj";

export default {
  name: "tjhistory",
  components: {Pagination, dataSource},
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      callThePoliceOptions: [
        {
          label: "碰撞",
          value: "0"
        }, {
          label: "重量",
          value: "1"
        },
        {
          label: "力矩",
          value: "2"
        },
        {
          label: "倾斜",
          value: "3"
        },
        {
          label: "风速",
          value: "4"
        },
        {
          label: "幅度限位",
          value: "5"
        },
        {
          label: "高度限位",
          value: "6"
        },
      ],
      columns: [
        {label: "塔机编号", field: "tjNum"},
        {label: "设备编号", field: "hostNumber"},
        {label: "高度(m)", field: "heightValue"},
        {label: "幅度(m)", field: "rangeValue"},
        {label: "回转(°)", field: "rotationValue"},
        {label: "起重量(吨)", field: "weightValue"},
        {label: "风速(m/s)", field: "windSpeed"},
        {label: "倾角(°)", field: "dipAngle"},
        {label: "重量百分比(%)", field: "weightPercent"},
        {label: "力矩百分比(%)", field: "momentPercent"},
        {label: "制动状态", field: "brakingStatus"},
        {label: "设备状态", field: "alarmReason"},
        {label: "记录时间", field: "uploadDate"},
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        tjNum: undefined,
        sDate: undefined,
        ds: "",
        dataType: 'tj-work-data'
      },
      downloadLoading: false,
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {
  },
  methods: {
    getAlermReason,
    //判断制动状态
    isBrake(row) {
      if (
        row.brakeStateAfter === 0 &&
        row.brakeStateFront === 0 &&
        row.brakeStateLeft === 0 &&
        row.brakeStateLower === 0 &&
        row.brakeStateRight === 0 &&
        row.brakeStateUpper === 0
      ) {
        return "闭合";
      } else {
        return "断开";
      }
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      let params = JSON.parse(JSON.stringify(this.listQuery))
      if (params.sDate && params.sDate.length > 0) {
        params.STime = params.sDate[0]
        params.ETime = params.sDate[1]
      }
      getPageTjWorkData(params)
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
      let params = deepClone(this.listQuery)
      if (params.sDate && params.sDate.length > 0) {
        params.STime = params.sDate[0]
        params.ETime = params.sDate[1]
      }
      getPageTjWorkData(params)
        .then((res) => {
          if (res.code == "success") {
            let {records} = res.data
            records.forEach(item => {
              item.alarmReason = this.getAlermReason(item.alarmReason)
              item.brakingStatus = this.isBrake(item)
            })
            this.allTableData = res.data.records;
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
                filename: "实时数据",
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
</style>
