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
      <el-select
        v-model="listQuery.machineType"
        clearable
        filterable
        placeholder="请选择水电表"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
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
      </el-date-picker> -->
      <el-date-picker
        v-model="date"
        align="right"
        type="datetimerange"
        clearable
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ "新增" }}
      </el-button> -->
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
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      fit
      height="calc(100vh - 260px)"
      highlight-current-row
    >
      <!--      <el-table-column prop="machineName" label="设备名称" align="center">-->
      <!--      </el-table-column>-->
      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="machineType" label="设备类型" align="center">
      </el-table-column>
      <el-table-column prop="sumData" label="累计用量" align="center">
      </el-table-column>
      <el-table-column prop="dayData" label="今日用量" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--增加或修改弹出层-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备编号" prop="machineNumber">
                <el-select
                  v-model="temp.machineNumber"
                  clearable
                  filterable
                  placeholder="请选择设备编号"
                >
                  <el-option
                    v-for="item in optionsMachineNumber"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="记录日期" prop="createTime">
                <el-date-picker
                  v-model="temp.createTime"
                  align="right"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="累计用量" prop="sumData">
                <el-input v-model="temp.sumData" type="number" />
              </el-form-item>
              <el-form-item label="今日用量" prop="dayData">
                <el-input v-model="temp.dayData" type="number" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

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
  </div>
</template>

<script>
import {
  getPageEleWaterWorkData,
  getAllEleWaterWorkData,
  addEleWaterWorkData,
  updateEleWaterWorkData,
  deleteEleWaterWorkData,
  getSheBeiInfo,
} from "./api/elewaterworkdata.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import { getPageYcjcWorkData } from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata"; // secondary package based on el-pagination
export default {
  name: "history",
  components: { Pagination },
  data() {
    return {
      date: "",
      options: ["水表", "电表"],
      optionsMachineNumber: [],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        // {label: "设备名称", field: "machineName"},
        { label: "设备编号", field: "machineNumber" },
        { label: "设备类型", field: "machineType" },
        { label: "累计用电量", field: "sumData" },
        { label: "今日用电量", field: "dayData" },
        { label: "创建日期", field: "createTime" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        machineNumber: undefined,
        sDate: undefined,
        eDate: undefined,
        machineType: undefined,
      },
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      downloadLoading: false,
      temp: {
        machineNumber: "",
        createTime: "",
        sumData: "",
        dayData: "",
      },
      rules: {
        //校验功能
        machineNumber: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        createTime: [
          {
            required: true,
            message: "必填记录日期",
            trigger: ["blur", "change"],
          },
        ],
        sumData: [
          {
            required: true,
            message: "必填累计用量",
            trigger: ["blur", "change"],
          },
        ],
        dayData: [
          {
            required: true,
            message: "必填今日用量",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  watch: {
    date(date) {
      if (date) {
        this.listQuery.sDate = date[0];
        this.listQuery.eDate = date[1];
      } else {
        this.listQuery.sDate = undefined;
        this.listQuery.eDate = undefined;
      }
    },
  },
  created() {
    //加载分页数据
    this.loadPageData();
    //获取设备的编号
    this.getSheBeiInfo();
  },
  mounted() {},
  methods: {
    // 添加
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.temp));
          addEleWaterWorkData(param)
            .then((response) => {
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
            })
            .catch((err) => {
              console.log(err);
              this.errorMsg();
            });
        }
      });
    },
    //删除
    deleteRow(scope) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteEleWaterWorkData(scope.row.id);
          console.log(res);
          if (res.code == "success") {
            if (this.tableData.length == 1) {
              this.listQuery.pageIndex =
                this.listQuery.pageIndex > 1
                  ? this.listQuery.pageIndex - 1
                  : "1";
            }
            this.loadPageData();
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {
          // this.errorMsg()
        });
    },
    //弹出修改窗口之前，编辑
    handleEdit(scope) {
      this.dialogStatus = "update";
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
          let param = JSON.parse(JSON.stringify(this.temp));

          updateEleWaterWorkData(param)
            .then((response) => {
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
            })
            .catch((err) => {
              console.log(err);
              this.errorMsg();
            });
        }
      });
    },
    //获取设备的编号
    getSheBeiInfo() {
      getSheBeiInfo().then((res) => {
        console.log("获取设备的编号：", res);
        this.optionsMachineNumber = res;
      });
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {},
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageEleWaterWorkData(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
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
      getPageEleWaterWorkData(this.listQuery)
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
                filename: "列表",
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
