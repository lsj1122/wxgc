<template>
  <div-layout>
    <template #left>
      <class-compon />
    </template>
    <!--搜索框-->
    <div class="filter-container">
      <!--      <el-input v-model="listQuery.text" placeholder="内容" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <el-date-picker
        v-model="listQuery.date"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
        :clearable="false"
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
<!--      <el-button-->
<!--        v-waves-->
<!--        :loading="downloadLoading"-->
<!--        class="filter-item"-->
<!--        type="primary"-->
<!--        icon="el-icon-download"-->
<!--        @click="handleDownloadNew"-->
<!--      >-->
<!--        {{ $t("table.export") }}-->
<!--      </el-button>-->
    </div>
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column prop="name" label="姓名" align="center">
      </el-table-column>

      <el-table-column prop="idCard" label="身份证号" align="center">
      </el-table-column>

      <el-table-column prop="buildName" label="参建单位" align="center">
      </el-table-column>

      <el-table-column prop="teamName" label="班组" align="center">
      </el-table-column>

      <el-table-column prop="jobs" label="岗位" align="center">
      </el-table-column>

      <el-table-column prop="attendanceTime" label="打卡时间" align="center">
      </el-table-column>

      <el-table-column prop="attendanceType" label="打卡类型" align="center">
      </el-table-column>

      <el-table-column prop="attendancePicture" label="预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="height: 50px; width: 50px"
            :src="scope.row.attendancePicture"
            :preview-src-list="[scope.row.attendancePicture]"
          >
          </el-image>
        </template>
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
  </div-layout>
</template>

<script>
import classCompon from "./module/classCompon.vue";
import {
  pageTtAttendanceByDateAndWorkerId,
  getAllTtAttendance,
} from "./api/ttattendance.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import moment from "moment"; // secondary package based on el-pagination
export default {
  name: "TtAttend",
  components: { Pagination, classCompon },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "姓名", field: "name" },
        { label: "身份证号", field: "idCard" },
        { label: "参建单位", field: "buildName" },
        { label: "班组", field: "teamName" },
        { label: "岗位", field: "jobs" },
        { label: "打卡时间", field: "attendanceTime" },
        { label: "打卡类型", field: "attendanceType" },
        { label: "考勤图片", field: "attendancePicture" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        date: moment().format("yyyy-MM-DD"),
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
      pageTtAttendanceByDateAndWorkerId(this.listQuery)
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
    handleDownloadNew() {
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-attendance/exportExcelAttendance?proId=" +
        this.$store.getters.projectId +
        "&date=" +
        this.listQuery.date;
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getAllTtAttendance()
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data;
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
