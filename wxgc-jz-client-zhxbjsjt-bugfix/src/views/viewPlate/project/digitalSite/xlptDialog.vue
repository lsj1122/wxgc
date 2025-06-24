<template>
  <el-dialog
    title="卸料平台"
    :visible.sync="xlptvisib"
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
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="weight" label="实时载重量(kg)" align="center">
      </el-table-column>
      <el-table-column
        prop="percentWeight"
        label="载重百分比(%)"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="inclinationX" label="X倾斜度(°)" align="center">
      </el-table-column>

      <el-table-column prop="percentageX" label="倾斜百分比X(%)" align="center">
      </el-table-column>

      <el-table-column prop="inclinationY" label="Y倾斜度(°)" align="center">
      </el-table-column>

      <el-table-column prop="percentageY" label="倾斜百分比Y(%)" align="center">
      </el-table-column>

      <el-table-column prop="batvolt" label="锂电池电压(V)" align="center">
      </el-table-column>
      <el-table-column prop="systemStatus" label="系统状态" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="采集时间" align="center">
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
import { getPageXlptWorkData } from "@/views/digitalConstructionSite/xlpt/api/xlptworkdata.js";

export default {
  props: {
    xlptvisib: Boolean,
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
    xlptvisib: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      getPageXlptWorkData({
        machineNumber: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:xlptvisib", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
