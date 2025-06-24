<template>
  <el-dialog
    title="临边防护"
    :visible.sync="edgeVisible"
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
        </el-table-column>
        <el-table-column prop="machineNum" label="设备编号" align="center"/>
        <el-table-column prop="wireLockOne" label="线锁1状态" align="center">
          <template slot-scope="scope">
            {{
              scope.row.wireLockOne == 0
                ? "正常"
                : scope.row.wireLockOne == 1
                  ? "防护网拆除"
                  : ""
            }}
          </template>
        </el-table-column>
        <el-table-column prop="wireLockTwo" label="线锁2状态" align="center">
          <template slot-scope="scope">
            {{
              scope.row.wireLockTwo == 0
                ? "正常"
                : scope.row.wireLockTwo == 1
                  ? "防护网拆除"
                  : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="magneticLockOne"
          label="磁锁1状态"
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.magneticLockOne == 0
                ? "正常"
                : scope.row.magneticLockOne == 1
                  ? "防护网拆除"
                  : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="magneticLockTwo"
          label="磁锁2状态"
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.magneticLockTwo == 0
                ? "正常"
                : scope.row.magneticLockTwo == 1
                  ? "防护网拆除"
                  : ""
            }}
          </template>
        </el-table-column>
        <el-table-column prop="voltage" label="电压(V)" align="center">
        </el-table-column>
        <el-table-column prop="uploadTime" label="上报时间" align="center">
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
import { getPageTtLbSs } from "@/views/digitalConstructionSite/lbfh/api/lbfh.js";

export default {
  props: {
    edgeVisible: Boolean,
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
    edgeVisible: function (val) {
      if (val) {
        setTimeout(() => {
          this.getDetdata();
        }, 10);
      }
    },
  },
  methods: {
    getDetdata() {
      getPageTtLbSs({
        machineNum: this.deviceObj.deviceNumber,
        ...this.listQuery,
      }).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClose() {
      this.$emit("update:edgeVisible", false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
