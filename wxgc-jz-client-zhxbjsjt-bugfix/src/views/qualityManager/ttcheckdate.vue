<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.type"
        placeholder="试块送检类型"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.code"
        placeholder="试块编号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.checkDate"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择预送检日期"
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
      highlight-current-row
    >
      <el-table-column prop="type" label="试块送检类型" align="center">
      </el-table-column>

      <el-table-column prop="code" label="试块编号" align="center">
      </el-table-column>

      <el-table-column prop="checkDate" label="预送检日期" align="center">
      </el-table-column>

      <el-table-column prop="careDate" label="养护时间" align="center">
      </el-table-column>

      <el-table-column prop="checkType" label="送检状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.checkType == 1"><i></i>已送检</span>
          <span v-if="scope.row.checkType == 0"><i></i>未送检</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
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
              <el-form-item label="试块送检类型" prop="type">
                <el-input v-model="temp.type" placeholder="试块送检类型" />
              </el-form-item>
              <el-form-item label="试块编号" prop="code">
                <el-input v-model="temp.code" placeholder="试块编号" />
              </el-form-item>
              <el-form-item label="预送检日期" prop="checkDate">
                <el-date-picker
                  v-model="temp.checkDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="预送检日期"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="养护时间" prop="careDate">
                <el-date-picker
                  v-model="temp.careDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="养护时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="送检状态" prop="checkType">
                <el-select
                  v-model="temp.checkType"
                  clearable
                  filterable
                  placeholder="请选择类型"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="报告单1" prop="report1">
                <upload-file
                  file-type="*"
                  ref="clearData"
                  list-type="*"
                  accept="*"
                  max-size="100"
                  @change="getFile"
                />
                <a v-if="temp.report1" @click="view(temp.report1)">{{
                  temp.report1.split("/").pop()
                }}</a>
                <a
                  style="color: dodgerblue"
                  v-if="temp.report1"
                  :href="
                    '/wxgc-api/wxgc/plus/tt-file/downLoadFile?filePath=' +
                    temp.report1
                  "
                  >下载</a
                >
              </el-form-item>
              <el-form-item label="报告单2" prop="report2">
                <upload-file
                  file-type="*"
                  ref="clearData1"
                  list-type="*"
                  accept="*"
                  max-size="100"
                  @change="getFile1"
                />
                <a v-if="temp.report2" @click="view(temp.report2)">{{
                  temp.report2.split("/").pop()
                }}</a>
                <a
                  style="color: dodgerblue"
                  v-if="temp.report2"
                  :href="
                    '/wxgc-api/wxgc/plus/tt-file/downLoadFile?filePath=' +
                    temp.report2
                  "
                  >下载</a
                >
              </el-form-item>
              <el-form-item label="报告单3" prop="report3">
                <upload-file
                  file-type="*"
                  ref="clearData2"
                  list-type="*"
                  accept="*"
                  max-size="100"
                  @change="getFile2"
                />
                <a v-if="temp.report3" @click="view(temp.report3)">{{
                  temp.report3.split("/").pop()
                }}</a>
                <a
                  style="color: dodgerblue"
                  v-if="temp.report3"
                  :href="
                    '/wxgc-api/wxgc/plus/tt-file/downLoadFile?filePath=' +
                    temp.report3
                  "
                  >下载</a
                >
              </el-form-item>
            </div></el-col
          >
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
  </div>
</template>

<script>
import {
  getPageTtCheckDate,
  getAllTtCheckDate,
  addTtCheckDate,
  updateTtCheckDate,
  deleteTtCheckDate,
} from "./api/ttcheckdate.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import uploadFile from "@/components/Upload/uploadFile";
import { simpleUploads } from "@/views/sysproject/api/ttfile"; // secondary package based on el-pagination
export default {
  name: "TtCheckDate",
  components: { Pagination, uploadFile },
  data() {
    return {
      loading: false,
      fileList: [],
      fileList1: [],
      fileList2: [],
      options: [
        { name: "未送检", value: 0 },
        { name: "已送检", value: 1 },
      ],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "试块送检类型", field: "type" },
        { label: "试块编号", field: "code" },
        { label: "预送检日期", field: "checkDate" },
        { label: "养护时间", field: "careDate" },
        { label: "送检状态", field: "checkType" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        type: undefined,
        code: undefined,
        checkDate: undefined,
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
        projectId: null,
        type: null,
        code: null,
        checkDate: null,
        careDate: null,
        checkType: null,
        report1: null,
        report2: null,
        report3: null,
      },
      rules: {
        //校验功能
        type: [
          {
            required: true,
            message: "必填试块送检类型",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          {
            required: true,
            message: "必填试块编号",
            trigger: ["blur", "change"],
          },
        ],
        checkDate: [
          {
            required: true,
            message: "必填预送检日期",
            trigger: ["blur", "change"],
          },
        ],
        careDate: [
          {
            required: true,
            message: "必填养护时间",
            trigger: ["blur", "change"],
          },
        ],
        checkType: [
          {
            required: true,
            message: "必填送检状态",
            trigger: ["blur", "change"],
          },
        ],
      },
      noRotate: false,
      checkAll: false,
      isIndeterminate: false,
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    view(path) {
      this.$alert(`<img src="${path}" width="800"/>`, "预览", {
        dangerouslyUseHTMLString: true,
        customClass: "messagebox",
        showCancelButton: false,
        showConfirmButton: false,
        center: true,
      });
    },
    cancel() {
      this.fileList = [];
      this.fileList1 = [];
      this.fileList2 = [];
      this.$refs.clearData.clearData();
      this.$refs.clearData1.clearData();
      this.$refs.clearData2.clearData();
      this.resetTemp();
      this.dialogFormVisible = false;
    },
    getFile(file, fileList) {
      this.fileList = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList = fd;
    },
    getFile1(file, fileList) {
      this.fileList1 = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList1 = fd;
    },
    getFile2(file, fileList) {
      this.fileList2 = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList2 = fd;
    },
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除此信息?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtCheckDate(rows[index].id);
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
      getPageTtCheckDate(this.listQuery)
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
      getPageTtCheckDate(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
              for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].checkType =
                this.allTableData[i].checkType == 1
                  ? "已送检"
                  : this.allTableData[i].checkType == 0
                    ? "未送检"
                    : "";
            }
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
                filename: "试块养护",
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
    //充值临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        id: null,
        projectId: null,
        type: null,
        code: null,
        checkDate: null,
        careDate: null,
        checkType: null,
        report1: null,
        report2: null,
        report3: null,
      };
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
       if (
        !this.$store.getters.projectId ||
        this.$store.getters.projectChildrenIds.length > 0
      ) {
        this.$message({
          message: "请先选择具体项目再添加数据",
          type: "warning",
        });
        return;
      }
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //增加
    createData() {
      this.loading = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          simpleUploads(this.fileList).then((res) => {
            this.temp.report1 = res[0];
            simpleUploads(this.fileList1).then((res) => {
              this.temp.report2 = res[0];
              simpleUploads(this.fileList2).then((res) => {
                this.temp.report3 = res[0];
                this.temp.createBy = this.$store.getters.name;
                let param = JSON.parse(JSON.stringify(this.temp));
                addTtCheckDate(param)
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
              });
            });
          });
        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          simpleUploads(this.fileList).then((res) => {
            this.temp.report1 = res[0];
            simpleUploads(this.fileList1).then((res) => {
              this.temp.report2 = res[0];
              simpleUploads(this.fileList2).then((res) => {
                this.temp.report3 = res[0];
                this.temp.updateBy = this.$store.getters.name;
                let param = JSON.parse(JSON.stringify(this.temp));
                updateTtCheckDate(param).then((response) => {
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
              });
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
