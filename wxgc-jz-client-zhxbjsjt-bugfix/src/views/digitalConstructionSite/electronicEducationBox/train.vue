<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineName"
        placeholder="设备名称"
        style="width: 200px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery.machineNo"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery.trainName"
        placeholder="培训名称"
        style="width: 200px"
        class="filter-item"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleDownload"
      >
        导出当前页
      </el-button>
    </div>
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="machineNo"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column prop="machineNo" label="设备编号" align="center" >
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center" >
      </el-table-column>
      <el-table-column prop="trainName" label="培训名称" align="center" >
      </el-table-column>
      <el-table-column prop="totalNum" label="总人数" align="center" >
      </el-table-column>
      <el-table-column prop="checkDate" label="考核日期" align="center" >
      </el-table-column>
      <el-table-column prop="trainType" label="考核类型" align="center" >
        <template slot-scope="scope">
          {{ convertOptions(trainTypeOptions, scope.row.trainType, "label", "value") }}
        </template>
      </el-table-column>
      <el-table-column prop="fullScore" label="培训的总分数" align="center" >
      </el-table-column>
      <el-table-column prop="markupScore" label="合格分数" align="center" >
      </el-table-column>
      <el-table-column prop="totalPassNum" label="合格总人数" align="center" >
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

import {
  selectPageList
} from "./api/train.js";
import {deepClone, parseTime} from "@/utils";
import Pagination from "@/components/Pagination";

export default {
  name: "machine",
  components: {Pagination},
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: "设备编号", field: "machineNo"},
        {label: "设备名称", field: "machineName"},
        {label: "培训名称", field: "trainName"},
        {label: "总人数", field: "totalNum"},
        {label: "考核日期", field: "checkDate"},
        {label: "考核类型", field: "trainType"},
        {label: "培训的总分数", field: "fullScore"},
        {label: "合格分数", field: "markupScore"},
        {label: "合格总人数", field: "totalPassNum"}
      ],
      trainTypeOptions:[{label:"常规考核",value:1},{label:"快速考核",value:2}],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        machineNo: "",
        machineName: "",
        trainName: "",
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        machineNo: "",
        machineName: "",
        trainName: "",
      },
      allMachines: [],
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
    this.selectByMachineNo();
  },
  mounted() {
  },
  methods: {
    convertOptions(ops, key, label, value) {
      for (let i = 0; i < ops.length; i++) {
        let op = ops[i];
        if (op[value] == key) {
          return op[label];
        }
      }
    },
    cancel() {
      this.resetTemp();
      this.dialogFormVisible = false;
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      selectPageList(this.listQuery)
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
      this.allTableData = this.tableData;
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
          filename: "培训记录",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.allTableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          }  else if (j === "trainType") {
            return this.trainTypeOptions.find(option => option.value === v[j])?.label || v[j];
            
          } else {
            return v[j];
          }
        })
      );
    },
    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        id: null,
        sensorName: null,
        sensorId: null,
        machineName: null,
        machineNumber: null,
      };
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
    }
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
