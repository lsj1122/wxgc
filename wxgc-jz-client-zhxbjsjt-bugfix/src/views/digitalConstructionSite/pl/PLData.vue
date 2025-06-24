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
        <el-table-column type="index" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
            }}
          </template>
        </el-table-column>

        <!--        <el-table-column prop="machineOrder" label="设备序号" align="center">-->
        <!--        </el-table-column>-->

        <el-table-column prop="machineNum" label="设备编号" align="center">
        </el-table-column>

        <el-table-column prop="sprayStatus" label="喷淋状态" align="center">
          <template slot-scope="scope">
            {{ handleSprayStatus(scope.row.sprayStatus) }}
          </template>
        </el-table-column>

        <el-table-column prop="openMode" label="开启方式" align="center">
          <template slot-scope="scope">
            {{ handleOpenMode(scope.row.openMode) }}
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
import dataSource from "@/components/dataSource";
import { getPagePLData } from "./api/comment.js";
import { parseTime } from "@/utils";
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
        { label: "喷淋状态", field: "sprayStatus" },
        { label: "开启方式", field: "openMode" },
        { label: "上报时间", field: "createTime" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineNum: undefined,
        sTime: undefined,
        eTime: undefined,
        ds: "",
        dataType: "spray-work-data",
      },
      date: "",
      downloadLoading: false,
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
    handleOpenMode(openMode) {
      let name = "";
      if (openMode == 0) {
        name = "未开启";
      }
      if (openMode == 1) {
        name = "手动遥控开启";
      }
      if (openMode == 2) {
        name = "平台下发";
      }
      if (openMode == 3) {
        name = "PM扬尘超标";
      }
      return name;
    },
    handleSprayStatus(sprayStatus) {
      let name = "";
      if (sprayStatus == 0) {
        name = "关闭";
      }
      if (sprayStatus == 1) {
        name = "语音播报";
      }
      if (sprayStatus == 2) {
        name = "喷淋中";
      }
      if (sprayStatus == 3) {
        name = "间歇中";
      }
      return name;
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPagePLData(this.listQuery)
        .then((res) => {
          console.log("喷淋实时数据", res);

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
      getPagePLData(this.listQuery)
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
                filename: "喷淋实时数据",
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
            if (j == "sprayStatus") {
              return this.handleSprayStatus(v[j]);
            } else if (j == "openMode") {
              return this.handleOpenMode(v[j]);
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
@media screen and(max-width:1024px) {
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
