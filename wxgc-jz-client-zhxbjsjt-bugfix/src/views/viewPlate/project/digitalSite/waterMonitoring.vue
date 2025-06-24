<template>
  <el-dialog
    title="水质监测"
    :visible.sync="waterMonitoringVisible"
    width="70%"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
      <el-table
        :data="tableData"
        v-loading="dataLoading"
      row-key="id"
      height="50vh"
      fit
      >
      <el-table-column type="index" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
            }}
          </template>
        </el-table-column>
                <el-table-column prop="machineOrderNumber" label="设备序号" align="center" />
        <el-table-column prop="machineNumber" label="设备编号" align="center" />

        <el-table-column
          prop="turbidityValue"
          label="浊度值(NTU)"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="phValue" label="ph" align="center">
        </el-table-column>

        <el-table-column prop="waterLevelValue" label="水位(m)" align="center">
        </el-table-column>
                <el-table-column prop="sludgeValue" label="污泥(mg/L)" align="center">
        </el-table-column>

        <el-table-column
          prop="ammoniaNitrogenValue"
          label="氨氮值(ppm)"
          align="center"
        >
        </el-table-column>
     <el-table-column prop="temperature" label="温度(℃)" align="center">
        </el-table-column>
        <el-table-column
          prop="conductivity"
          label="电导率(uS/cm)"
          align="center"
        >
        </el-table-column>

   
        <!-- <el-table-column prop="sensorStatus" label="传感器状态" align="center">
          <template slot-scope="scope">
            {{
              scope.row.sensorStatus == 0
                ? "故障"
                : scope.row.sensorStatus == 1
                ? "正常"
                : ""
            }}
          </template>
        </el-table-column> -->

        <el-table-column prop="alarmStatus" label="报警状态" align="center" width="200">
          <template slot-scope="scope">
            {{scope.row.alarmStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="记录时间" align="center">
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
import { getPageRealTimeSZ } from "@/views/digitalConstructionSite/szjc/api/comment.js";
import Pagination from "@/components/Pagination";


export default {
  props: {
    waterMonitoringVisible: Boolean,
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
    waterMonitoringVisible: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      getPageRealTimeSZ({
        machineNum: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:waterMonitoringVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
