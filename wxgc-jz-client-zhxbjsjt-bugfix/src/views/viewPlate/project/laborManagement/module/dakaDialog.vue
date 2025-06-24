<template>
  <el-dialog
    title="打卡记录"
    :visible.sync="dialogVb"
    :modal-append-to-body="false"
    :before-close="handleClose"
    width="1200px"
  >
    <div class="search-form">
      <span>日期：</span>
      <el-date-picker
        v-model="listQuery.date"
        size="mini"
        :clearable="false"
        value-format="yyyy-MM-dd"
        style="width: 160px"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-button type="primary" size="mini" @click="query">搜索</el-button>
    </div>
    <div class="work-type-dialog">
      <el-table height="500" ref="tbb" :data="tableData" style="width: 100%">
        <el-table-column prop="name" width="100" label="姓名">
        </el-table-column>
        <el-table-column prop="idCard" width="100" label="身份证号">
        </el-table-column>
        <el-table-column prop="buildName" label="参建单位"> </el-table-column>
        <el-table-column prop="teamName" label="班组"> </el-table-column>
        <el-table-column prop="jobs" label="岗位"> </el-table-column>
        <el-table-column prop="attendanceTime" label="打卡时间">
        </el-table-column>
        <el-table-column prop="attendanceType" label="打卡类型">
        </el-table-column>
        <el-table-column prop="pic" label="人脸照片">
          <template slot-scope="scope">
            <el-image
              style="height: 60px; width: 60px"
              :src="scope.row.attendancePicture || scope.row.scenePhoto"
              :preview-src-list="[
                scope.row.attendancePicture || scope.row.scenePhoto,
              ]"
            >
              <div slot="error" class="image-slot">
                暂无图片
              </div>
            </el-image>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="el-pagination"
        v-show="total > 0"
        background
        layout="prev, pager, next"
        :current-page.sync="listQuery.pageIndex"
        :page-size.sync="listQuery.pageSize"
        @current-change="pageChange"
        :total="total"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
import moment from "moment";
import { pageTtAttendanceByDateAndWorkerId } from "@/views/labourManager/api/ttattendance";
export default {
  components: {
    Pagination,
  },
  props: {
    dialogVb: Boolean,
  },
  created() {
    this.query();
  },
  data() {
    return {
      projectId: this.$store.getters.projectId,
      tableData: [],
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        // date: moment().format("yyyy-MM-DD"),
        date: "",
      },
    };
  },
  watch: {
    dialogVb: function (val) {
      //if(val) this.query()
    },
  },
  methods: {
    query() {
      pageTtAttendanceByDateAndWorkerId(this.listQuery).then((res) => {
        if (res.code == "success") {
          console.log(res.data.records);
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    exportExcel() {
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-attendance/exportExcelAttendance?proId=" +
        this.$store.getters.projectId +
        "&date=" +
        this.listQuery.date;
    },
    pageChange(page) {
      this.listQuery.pageIndex = page;
      this.query();
    },
    handleClose() {
      this.$emit("update:dialogVb", false);
    },
  },
};
</script>

<style lang="less" scoped>
.search-form {
  text-align: left;
  > * {
    margin-right: 5px;
  }
}
</style>
