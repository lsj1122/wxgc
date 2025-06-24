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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <!-- <dataSource v-model="listQuery.ds" @changeSwitch="loadPageData"/> -->
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
        <el-table-column prop="machineNum" label="设备编号" align="center">
        </el-table-column>
        <el-table-column prop="identityResult" label="识别结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.identityResult == 0">未通过</span>
            <span v-if="scope.row.identityResult == 1">通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <!-- <el-table-column prop="test" label="用户id" align="center">
        </el-table-column> -->
        <el-table-column
          prop="identityPercent"
          label="识别百分数(%)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号码" align="center">
        </el-table-column>
        <el-table-column prop="uploadTime" label="记录时间" align="center">
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
import {getPageTtRlJl} from "./api/rlsb.js";
import {parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "tdhistory",
  components: {Pagination},
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: "设备编号", field: "machineNum"},
        {label: "识别结果", field: "identityResult"},
        {label: "姓名", field: "name"},
        // { label: "用户id", field: "test" },
        {label: "识别百分数(%)", field: "identityPercent"},
        {label: "身份证号码", field: "idCard"},
        {label: "记录时间", field: "uploadTime"},
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        machineNum: undefined,
        sTime: undefined,
        eTime: undefined,
        ds: "",
        dataType: "face-recognition-record",
      },
      downloadLoading: false,
      date: "",
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {
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
  methods: {
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageTtRlJl(this.listQuery)
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
      getPageTtRlJl({...this.listQuery})
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].identityResult =
                this.allTableData[i].identityResult == 0
                  ? "通过"
                  : this.allTableData[i].identityResult == 1
                    ? "未通过"
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
