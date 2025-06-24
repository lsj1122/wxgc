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
        <el-table-column label="设备编号" align="center" prop="machineNum" />
        <el-table-column label="打卡时间" align="center" prop="uploadTime" />
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center">
        </el-table-column>

        <!-- <el-table-column prop="jobNo" label="工号" align="center">
        </el-table-column> -->
        <el-table-column prop="gender" label="性别" align="center">
             <template slot-scope="scope">
           {{scope.row.gender ==0?'男':scope.row.gender ==1?'女':''}}
          </template>
        </el-table-column>
        <el-table-column prop="cz" label="操作证号" align="center">
          <template slot-scope="scope">
           {{scope.row.cz ==null?'-':'-'}}
          </template>
        </el-table-column>

        <el-table-column prop="identityType" label="身份类型" align="center">
          <template slot-scope="scope">
            {{ handIdentityType(scope.row.identityType) }}
          </template>
        </el-table-column>

        <el-table-column prop="pictureUrl" label="考勤照片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.pictureUrl"
              :preview-src-list="[scope.row.pictureUrl]"
            >
            </el-image>
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
import dataSource from "@/components/dataSource";
import { getPagePeopleMHistory } from "./api/comment.js";
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
        { label: "打卡时间", field: "uploadTime" },
        { label: "姓名", field: "name" },
        { label: "身份证", field: "idCard" },
        { label: "工号", field: "jobNo" },
        { label: "操作证号", field: "cz" },
        { label: "身份类型", field: "identityType" },
        { label: "考勤照片", field: "pictureUrl" },
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
        ds: "",
        dataType: "people-attendance-info",
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
    handIdentityType(identityType) {
      let name = "";
      if (identityType == 0) {
        name = "未知人员";
      }
      if (identityType == 1) {
        name = "塔机司机";
      }
      if (identityType == 2) {
        name = "检测人员";
      }
      if (identityType == 3) {
        name = "安拆人员";
      }
      if (identityType == 4) {
        name = "维保人员";
      }
      if (identityType == 5) {
        name = "塔机信号工";
      }
      if (identityType == 6) {
        name = "监理人员";
      }
      if (identityType == 7) {
        name = "项目经理";
      }
      if (identityType == 8) {
        name = "安全员";
      }
      return name;
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPagePeopleMHistory(this.listQuery)
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
      getPagePeopleMHistory(params)
        .then((res) => {
          if (res.code == "success") {
            // this.tableData = res.data.records;
            this.tableData = res.data.records;
            this.tableData.forEach((item) => {
              item.gender == 0
                ? (item.gender = "女")
                : item.gender == 1
                ? (item.gender = "男")
                : (item.gender = "");
              item.identityType = this.handIdentityType(item.identityType);
            });
            import("@/vendor/Export2Excel").then((excel) => {
              const tHeader = []; // 导出excel 的标题
              const filterVal = []; // 每个标题对应的字段
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
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else { 
            if (j == "identityType") {
              return this.handIdentityType(v[j]);
            } if (j == "cz") {
              return '-';
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
