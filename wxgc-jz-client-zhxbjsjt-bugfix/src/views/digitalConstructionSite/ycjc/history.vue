<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNum"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
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

      <!-- <dataSource v-model="listQuery.ds" @changeSwitch="loadPageData" /> -->
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
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column prop="machineNum" label="设备编号" align="center">
        </el-table-column>

        <el-table-column prop="pm2Value" label="PM2.5(ug/m³)" align="center">
        </el-table-column>

        <el-table-column prop="pm10Value" label="PM10(ug/m³)" align="center">
        </el-table-column>

        <el-table-column prop="speed" label="风速(m/s)" align="center">
        </el-table-column>

        <el-table-column prop="direction" label="风向" align="center">
          <template slot-scope="scope">
            {{ handelDirection(scope.row.direction) }}
          </template>
        </el-table-column>

        <el-table-column prop="noise" label="噪音(db)" align="center">
        </el-table-column>

        <el-table-column prop="temp" label="温度(℃)" align="center">
        </el-table-column>

        <el-table-column prop="humidity" label="湿度(%RH)" align="center">
        </el-table-column>

        <el-table-column prop="showerState" label="喷淋状态" align="center">
          <template slot-scope="scope">
            {{ handleshowerState(scope.row.showerState) }}
          </template>
        </el-table-column>
        <el-table-column prop="alarmReason" label="警报原因" align="center"
          >
          <template slot-scope="scope">
            <!-- {{ handleAlarmReason(scope.row.alarmReason) }} -->
            {{ scope.row.alarmReason }}
          </template>
        </el-table-column>

        <el-table-column prop="uploadDate" label="上报时间" align="center">
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
import { getPageYcjcHistory } from "./api/ycjcworkdata.js";
import { parseTime } from "@/utils";
import dataSource from "@/components/dataSource";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "history",
  components: { Pagination, dataSource },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备编号", field: "machineNum" },
        { label: "PM2.5(ug/m³)", field: "pm2Value" },
         { label: "PM10(ug/m³)", field: "pm10Value" },
        { label: "风速(m/s)", field: "speed" },
        { label: "风向", field: "direction" },
        { label: "噪音(db)", field: "noise" },
        { label: "温度(℃)", field: "temp" },
        { label: "湿度(%RH)", field: "humidity" },
        { label: "喷淋状态", field: "showerState" },
        { label: "警报原因", field: "alarmReason" },
        { label: "记录时间", field: "uploadDate" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineNum: undefined,
        sDate: undefined,
        eDate: undefined,
        // flag: 1,
        ds: "",
        dataType: "ycjc-work-data",
      },
      downloadLoading: false,
      date: "",
    };
  },
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
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    handleAlarmReason(num) {
      let name = "";
      if (num == 0) {
        name = "正常";
      }
      if (num == 1) {
        name = "预警";
      }
      if (num == 2) {
        name = "报警";
      }
      return name;
    },
    handelDirection(num) {
      let name = "";
      if (num == 1) {
        name = "东北偏北";
      }
      if (num == 2) {
        name = "东北";
      }
      if (num == 3) {
        name = "东北偏东";
      }
      if (num == 4) {
        name = "东";
      }
      if (num == 5) {
        name = "东南偏东";
      }
      if (num == 6) {
        name = "东南";
      }
      if (num == 7) {
        name = "东南偏南";
      }
      if (num == 8) {
        name = "南";
      }
      if (num == 9) {
        name = "西南偏南";
      }
      if (num == 10) {
        name = "西南";
      }

      if (num == 11) {
        name = "西南偏西";
      }
      if (num == 12) {
        name = "西";
      }
      if (num == 13) {
        name = "西北偏西";
      }
      if (num == 14) {
        name = "西北";
      }
      if (num == 15) {
        name = "西北偏北";
      }
      if (num == 16) {
        name = "北";
      }
      return name;
    },
    handleshowerState(num) {
      let name = "";
          if (num == 0) {
        name = "喷淋空闲";
      }
      if (num == 1) {
        name = "平台开启喷淋中";
      }
      if (num == 2) {
        name = "扬尘超标喷淋中";
      }
       if (num == 3) {
        name = "喷淋间歇中";
      }
      return name;
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageYcjcHistory(this.listQuery)
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
      getPageYcjcHistory(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
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
                filename: "导出实时监控",
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
            if (j == "direction") {
              return this.handelDirection(v[j]);
            } else if (j == "showerState") {
              return this.handleshowerState(v[j]);
            } else {
              return v[j];
            }
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

@media screen and(max-width: 1024px) {
  .app-container {
    // height: 100%;
  }
  .tablebox {
    // height: 100%;
    // overflow: auto;
    // transform: scale(0.8);
  }
}
</style>
