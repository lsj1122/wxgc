<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <!-- <el-date-picker
        v-model="listQuery.sDate"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      >
      </el-date-picker>
      <el-date-picker
        v-model="listQuery.eDate"
        align="right"
        type="date"
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
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      fit
      height="calc(100vh - 260px)"
      highlight-current-row
    >
      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="voltA" label="电压A" align="center">
      </el-table-column>

      <el-table-column prop="voltB" label="电压B" align="center">
      </el-table-column>

      <el-table-column prop="voltC" label="电压C" align="center">
      </el-table-column>

      <el-table-column prop="rateA" label="频率A" align="center">
      </el-table-column>

      <el-table-column prop="rateB" label="频率B" align="center">
      </el-table-column>

      <el-table-column prop="rateC" label="频率C" align="center">
      </el-table-column>

      <el-table-column prop="cuurA" label="电流A" align="center">
      </el-table-column>

      <el-table-column prop="cuurB" label="电流B" align="center">
      </el-table-column>

      <el-table-column prop="cuurC" label="电流C" align="center">
      </el-table-column>
      <el-table-column prop="leak" label="漏电" align="center">
      </el-table-column>
      <el-table-column prop="tempA" label="温度A" align="center">
      </el-table-column>

      <el-table-column prop="tempB" label="温度B" align="center">
      </el-table-column>

      <el-table-column prop="tempC" label="温度C" align="center">
      </el-table-column>
      <el-table-column prop="energyA" label="电能A" align="center">
      </el-table-column>

      <el-table-column prop="energyA" label="电能B" align="center">
      </el-table-column>

      <el-table-column prop="energyA" label="电能C" align="center">
      </el-table-column>

      <el-table-column prop="date" label="创建日期" align="center">
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
import { getPagehistoryYDJC } from "./api/elewaterworkdata.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
// import { getPageYcjcWorkData } from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata";
export default {
  name: "history",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备编号", field: "machineNumber" },
        { label: "电压A", field: "voltA" },
        { label: "电压B", field: "voltB" },
        { label: "电压C", field: "voltC" },

        { label: "频率A", field: "rateA" },
        { label: "频率B", field: "rateB" },
        { label: "频率C", field: "rateC" },

        { label: "电流A", field: "cuurA" },
        { label: "电流B", field: "cuurB" },
        { label: "电流C", field: "cuurC" },
        { label: "漏电", field: "leak" },

        { label: "温度A", field: "tempA" },
        { label: "温度B", field: "tempB" },
        { label: "温度C", field: "tempC" },

        { label: "电能A", field: "energyA" },
        { label: "电能B", field: "energyB" },
        { label: "电能C", field: "energyC" },
        { label: "创建日期", field: "date" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineId: undefined,
        sDate: undefined,
        eDate: undefined,
        // machineType: undefined,
      },
      downloadLoading: false,
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPagehistoryYDJC(this.listQuery)
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
      let params = JSON.parse(JSON.stringify(this.listQuery));
      params.pageSize = -1;
      getPagehistoryYDJC(params)
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
