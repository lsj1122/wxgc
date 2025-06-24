<template>
  <div style="height:100%"> 
          <!--显示列表-->
         <el-table
               :modal-append-to-body="false"
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        stripe
        height="470"
      >
        <el-table-column prop="uploadDate" label="时间" align="center">
        </el-table-column>

      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>

      <el-table-column prop="tdNum" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="weightValue" label="实时起重量" align="center">
      </el-table-column>

      <el-table-column prop="weightPercent" label="重量百分比" align="center">
      </el-table-column>

      <el-table-column prop="heightValue" label="实时高度" align="center">
      </el-table-column>

      <el-table-column prop="heightPercent" label="高度百分比" align="center">
      </el-table-column>

      <el-table-column prop="speedValue" label="实时速度" align="center">
      </el-table-column>

      <el-table-column prop="leanValue1" label="实时倾斜度1" align="center">
      </el-table-column>

      <el-table-column prop="leanPercent1" label="倾斜百分比" align="center">
      </el-table-column>

      <el-table-column prop="leanValue2" label="实时倾斜度2" align="center">
      </el-table-column>

      <el-table-column prop="leanPercent1" label="倾斜百分比" align="center">
      </el-table-column>

      <el-table-column prop="name" label="司机姓名" align="center">
      </el-table-column>

      <el-table-column prop="phone" label="司机电话" align="center">
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

import { tashiList2 } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

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
      d: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    loadPageData(obj) {
      var _this = this;
      this.listQuery = obj;
      this.dataLoading = true;

      tashiList2(obj)
        .then((res) => {
          console.log('施工升降机设备统计',res);
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
