<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNum"
        placeholder="设备编号"
        style="width: 200px"
        clearable
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.sDate"
        align="right"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @keyup.enter.native="handleFilter"
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
      <el-table-column prop="tjNum" label="塔机编号" align="center">
      </el-table-column>
      <el-table-column prop="machineNum" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="maxWeight" label="最大吊重(吨)" align="center">
      </el-table-column>
      <el-table-column prop="maxMoment" label="最大力矩(T.M)" align="center">
      </el-table-column>
      <el-table-column prop="maxHeight" label="最大高度(m)" align="center">
      </el-table-column>
      <el-table-column prop="minHeight" label="最小高度(m)" align="center">
      </el-table-column>
      <el-table-column prop="maxLatitude" label="最大幅度(m)" align="center">
      </el-table-column>
      <el-table-column prop="minLatitude" label="最小幅度(m)" align="center">
      </el-table-column>
      <el-table-column prop="startLean" label="起吊点角度(°)" align="center">
      </el-table-column>
      <el-table-column prop="startLatitude" label="起吊点幅度(m)" align="center">
      </el-table-column>
      <el-table-column prop="startHeight" label="起吊点高度(m)" align="center">
      </el-table-column>
      <el-table-column prop="endLean" label="卸吊点角度(°)" align="center">
      </el-table-column>
      <el-table-column prop="endLatitude" label="卸吊点幅度(m)" align="center">
      </el-table-column>
      <el-table-column prop="endHeight" label="卸吊点高度(m)" align="center">
      </el-table-column>
      <el-table-column prop="startTime" label="工作循环开始时间" align="center">
      </el-table-column>
      <el-table-column prop="endTime" label="工作循环结束时间" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" align="center">
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
import {getPageTjWorkData, getAllTjWorkData, TjCircleDataPage} from "./api/tjworkdata.js";
import {parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "tjcycle",
  components: {Pagination},
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: "塔机编号", field: "tjNum"},
        {label: "设备编号", field: "machineNum"},
        {label: "最大吊重(吨)", field: "maxWeight"},
        {label: "最大力矩(T.M)", field: "maxMoment"},
        {label: "最大高度(m)", field: "maxHeight"},
        {label: "最小高度(m)", field: "minHeight"},
        {label: "最大幅度(m)", field: "maxLatitude"},
        {label: "最小幅度(m)", field: "minLatitude"},
        {label: "起吊点角度(°)", field: "startLean"},
        {label: "起吊点幅度(m)", field: "startLatitude"},
        {label: "起吊点高度(m)", field: "startHeight"},
        {label: "卸吊点角度(°)", field: "endLean"},
        {label: "卸吊点幅度(m)", field: "endLatitude"},
        {label: "卸吊点高度(m)", field: "endHeight"},
        {label: "工作循环开始时间", field: "startTime"},
        {label: "工作循环结束时间", field: "endTime"},
        {label: "上传时间", field: "uploadTime"},
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        tjNum: undefined,
        sDate: undefined,
        eDate: undefined,
      },
      downloadLoading: false,
      options: [
        {
          value: "0",
          label: "碰撞",
        },
        {
          value: "1",
          label: "重量",
        },
        {
          value: "2",
          label: "力矩",
        },
        {
          value: "3",
          label: "倾斜",
        },
        {
          value: "4",
          label: "风速",
        },
        {
          value: "5",
          label: "幅度限位",
        },
        {
          value: "6",
          label: "高度限位",
        },
        {
          value: "7",
          label: "回转限位",
        },
      ],
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
      let params = JSON.parse(JSON.stringify(this.listQuery))
      if (params.sDate && params.sDate.length > 0) {
        params.STime = params.sDate[0]
        params.ETime = params.sDate[1]
      }
      TjCircleDataPage(params)
        .then((res) => {
          if (res.code == "success") {
            for (let i = 0; i < res.data.records.length; i++) {
              res.data.records[i].lean = Number(
                res.data.records[i].lean
              ).toFixed(2);
            }
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
      let params = JSON.parse(JSON.stringify(this.listQuery))
      if (params.sDate && params.sDate.length > 0) {
        params.STime = params.sDate[0]
        params.ETime = params.sDate[1]
      }
      TjCircleDataPage(params)
        .then((res) => {
          if (res.code == "success") {
            for (let i = 0; i < res.data.records.length; i++) {
              res.data.records[i].lean = Number(
                res.data.records[i].lean
              ).toFixed(2);
            }
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
                filename: "塔基工作循环",
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
