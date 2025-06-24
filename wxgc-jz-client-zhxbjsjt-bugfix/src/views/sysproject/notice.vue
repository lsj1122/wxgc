<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.createBy"
        placeholder="上传人"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

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
      <el-table-column fixed prop="text" label="内容" align="center">
      </el-table-column>
      <el-table-column fixed prop="scope" label="通知时段" align="center">
        <template slot-scope="scope">
          {{scope.row.beginTime}}-{{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column fixed prop="createTime" label="上传时间" align="center">
      </el-table-column>

      <el-table-column fixed prop="createBy" label="上传人" align="center">
      </el-table-column>
      <!-- <el-table-column
        fixed
        prop="pictureFilePath"
        label="附件地址"
        align="center"
      >
      </el-table-column> -->
      <el-table-column fixed label="下载附件" align="center">
        <template slot-scope="scope"
          ><el-button
            type="success"
            plain
            size="small"
            @click="downFn(scope.row)"
            >打包下载</el-button
          >
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
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
      :before-close="cancel"
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
              <el-form-item label="内容" prop="text">
                <el-input v-model="temp.text" placeholder="内容" />
              </el-form-item>
              <el-form-item label="通知时段" prop="beginTime">
                <el-date-picker
                  ref="datePicker"
                  v-model="noticeRange"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="{ disabledDate: time => time.getTime() <= Date.now() }"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="附件">
                <upload-file
                  file-type="*"
                  ref="clearData"
                  list-type="*"
                  accept="*"
                  max-size="100"
                  :multiple="true"
                  :limit="5"
                  :fileListRe="fileListRe"
                  @change="getFile"
                />
              </el-form-item></div
          ></el-col>
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
import moment from "moment";
import uploadFile from "@/components/Upload/uploadFile";
import { simpleUploads } from ".././sysproject/api/ttfile.js";
import {
  getPageTtUploadFile,
  addTtUploadFile,
  updateTtUploadFile,
  deleteTtUploadFile,
} from "./api/ttuploadfile.js";
import { handleBatchDownload } from "@/utils/zipDownFile";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "notice",
  components: { Pagination, uploadFile },
  data() {
    return {
      fileListRe: [],
      fileList: [],
      fileListLength: [],
      fileListLengthUpdata: [],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        createBy: undefined,
        type: 0,
      },
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      noticeRange:[],
      temp: {
        id: null,
        text: null,
        type: 0,
        date: [],
        beginTime: "",
        endTime: "",
      },
      rules: {
        //校验功能
        text: [
          { required: true, message: "必填内容", trigger: ["blur", "change"] },
        ],
        beginTime: [
          { required: true, message: "必填内容", trigger: ["change"] },
        ],
      },
    };
  },
  watch: {
    noticeRange(val) {
      this.temp.beginTime = val[0];
      this.temp.endTime = val[1];
    },
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    downFn(row) {
      console.log(row);
      if (row.pictureFilePath && row.pictureFilePath.length > 0) {
        let arr = row.pictureFilePath.split(",");
        handleBatchDownload(
          arr.map((item) => {
            return item;
          })
        );
      } else {
        this.$message({
          message: "暂无附件下载",
          type: "warning",
        });
      }
    },
    cancel() {
      this.$refs.clearData.clearData();
      this.resetTemp();
      this.dialogFormVisible = false;
    },
    getFile(file, fileList) {
      this.fileList = [];
      this.fileListLength = [];
      this.fileListLengthUpdata = [];
      console.log("fileList", fileList);
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        this.fileListLength.push(fileList[i]);

        if (!fileList[i].url) {
          fd.append("fileList", fileList[i].raw);
          this.fileListLengthUpdata.push("1");
        }
      }
      this.fileList = fd;
    },
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtUploadFile(rows[index].id);
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
      getPageTtUploadFile(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
            console.log("表格数据", this.tableData);
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
      this.fileList = [];
      this.fileListLength = [];
      this.fileListRe = [];
      this.noticeRange = [];
      let that = this;
      this.temp = {
        id: null,
        text: null,
        type: 0,
        date: [],
        beginTime: "",
        endTime: "",
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
      let _this = this;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.fileListLength.length > 0) {
            simpleUploads(this.fileList).then((res) => {
              console.log("上传的res", res);
              _this.temp.pictureFilePath = res.join(",");
              console.log("_this.temp", _this.temp);
              _this.addTtUploadFile();
            });
          } else {
            this.addTtUploadFile();
          }
        }
      });
    },
    addTtUploadFile() {
      this.temp.beginTime = this.noticeRange[0];
      this.temp.endTime = this.noticeRange[1];
      let param = JSON.parse(JSON.stringify(this.temp));
      addTtUploadFile(param)
        .then((response) => {
          if (response.code == "success") {
            this.dialogFormVisible = false;
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
          this.cancel();
          this.errorMsg();
        });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        var _this = this;
        if (valid) {
          //

          if (this.fileListLength.length > 0) {
            var arr = [];
            this.fileListLength.forEach((item) => {
              if (item.url) {
                arr.push(item.url);
              }
            });
            console.log("arr", arr);
            if (this.fileListLengthUpdata.length > 0) {
              simpleUploads(this.fileList).then((res) => {
                console.log("上传的res", res);
                let newRes = res;
                arr.forEach((item) => {
                  newRes.push(item);
                });
                _this.temp.pictureFilePath = newRes.join(",");
                console.log("_this.temp", _this.temp);
                _this.updateTtUploadFile();
              });
            } else {
              _this.temp.pictureFilePath = arr.join(",");
              console.log("_this.temp", _this.temp);
              _this.updateTtUploadFile();
            }
          } else {
            _this.updateTtUploadFile();
          }
        }
      });
    },
    updateTtUploadFile() {
      this.temp.beginTime = this.noticeRange[0];
      this.temp.endTime = this.noticeRange[1];
      let param = JSON.parse(JSON.stringify(this.temp));
      updateTtUploadFile(param).then((response) => {
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
    },
    //弹出修改窗口之前，填充值
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogStatus = "update";
      this.temp = deepClone(scope.row);
      this.dialogFormVisible = true;

      // this.fileList =scope.row
      console.log(450,'scope.row', scope.row,'this.temp',this.temp);
      // 时间段
      // 重置日期为初始值
      this.noticeRange=[];
      this.$set(this.noticeRange,0,scope.row.beginTime)
      this.$set(this.noticeRange,1,scope.row.endTime)
      console.log(455,'scope.row', scope.row,'this.temp',this.temp);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        if (scope.row.pictureFilePath && scope.row.pictureFilePath.length > 0) {
          this.fileListRe = scope.row.pictureFilePath.split(",").map((item) => {
            let arr = item.split("/");
            arr = arr[arr.length - 1];
            return { url: item, name: arr };
          });
        } else {
          this.fileListRe = [];
        }
      });
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
