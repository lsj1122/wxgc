<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.sensorId"
        placeholder="传感器id"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.onlineStatus"
        filterable
        placeholder="请选择"
        clearable
      >
        <el-option label="在线" value="1"> </el-option>
        <el-option label="不在线" value="0"> </el-option>
      </el-select>
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
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        icon="el-icon-refresh"
        @click="sensorDataRefresh"
      >
        刷新
      </el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button> -->
    </div>
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column prop="sensorName" label="传感器名称" align="center">
      </el-table-column>

      <el-table-column prop="sensorId" label="传感器id" align="center">
      </el-table-column>

      <el-table-column prop="machineNumber" label="关联设备编号" align="center">
      </el-table-column>

      <el-table-column
        prop="maxLength"
        label="传感器最大检测长度"
        align="center"
      >
      </el-table-column>

      <el-table-column prop="onlineStatus" label="在线状态" align="center">
        <template slot-scope="scope">
          {{
            scope.row.onlineStatus == 1
              ? "在线"
              : scope.row.onlineStatus == 2
              ? "不在线"
              : ""
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.row)"
            >删除</el-button
          >
        </template>
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

    <!--增加或修改弹出层-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :before-close="cancel"
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
          <el-col :span="24"
            ><div class="grid-content bg-purple">
              <el-form-item label="传感器名称" prop="sensorName">
                <el-input v-model="temp.sensorName" placeholder="传感器名称" />
              </el-form-item>
              <el-form-item label="传感器id" prop="sensorId">
                <el-input
                  v-model="temp.sensorId"
                  placeholder="传感器id"
                  :disabled="dialogStatus == 'update'"
                />
              </el-form-item>
              <!-- <el-form-item label="关联设备名称" prop="machineName">
                <el-input
                  v-model="temp.machineName"
                  placeholder="关联设备名称"
                />
              </el-form-item> -->
              <el-form-item label="关联设备" prop="machineNumber">
                <el-select
                  v-model="temp.machineNumber"
                  filterable
                  placeholder="请选择"
                  @change="handleMachine"
                >
                  <el-option
                    v-for="item in allMachines"
                    :key="item.id"
                    :value="item.machineNumber"
                    :label="item.machineName"
                  ></el-option>
                </el-select>
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
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
  </div>
</template>

<script>
import {
  selectPageList,
  saveSensor,
  updateSensor,
  deleteTtTj,
  selectTtTjByNum,
  sensorDataRefresh,
} from "./api/tttj.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
export default {
  name: "machine",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineName" },
        { label: "进场时间", field: "innerDate" },
        { label: "设备型号", field: "model" },
        { label: "前臂长(m)", field: "armLong" },
        { label: "钢丝绳倍率", field: "rope" },
        { label: "最大吊重(t)", field: "maxWeight" },
        { label: "最大力矩(t/m)", field: "maxDistance" },
        { label: "产权单位", field: "property" },
        { label: "安装单位", field: "install" },
        { label: "生产单位", field: "production" },
        { label: "司机姓名", field: "name" },
        { label: "手机号码", field: "phone" },
        { label: "作业证编号", field: "specialCard" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        sensorId: "",
        onlineStatus: "",
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        sensorName: "",
        sensorId: "",
        machineName: "",
        machineNumber: "",
      },
      rules: {
        //校验功能
        sensorName: [
          {
            required: true,
            message: "必填传感器名称",
            trigger: ["blur", "change"],
          },
        ],
        sensorId: [
          {
            required: true,
            message: "必填传感器id",
            trigger: ["blur", "change"],
          },
        ],
        machineNumber: [
          {
            required: true,
            message: "必选择关联设备",
            trigger: ["blur", "change"],
          },
        ],
      },
      allMachines: [],
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
    this.selectTtTjByNum();
  },
  mounted() {},
  methods: {
    cancel() {
      this.resetTemp();
      this.dialogFormVisible = false;
    },
    //删除单行
    deleteRow(val) {
      console.log(val)
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtTj({ sensorId: val.sensorId });
          if (res.code == "success") {
            this.loadPageData();
            this.$message({
              type: "success",
              message: res.msg,
            });
          }
        })
        .catch((err) => {
          // this.errorMsg()
        });
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      selectPageList(this.listQuery)
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
    // //下载Excel表格
    // handleDownload() {
    //   this.downloadLoading = true;
    //   let self = this;
    //   getAllTtTj()
    //     .then((res) => {
    //       if (res.code == "success") {
    //         this.allTableData = res.data;
    //         import("@/vendor/Export2Excel").then((excel) => {
    //           const tHeader = [];
    //           const filterVal = [];
    //           for (let column of self.columns) {
    //             tHeader.push(column.label);
    //             filterVal.push(column.field);
    //           }
    //           const data = this.formatJson(filterVal);
    //           excel.export_json_to_excel({
    //             header: tHeader,
    //             data,
    //             filename: "列表",
    //           });
    //           this.downloadLoading = false;
    //         });
    //       } else {
    //         this.errorMsg("下载数据失败");
    //       }
    //     })
    //     .catch((err) => {
    //       this.errorMsg();
    //     });
    // },
    // formatJson(filterVal) {
    //   return this.allTableData.map((v) =>
    //     filterVal.map((j) => {
    //       if (j === "timestamp") {
    //         return parseTime(v[j]);
    //       } else if (j === "timestamp") {
    //         return parseTime(v[j]);
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // },
    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        id: null,
        sensorName: null,
        sensorId: null,
        machineName: null,
        machineNumber: null,
      };
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
    //增加
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.temp));
          saveSensor(param)
            .then((response) => {
              if (response.code == "success") {
                this.cancel();
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
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.temp));
          updateSensor(param).then((response) => {
            if (response.code == "success") {
              this.cancel();
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
    //弹出修改窗口之前，填充值
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogStatus = "update";
      this.temp = deepClone(scope.row);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    close() {
      this.imagecropperShow = false;
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
    selectTtTjByNum() {
      selectTtTjByNum().then((res) => {
        this.allMachines = res.data;
      });
    },
    handleMachine(id) {
      let obj = {};
      obj = this.allMachines.find((item) => {
        return item.machineNumber == id;
      });
      this.temp.machineName = obj.machineName;
    },
    sensorDataRefresh() {
      sensorDataRefresh().then((res) => {
        this.loadPageData();
        if (res.code == "success") {
          this.$message.success("刷新成功");
        } else {
          this.$message.error(res.msg);
        }
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
