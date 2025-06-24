<template>
  <div class="boot">
    <!-- 搜索部分 -->
    <div class="header">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 500px"
        class="filter-item"
      >
      </el-date-picker>
      <el-input
        v-model="listQuery.licensePlate"
        placeholder="请输入车牌号码"
        style="width: 500px"
        class="filter-item"
      ></el-input>
      <el-button
        type="primary"
        style="width: 100px"
        class="filter-item"
        @click="handleFilter"
        >搜索</el-button
      >
      <el-button
        type="primary"
        style="width: 100px"
        class="filter-item"
        @click="handReset"
        >重置</el-button
      >
      <el-button type="primary" @click="handleDownload">导出当前页</el-button>
    </div>

    <!-- 表格 -->

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="deviceName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="carNumber" label="车次编码" align="center">
      </el-table-column>
      <el-table-column prop="licensePlate" label="车牌号码" align="center">
      </el-table-column>
      <el-table-column prop="plateColor" label="车牌颜色" align="center">
      </el-table-column>
      <el-table-column prop="outTime" label="双次过磅时间" align="center">
      </el-table-column>
      <el-table-column prop="scope" label="称重数据" align="center">
        <template slot-scope="scope">
          毛重:{{ scope.row.grossWeight }}<br />
          皮重:{{ scope.row.tareWeight }}<br />
          净重:{{ scope.row.netWeight }}
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="单位名称" align="center">
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="goodsModel" label="规格型号" align="center">
      </el-table-column>
      <el-table-column prop="driverName" label="司机姓名" align="center">
      </el-table-column>
      <el-table-column prop="driverMobile" label="司机电话" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.prevent="handleEdit(scope)"
            align="center"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 详情弹窗 -->

    <el-dialog
      title="双次过磅详情"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="temp" ref="dataForm" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="车次编码"
              :label-width="formLabelWidth"
              prop="carNumber"
            >
              <el-input
                v-model="temp.carNumber"
                autocomplete="off"
                style="width: 250px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="车牌颜色"
              :label-width="formLabelWidth"
              prop="plateColor"
            >
              <el-input
                v-model="temp.plateColor"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="皮重"
              :label-width="formLabelWidth"
              prop="tareWeight"
            >
              <el-input
                v-model="temp.tareWeight"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="车牌号码"
              :label-width="formLabelWidth"
              prop="licensePlate"
            >
              <el-input
                v-model="temp.licensePlate"
                autocomplete="off"
                style="width: 250px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="毛重"
              :label-width="formLabelWidth"
              prop="grossWeight"
            >
              <el-input
                v-model="temp.grossWeight"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="净重"
              :label-width="formLabelWidth"
              prop="netWeight"
            >
              <el-input
                v-model="temp.netWeight"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider> 单次过磅 </el-divider>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="过磅时间"
              :label-width="formLabelWidth"
              prop="enterTime"
            >
              <el-input
                v-model="temp.enterTime"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="车牌图片" prop="enterPlateName">
              <el-image
                v-if="temp.enterPlateName"
                style="height: 50px; width: 300px"
                :src="temp.enterPlateName"
                :preview-src-list="[temp.enterPlateName]"
              >
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="车辆图片" prop="enterLicenseName">
              <el-image
                v-if="temp.enterLicenseName"
                style="height: 50px; width: 300px"
                :src="temp.enterLicenseName"
                :preview-src-list="[temp.enterLicenseName]"
              >
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider> 双次过磅 </el-divider>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="过磅时间"
              :label-width="formLabelWidth"
              prop="outTime"
            >
              <el-input
                v-model="temp.outTime"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="车牌图片" prop="outPlateName">
              <el-image
                v-if="temp.outPlateName"
                style="height: 50px; width: 300px"
                :src="temp.outPlateName"
                :preview-src-list="[temp.enterPlateName]"
              >
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="车辆图片" prop="outLicenseName">
              <el-image
                v-if="temp.outLicenseName"
                style="height: 50px; width: 300px"
                :src="temp.outLicenseName"
                :preview-src-list="[temp.enterLicenseName]"
              >
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="单位名称"
              :label-width="formLabelWidth"
              prop="companyName"
            >
              <el-input
                v-model="temp.companyName"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="规格型号"
              :label-width="formLabelWidth"
              prop="goodsModel"
            >
              <el-input
                v-model="temp.goodsModel"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="司机姓名"
              :label-width="formLabelWidth"
              prop="driverName"
            >
              <el-input
                v-model="temp.driverName"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="商品名称"
              :label-width="formLabelWidth"
              prop="goodsName"
            >
              <el-input
                v-model="temp.goodsName"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="司机电话"
              :label-width="formLabelWidth"
              prop="driverMobile"
            >
              <el-input
                v-model="temp.driverMobile"
                autocomplete="off"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getdoubleManager,
  getSingleAllManager,
  updataManager,
} from "../api/record.js";
import { deepClone, parseTime } from "@/utils";
import moment from "moment";
export default {
  name: "WxgcEnterpriseClientSingle",

  data() {
    return {
      value1: "",
      total: "",
      //搜索条件
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
   
        licensePlate: null,
        searchStartTime: null,
        searchEndTime: null,
      },
           date:"",
      enterTime: "",
      tableData: [],
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备名称", field: "deviceName" },
        { label: "车次编码", field: "carNumber" },
        { label: "车牌号码", field: "licensePlate" },
        { label: "车牌颜色", field: "plateColor" },
        { label: "双次过磅时间", field: "outTime" },
        { label: "毛重", field: "grossWeight" },
        { label: "皮重", field: "tareWeight" },
        { label: "净重", field: "netWeight" },
        { label: "单位名称(t)", field: "companyName" },
        { label: "商品名称", field: "goodsName" },
        { label: "规格型号", field: "goodsModel" },
        { label: "司机姓名", field: "driverName" },
        { label: "司机电话", field: "driverMobile" },
      ],
      temp: {
        carNumber: null,
        licensePlate: null,
        plateColor: null,
        outTime: null,
        enterPlateName: null,
        enterLicenseName: null,
        grossWeight: null,
        tareWeight: null,
        companyName: null,
        goodsModel: null,
        goodsName: null,
        driverName: null,
        driverMobile: null,
        enterTime: null,
        outPlateName: null,
        outLicenseName: null,
      },
      dialogFormVisible: false,
    };
  },
  created() {
    // 加载分页数据
    this.loadPageData();
  },

  mounted() {},

  methods: {
    handleClick(row) {
      console.log(row);
    },

    //分页查询
    loadPageData() {
      this.dataLoading = true;
      if (this.date) {
          this.listQuery.searchStartTime = moment(this.date[0]).format('YYYY-MM-DD HH:mm:ss');
        this.listQuery.searchEndTime = moment(this.date[1]).format('YYYY-MM-DD HH:mm:ss');
      }
      getdoubleManager(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
            console.log("单次数据", res);
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },

    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },

    // 重置
    handReset() {
      this.listQuery.pageIndex = 1;
      this.listQuery.licensePlate = null;
       this.listQuery.searchStartTime = null;
       this.listQuery.searchEndTime = null;
      this.date = null;
      this.loadPageData();
    },
    //弹出编辑窗口之前
    handleEdit(scope) {
      this.dialogType = "edit";
      this.temp = deepClone(scope.row);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //编辑
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.updateBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          updataManager(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageData();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });
          });
        }
      });
    },

    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getSingleAllManager()
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data;
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
                filename: "过磅记录双次",
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
  },
};
</script>

<style lang="scss" scoped>
.boot {
  width: 100%;
  height: 100%;
  background: #fff;
}
.header {
  padding: 20px;
}
.filter-item {
  margin-right: 20px;
}
::v-deep.el-form-item .el-form-item__content {
  margin-left: 66px;
}
</style>
