<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
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
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      fit
      height="calc(100vh - 260px)"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="weight" label="实时载重量(kg)" align="center">
      </el-table-column>
      <el-table-column
        prop="percentWeight"
        label="载重百分比(%)"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="inclinationX" label="X倾斜度(°)" align="center">
      </el-table-column>

      <el-table-column prop="percentageX" label="倾斜百分比X(%)" align="center">
      </el-table-column>

      <el-table-column prop="inclinationY" label="Y倾斜度(°)" align="center">
      </el-table-column>

      <el-table-column prop="percentageY" label="倾斜百分比Y(%)" align="center">
      </el-table-column>

      <el-table-column prop="batvolt" label="锂电池电压(V)" align="center">
      </el-table-column>
      <el-table-column prop="systemStatus" label="系统状态" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="采集时间" align="center">
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
import dataSource from "@/components/dataSource";
import { getPageXlptWorkData, getAllXlptWorkData } from "./api/xlptworkdata.js";
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
        { label: "设备编号", field: "machineNumber" },
        { label: "实时载重量(kg)", field: "weight" },
        { label: "载重百分比(%)", field: "percentWeight" },
        { label: "X倾斜度(°)", field: "inclinationX" },
        { label: "倾斜百分比X(%)", field: "percentageX" },
        { label: "Y倾斜度(°)", field: "inclinationY" },
        { label: "倾斜百分比Y(%)", field: "percentageY" },
        { label: "锂电池电压(V)", field: "batvolt" },
        { label: "系统状态", field: "systemStatus" },
        { label: "采集时间", field: "createTime" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        machineNumber: undefined,
        sTime: undefined,
        eTime: undefined,
        ds: "",
        dataType: "xlpt-work-data",
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
      getPageXlptWorkData(this.listQuery)
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
    huiFuLook(index, row) {
      let type = row.videoUrl.split("?")[0];
      type = type.substring(row.videoUrl.lastIndexOf(".") + 1);
      this.$refs.fileView.show(row.videoUrl.split("?")[0], type); //(文件地址,文件类型)
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPageXlptWorkData({ ...this.listQuery })
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].weightAlarm =
                this.allTableData[i].weightAlarm == 0
                  ? "正常"
                  : this.allTableData[i].weightAlarm == 1
                  ? "预警"
                  : this.allTableData[i].weightAlarm == 2
                  ? "报警"
                  : "";
              this.allTableData[i].inclinationXAlarm =
                this.allTableData[i].inclinationXAlarm == 0
                  ? "正常"
                  : this.allTableData[i].inclinationXAlarm == 1
                  ? "预警"
                  : this.allTableData[i].inclinationXAlarm == 2
                  ? "报警"
                  : "";
              this.allTableData[i].inclinationYAlarm =
                this.allTableData[i].inclinationYAlarm == 0
                  ? "正常"
                  : this.allTableData[i].inclinationYAlarm == 1
                  ? "预警"
                  : this.allTableData[i].inclinationYAlarm == 2
                  ? "报警"
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
