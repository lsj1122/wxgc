<template>
  <!-- 升降机工作循环-->
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
        <el-table-column prop="operatorName" label="司机姓名" align="center">
        </el-table-column>
        <el-table-column prop="operatorNo" label="司机工号" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
        </el-table-column>
        <el-table-column
          prop="maxHeight"
          label="运行过程中最大高度(m)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="maxWeight"
          label="运行过程中最大重量(kg)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="weightPercent" label="运行过程中重量(%)" align="center">
        </el-table-column>
        <el-table-column prop="maxSpeed" label="最大速度(m/s)" align="center">
        </el-table-column>
        <el-table-column
          prop="averageSpeed"
          label="平均速度(m/s)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="maxSpeed" label="最大风速(m/s)" align="center">
        </el-table-column>
        <el-table-column
          prop="maxWindPower"
          label="最大风力(级)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="maxXAngle" label="最大倾角X(°)" align="center">
        </el-table-column>
        <el-table-column prop="maxYAngle" label="最大倾角Y(°)" align="center">
        </el-table-column>
        <el-table-column
          prop="startHeight"
          label="运行起始高度(m)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endHeight"
          label="运行结束高度(m)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="startFloor" label="起始楼层" align="center">
        </el-table-column>
        <el-table-column prop="endFloor" label="结束楼层" align="center">
        </el-table-column>
        <el-table-column prop="runDirection" label="运行方向" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.runDirection == 0">循环</span>
            <span v-if="scope.row.runDirection == 1">向上</span>
            <span v-if="scope.row.runDirection == 2">向下</span>
          </template>
        </el-table-column>
        <el-table-column prop="runDistance" label="运行距离(m)" align="center">
        </el-table-column>
        <el-table-column prop="runPeriod" label="运行时长" align="center">
        </el-table-column>
        <el-table-column prop="loadPeople" label="本次承载人数" align="center">
        </el-table-column>
        <el-table-column
          prop="wearingHelmetPeople"
          label="已带安全帽人数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="withoutHelmetPeople"
          label="未带安全帽人数"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="alarmStatus" label="报警状态" align="center">
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
import { getPageTdCycle, getAllTdWorkData } from "./api/tdworkdata.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "tdcycle",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "司机姓名", field: "operatorName" },
        { label: "司机工号", field: "operatorNo" },
        { label: "开始时间", field: "startTime" },
        { label: "结束时间", field: "endTime" },
        { label: "运行过程中最大高度(m)", field: "maxHeight" },
        { label: "运行过程中最大重量(kg)", field: "maxWeight" },
        { label: "运行过程中重量(%)", field: "weightPercent" },
        { label: "最大速度(m/s)", field: "maxSpeed" },
        { label: "平均速度(m/s)", field: "averageSpeed" },
        { label: "最大风速(m/s)", field: "maxSpeed" },
        { label: "最大风力(级)", field: "maxWindPower" },
        { label: "最大倾角X(°)", field: "maxXAngle" },
        { label: "最大倾角Y(°)", field: "maxYAngle" },
        { label: "运行起始高度(m)", field: "startHeight" },
        { label: "运行结束高度(m)", field: "endHeight" },
        { label: "起始楼层", field: "startFloor" },
        { label: "结束楼层", field: "endFloor" },
        { label: "运行方向", field: "runDirection" },
        { label: "运行距离(m)", field: "runDistance" },
        { label: "运行时长", field: "runPeriod" },
        { label: "本次承载人数", field: "loadPeople" },
        { label: "已带安全帽人数", field: "wearingHelmetPeople" },
        { label: "未带安全帽人数", field: "withoutHelmetPeople" },
        { label: "报警状态", field: "alarmStatus" },
        { label: "记录时间", field: "uploadTime" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        alarmReason: undefined,
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
      getPageTdCycle(this.listQuery)
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
      getPageTdCycle({ ...this.listQuery })
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].runDirection =
                this.allTableData[i].runDirection == 0
                  ? "循环"
                  : this.allTableData[i].runDirection == 1
                  ? "向上"
                  : this.allTableData[i].runDirection == 2
                  ? "向下"
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
</style>
