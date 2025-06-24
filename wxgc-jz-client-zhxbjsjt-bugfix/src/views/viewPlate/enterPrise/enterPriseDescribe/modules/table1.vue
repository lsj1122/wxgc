<template>
  <div style="height: 100%">
    <!--显示列表-->

    <el-table
      :modal-append-to-body="false"
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      fit
      height="470"
    >
      <el-table-column prop="tjNum" label="塔机编号" align="center">
      </el-table-column>
      <el-table-column prop="height" label="高度数据" align="center">
      </el-table-column>

      <el-table-column prop="latitude" label="幅度数据" align="center">
      </el-table-column>

      <el-table-column prop="turn" label="回转" align="center">
          <template slot-scope="turn">
          <span>{{ Number(turn.row.turn).toFixed(2) }}</span>
          </template>
      </el-table-column>

      <el-table-column prop="loadWeight" label="起重" align="center">
      </el-table-column>

      <el-table-column prop="speed" label="风速" align="center">
      </el-table-column>

      <el-table-column prop="lean" label="倾角(°)" align="center">
      </el-table-column>

      <el-table-column prop="weight" label="重量" align="center">
      </el-table-column>

      <!-- <el-table-column prop="weightPercent" label="重量(%)" align="center">
      </el-table-column>-->

      <el-table-column prop="moment" label="力矩(%)" align="center">
      </el-table-column>

      <!-- <el-table-column prop="momentPercent" label="力矩(%)" align="center">
      </el-table-column> -->

      <el-table-column prop="alarmReason" label="警报原因" align="center">
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

import { tashiList } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

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

      tashiList(obj)
        .then((res) => {
          if (res.code == "success") {
            for (let i = 0; i < res.data.records.length; i++) {
              res.data.records[i].lean = Number(
                res.data.records[i].lean
              ).toFixed(2);
            }
            console.log(res);
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
