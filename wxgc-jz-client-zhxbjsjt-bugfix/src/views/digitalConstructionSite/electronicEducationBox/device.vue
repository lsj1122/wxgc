<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNo"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleDownload"
      >
        导出当前页
      </el-button>
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
      <el-table-column prop="machineNo" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="machineManufacturer" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="enterDate" label="进场时间" align="center">
      </el-table-column>
      <el-table-column  label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click.native.prevent="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" @click.native.prevent="handleSync(scope)">同步数据</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="deleteRow(scope.$index, tableData)">删除</el-button>
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
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="temp.machineName" placeholder="设备名称"/>
              </el-form-item>
              <el-form-item label="设备编号" prop="machineNo">
                <el-input v-model="temp.machineNo" placeholder="设备编号"/>
              </el-form-item>
              <el-form-item label="设备厂家" prop="machineManufacturer">
                <el-input v-model="temp.machineManufacturer" placeholder="设备厂家"/>
              </el-form-item>
              <el-form-item label="进场时间" prop="enterDate">
                <el-date-picker
                  v-model="temp.enterDate"
                  type="datetime"
                  placeholder="选择进场时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="上传图片" prop="devicePic">
                <upload-file
                  file-type="jpg/png"
                  ref="clearData"
                  list-type="picture"
                  accept="image/*"
                  max-size="20"
                  @change="getFile"
                />
                <el-image
                  v-if="temp.devicePic"
                  style="height: 50px; width: 50px"
                  :src="temp.devicePic"
                  :preview-src-list="[temp.devicePic]"
                >
                </el-image>
              </el-form-item>
            </div>
          </el-col>
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
import uploadFile from "@/components/Upload/uploadFile";

import {
  selectPageList,
  save,
  update,
  deleteById,
  sensorDataRefresh,
  sync
} from "./api/device.js";
import {deepClone, parseTime} from "@/utils";
import Pagination from "@/components/Pagination";
import {simpleUploads} from "@/views/sysproject/api/ttfile";

export default {
  name: "machine",
  components: {Pagination,uploadFile},
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: "设备编号", field: "machineNo"},
        {label: "设备名称", field: "machineName"},
        {label: "设备厂家", field: "machineManufacturer"},
        {label: "项目名称", field: "projectName"},
        {label: "进场时间", field: "enterDate"}
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        machineNo: "",
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      fileList:[],
      temp: {
        id: null,
        machineNo: "",
        machineName: "",
        enterDate: "",
        machineManufacturer: "",
        machinePic: "",
      },
      rules: {
        //校验功能
        machineNo: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        machineName: [
          {
            required: true,
            message: "必填设备名称",
            trigger: ["blur", "change"],
          },
        ],
        enterDate: [
          {
            required: true,
            message: "必填进场时间",
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
  },
  mounted() {
  },
  methods: {
    // 上传
    getFile(file, fileList) {
      this.fileList = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList = fd;
    },
    cancel() {
      this.resetTemp();
      this.dialogFormVisible = false;
    },
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteById(rows[index].id);
          if (res.code == "success") {
            rows.splice(index, 1);
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
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      this.allTableData = this.tableData;
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
          filename: "设备认证",
        });
        this.downloadLoading = false;
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
          simpleUploads(this.fileList).then((res) => {
            this.temp.machinePic = res[0];
            let param = JSON.parse(JSON.stringify(this.temp));
            save(param)
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
          })

        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.temp));
          update(param).then((response) => {
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
    handleSync(scope) {
      sync(scope.row.id).then((res)=>{
        this.$message({
          type: "success",
          message: res.msg,
        });
      })
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
