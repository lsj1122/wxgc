<template>
  <el-dialog
    title="人脸识别"
    :visible.sync="faceVisible"
    width="60%"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      height="50vh" 
      row-key="id"
      fit
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
        <el-table-column prop="identityResult" label="识别结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.identityResult == 0">通过</span>
            <span v-if="scope.row.identityResult == 1">未通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <!-- <el-table-column prop="test" label="用户id" align="center">
        </el-table-column> -->
        <el-table-column
          prop="identityPercent"
          label="识别百分数(%)"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号码" align="center">
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
import { getPageTtRlJl } from "@/views/digitalConstructionSite/rl/api/rlsb.js";

export default {
  props: {
    faceVisible: Boolean,
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
    faceVisible: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      getPageTtRlJl({
        machineNum: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:faceVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
