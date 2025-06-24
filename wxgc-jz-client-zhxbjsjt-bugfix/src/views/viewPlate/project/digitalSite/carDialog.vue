<template>
  <el-dialog
    title="标养室监测"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      height="40vh"
      fit
    >
         <el-table-column prop="serialNumber" label="设备序号" align="center">
      </el-table-column>
      <el-table-column prop="snbysNum" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="temperature" label="温度(℃)" align="center">
      </el-table-column>
      <el-table-column prop="humidity" label="湿度(%RH)" align="center">
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
import Pagination from "@/components/Pagination";
import { getPageEleWaterWorkData } from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata.js";

export default {
  props: {
    dialogVisible: Boolean,
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
      dataLoading:false
    };
  },
  watch: {
    dialogVisible: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      console.log(this.deviceObj)
      getPageEleWaterWorkData({
        machineId: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
