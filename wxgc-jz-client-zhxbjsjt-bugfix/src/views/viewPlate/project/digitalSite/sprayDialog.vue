<template>
  <el-dialog
    title="喷淋控制器"
    :visible.sync="sprayVisible" 
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
     <el-table-column type="index" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
            }}
          </template>
        </el-table-column>

        <!--        <el-table-column prop="machineOrder" label="设备序号" align="center">-->
        <!--        </el-table-column>-->

        <el-table-column prop="machineNum" label="设备编号" align="center">
        </el-table-column>

        <el-table-column prop="sprayStatus" label="喷淋状态" align="center">
          <template slot-scope="scope">
            {{ handleSprayStatus(scope.row.sprayStatus) }}
          </template>
        </el-table-column>

        <el-table-column prop="openMode" label="开启方式" align="center">
          <template slot-scope="scope">
            {{ handleOpenMode(scope.row.openMode) }}
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
import { getPagePLData } from "@/views/digitalConstructionSite/pl/api/comment.js";

export default {
  props: {
    sprayVisible: Boolean,
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
    sprayVisible: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    handleSprayStatus(sprayStatus) {
      let name = "";
      if (sprayStatus == 0) {
        name = "关闭";
      }
      if (sprayStatus == 1) {
        name = "语音播报";
      }
      if (sprayStatus == 2) {
        name = "喷淋中";
      }
      if (sprayStatus == 3) {
        name = "间歇中";
      }
      return name;
    },
    handleOpenMode(openMode) {
      let name = "";
      if (openMode == 0) {
        name = "未开启";
      }
      if (openMode == 1) {
        name = "手动遥控开启";
      }
      if (openMode == 2) {
        name = "平台下发";
      }
      if (openMode == 3) {
        name = "PM扬尘超标";
      }
      return name;
    },
    getDetdata() {
      console.log('this.deviceObj',this.deviceObj)
      getPagePLData({
        machineNum: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:sprayVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
