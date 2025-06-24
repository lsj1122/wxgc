<template>
  <div style="height:100%"> 
          <!--显示列表-->
            <el-table
       :modal-append-to-body="false"
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      height="470"
    >
      <el-table-column prop="machineNum" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="pm2Value" label="pm2.5" align="center">
      </el-table-column>

      <el-table-column prop="pm10Value" label="pm10" align="center">
      </el-table-column>

      <el-table-column prop="speed" label="风速" align="center">
      </el-table-column>

      <el-table-column prop="direction" label="风向" align="center">
      </el-table-column>

      <el-table-column prop="noise" label="噪声" align="center">
      </el-table-column>

      <el-table-column prop="temp" label="温度" align="center">
      </el-table-column>

      <el-table-column prop="humidity" label="湿度" align="center">
      </el-table-column>

      <el-table-column prop="alarmReason" label="警报原因" align="center" v-if="alarmReason">
      </el-table-column>

      <el-table-column prop="uploadDate" label="上传时间" align="center">
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
      @current-change="loadPageData(listQuery)"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

import { tashiList3 } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

export default {
  components: { Pagination },
  props: [],
  data() {
    return {
      tableData: [], //当前分页数据
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 5,
        tjNum: "",
      },
      downloadLoading: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    loadPageData(obj) {
      var _this = this;
      this.listQuery = obj;
      this.dataLoading = true;

      tashiList3(obj)
        .then((res) => {
          console.log(res);
          if (res.code == "success") {
            _this.tableData = res.data.records;
            _this.total = res.data.total;
          }
          _this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          _this.dataLoading = false;
        });
    },
  },
};
</script>
<style lang="less" scoped>
.el-table--striped /deep/.el-table__body tr.el-table__row--striped td {
  background: none;
}
.el-pagination {
  text-align: center;
}
</style>
