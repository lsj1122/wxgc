<template>
  <el-dialog
    title="智能水表"
    :visible.sync="znsbVisible"
    width="60%"
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
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="machineType" label="设备类型" align="center">
      </el-table-column>

      <el-table-column prop="machineName" label="项目名称" align="center">
      </el-table-column>

      <el-table-column prop="sumData" label="累计用量" align="center">
      </el-table-column>

      <el-table-column prop="dayData" label="今日用量" align="center">
      </el-table-column>

      <el-table-column prop="createTime" label="创建日期" align="center">
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
import { getPageEleWaterWorkData } from "@/views/digitalConstructionSite/zhsd/api/elewaterworkdata.js";

export default {
  props: {
    znsbVisible: Boolean,
    deviceObj: Object,
  },
  components: { Pagination },

  data() {
    return {
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineType: "水表",
      },
      tableData: [], //当前分页数据
      total: 0,
    };
  },
  watch: {
    znsbVisible: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      getPageEleWaterWorkData({
        machineId: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:znsbVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
