<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-date-picker
        v-model="listQuery.sDate"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      >
      </el-date-picker>
      <el-date-picker
        v-model="listQuery.eDate"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束时间"
      >
      </el-date-picker>  -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
    </div>
     <el-table :data="items" height="750"  style="width: 100%" v-loading='loading'>
        <el-table-column prop="deviceNumber" label="地磅设备编号"  align="center"> </el-table-column>
        <el-table-column prop="poundRecordId" label="地磅记录ID" align="center"></el-table-column>
        <el-table-column prop="poundTime" label="过磅时间" align="center"></el-table-column>
        <el-table-column prop="weight" label="过磅总量" align="center"></el-table-column>
        <el-table-column prop="vehicleLicense" label="车辆信息" align="center"></el-table-column>



        <el-table-column prop="photoFront" label="车前过磅图片" align="center">
          <template slot-scope="scope">
            <el-image
             v-if="scope.row.photoFront"
              style="height:50px;width:50px"
              :src="scope.row.photoFront.split('?')[0]"
              :preview-src-list="[scope.row.photoFront.split('?')[0]]">
            </el-image>
              <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="photoAir" label="空中过磅图片" align="center">
          <template slot-scope="scope">
            <el-image
            v-if="scope.row.photoAir"
              style="height:50px;width:50px"
              :src="scope.row.photoAir.split('?')[0]"
              :preview-src-list="[scope.row.photoAir.split('?')[0]]">
            </el-image>
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="photoBehind" label="车后过磅图片" align="center">
          <template slot-scope="scope">
            <el-image
            v-if="scope.row.photoBehind"
              style="height:50px;width:50px"
              :src="scope.row.photoBehind.split('?')[0]"
              :preview-src-list="[scope.row.photoBehind.split('?')[0]]">
            </el-image>
              <span v-else>暂无图片</span>
          </template>
        </el-table-column>
          <el-table-column prop="videoUrl" label="过磅视频" align="center">
          <template slot-scope="scope">
             <a size="mini" v-if="scope.row.videoUrl" @click="huiFuLook(scope.$index, scope.row)"
                  >预览</a
                >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="el-pagination"
                     v-show="total>0"
                     background
                     layout="prev, pager, next"
                     :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
                     @current-change="pageChange"
                     :total="total">
      </el-pagination>
       <fileView ref="fileView" title="文件预览"></fileView>
  </div>
</template>

<script>
import { getPageXlptWorkData, getAllXlptWorkData } from "./api/xlptworkdata.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {pageDB  } from "@/views/labourManager/api/ttattendance";
import fileView from "@/components/filePreview/filePreview.vue";
export default {
  name: "history",
  components: { Pagination,fileView },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "地磅设备编号", field: "deviceNumber" },
        { label: "地磅记录ID", field: "poundRecordId" },
        { label: "过磅时间", field: "poundTime" },
        { label: "过磅总量", field: "weight" },
        { label: "车辆信息", field: "vehicleLicense" },
        { label: "车前过磅图片", field: "photoFront" },
        { label: "空中过磅图片", field: "photoAir" },
        { label: "车后过磅图片", field: "photoBehind" },
        { label: "过磅视频", field: "videoUrl" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        deviceNo: undefined,
        machineId: undefined,
        alarmReason: undefined,
        sDate: undefined,
        eDate: undefined,
      },
      downloadLoading: false,
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    //分页查询
    loadPageData() {

      console.log(this.listQuery);
     pageDB(this.listQuery).then(res=>{
        if(res.code=="success"){
          this.loading =false
          this.items=res.data.records;
          this.total=res.data.total;

        }
      }).catch(err=>{
            this.loading =false
        console.log(JSON.stringify(err))
      })
    },
    //搜索
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPageXlptWorkData(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            import("@/vendor/Export2Excel").then((excel) => {
              const tHeader = [];
              const filterVal = [];
              for (let column of self.columns) {
                tHeader.push(column.label);
                filterVal.push(column.field);
              }
              const data = this.formatJson(filterVal);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: "地磅历史记录",
              });
              this.downloadLoading = false;
            });
          } else {
            this.errorMsg("下载数据失败");
          }
        })
        .catch((err) => {
          this.errorMsg();
        });
    },
    formatJson(filterVal) {
      return this.allTableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    //错误提示
    errorMsg(msg) {
      if (!msg) msg = "服务器异常,稍后再试试";
      this.$notify({
        title: "操作提示",
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
}
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
.el-icon-male {
  color: #42b983;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-female {
  color: palevioletred;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-question {
  color: rebeccapurple;
  font-size: 20px;
  font-weight: bold;
}
</style>
