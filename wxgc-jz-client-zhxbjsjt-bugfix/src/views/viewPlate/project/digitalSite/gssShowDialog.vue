<template>
  <!-- 扬尘监测 -->
  <el-dialog
    :close-on-click-modal="false"
    title="扬尘监测"
    :visible.sync="gssShow"
    width="60%"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      height="40vh"
      row-key="id"
      fit
    >
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>        <el-table-column prop="machineNum" label="设备编号" align="center">
        </el-table-column>

        <el-table-column prop="pm2Value" label="PM2.5(ug/m³)" align="center">
        </el-table-column>

        <el-table-column prop="pm10Value" label="PM10(ug/m³)" align="center">
        </el-table-column>

        <el-table-column prop="speed" label="风速(m/s)" align="center">
        </el-table-column>

        <el-table-column prop="direction" label="风向" align="center">
          <template slot-scope="scope">
            {{ handelDirection(scope.row.direction) }}
          </template>
        </el-table-column>

        <el-table-column prop="noise" label="噪音(db)" align="center">
        </el-table-column>

        <el-table-column prop="temp" label="温度(℃)" align="center">
        </el-table-column>

        <el-table-column prop="humidity" label="湿度(%RH)" align="center">
        </el-table-column>

        <el-table-column prop="showerState" label="喷淋状态" align="center">
          <template slot-scope="scope">
            {{ handleshowerState(scope.row.showerState) }}
          </template>
        </el-table-column>
        <el-table-column prop="alarmReason" label="警报原因" align="center"
          >
          <template slot-scope="scope">
            <!-- {{ handleAlarmReason(scope.row.alarmReason) }} -->
            {{ scope.row.alarmReason }}
          </template>
        </el-table-column>

        <el-table-column prop="uploadDate" label="上报时间" align="center">
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
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getPageYcjcHistory } from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata.js";

export default {
  props: {
    gssShow: Boolean,
    deviceObj: Object,
  },
  components: { Pagination },

  data() {
    return {
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
      },
      tableData: [], //当前分页数据
      total: 0,
    };
  },
  watch: {
    gssShow: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      getPageYcjcHistory({
        machineNum: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    loadPageData(pageIndex){
      this.listQuery.pageIndex = pageIndex;
      this.getDetdata();
    },
    handleClose() {
      this.$emit("update:gssShow", false);
    },
        handleshowerState(num) {
      let name = "";
         if (num == 0) {
        name = "喷淋空闲";
      }
      if (num == 1) {
        name = "平台开启喷淋中";
      }
      if (num == 2) {
        name = "扬尘超标喷淋中";
      }
        if (num == 3) {
        name = "喷淋间歇中";
      }
      return name;
    },
       handelDirection(num) {
      let name = "";
      if (num == 1) {
        name = "东北偏北";
      }
      if (num == 2) {
        name = "东北";
      }
      if (num == 3) {
        name = "东北偏东";
      }
      if (num == 4) {
        name = "东";
      }
      if (num == 5) {
        name = "东南偏东";
      }
      if (num == 6) {
        name = "东南";
      }
      if (num == 7) {
        name = "东南偏南";
      }
      if (num == 8) {
        name = "南";
      }
      if (num == 9) {
        name = "西南偏南";
      }
      if (num == 10) {
        name = "西南";
      }

      if (num == 11) {
        name = "西南偏西";
      }
      if (num == 12) {
        name = "西";
      }
      if (num == 13) {
        name = "西北偏西";
      }
      if (num == 14) {
        name = "西北";
      }
      if (num == 15) {
        name = "西北偏北";
      }
      if (num == 16) {
        name = "北";
      }
      return name;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table--border {
  border: none;
}
</style>
