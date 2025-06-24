<template>
  <!-- 升降机认证信息 -->
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
        row-key="id"
        height="100%"
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
        <!-- <el-table-column prop="identityType" label="身份类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.identityType == 0">未知人员</span>
            <span v-if="scope.row.identityType == 1">塔机司机</span>
            <span v-if="scope.row.identityType == 2">检测人员</span>
            <span v-if="scope.row.identityType == 3">安拆人员</span>
            <span v-if="scope.row.identityType == 4">维保人员</span>
            <span v-if="scope.row.identityType == 5">塔机信号工</span>
            <span v-if="scope.row.identityType == 6">监理人员</span>
            <span v-if="scope.row.identityType == 7">项目经理</span>
            <span v-if="scope.row.identityType == 8">安全员</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="inTime" label="打卡时间" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>

        <!-- <el-table-column prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 0">男</span>
            <span v-if="scope.row.gender == 1">女</span>
          </template>
        </el-table-column> -->

        <el-table-column prop="idCard" label="身份证" align="center">
        </el-table-column>

        <el-table-column prop="jobNo" label="工号" align="center">
        </el-table-column>
        <el-table-column prop="operationCard" label="操作证号" align="center">
        </el-table-column>
        <el-table-column prop="pictureUrl" label="照片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.pictureUrl"
              :preview-src-list="[scope.row.pictureUrl]"
            ></el-image>
          </template>
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
import { getPageTdRz, getAllTdWorkData } from "./api/tdworkdata.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "tdwarning",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备编号", field: "machineNum" },
        { label: "打卡时间", field: "inTime" },
        { label: "姓名", field: "name" },
        { label: "身份证", field: "idCard" },
        { label: "工号", field: "jobNo" },
        { label: "操作证号", field: "operationCard" },
        { label: "考勤照片", field: "inTime" },
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
        // flag: 1// TODO 暂时没有升降机对接,告警数据不知如何获取
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
      getPageTdRz({ ...this.listQuery})
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
      getPageTdRz(this.listQuery)
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
</style>
