<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        clearable
        filterable
        placeholder="请选择告警类型"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item.name"
          :value="item.type"
        ></el-option>
      </el-select>
      <el-date-picker
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
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      height="calc(100vh - 260px)"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column prop="type" label="告警类型" align="center">
        <template slot-scope="scope">
          {{options[scope.row.type - 1].name}}
        </template>
      </el-table-column>

      <el-table-column prop="cid" label="设备序列号" align="center">
      </el-table-column>

      <el-table-column prop="picData" label="报警图片" align="center">
      </el-table-column>

      <el-table-column prop="picData" label="图片预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="height: 50px; width: 50px"
            :src="scope.row.picData"
            :preview-src-list="[scope.row.picData]"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" align="center">
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
  getPageTtAiAlarmData,
  getAllTtAiAlarmData,
} from "./api/ttaialarmdata.js";
import {parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "warning",
  components: {Pagination},
  data() {
    return {
      options: [{name:"安全帽",type:"1"},{name:"反光衣",type:"2"},{name:"烟尘",type:"3"},{name:"明火",type:"4"},{name:"非法闯入",type:"5"},{name:"人员聚集",type:"6"},{name:"物品移动",type:"7"}],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: "告警类型", field: "picName"},
        {label: "设备序列号", field: "cid"},
        {label: "报警图片", field: "picData"},
        {label: "创建时间", field: "createTime"},
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        sDate: undefined,
        eDate: undefined,
        type: "",
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
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageTtAiAlarmData(this.listQuery)
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
      getPageTtAiAlarmData(this.listQuery)
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
                filename: "报警记录",
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
