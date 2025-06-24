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
      <el-table-column prop="text" label="标题" align="center">
      </el-table-column>

      <el-table-column prop="pictureFilePath" label="图片预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="height: 50px; width: 50px"
            :src="scope.row.pictureFilePath"
            :preview-src-list="[scope.row.pictureFilePath]"
          >
          </el-image>
        </template>
      </el-table-column>

      <!-- <el-table-column
        prop="pictureFilePath"
        label="图片上传地址"
        align="center"
      >
      </el-table-column> -->
<!--
      <el-table-column prop="videoFilePath" label="视频上传地址" align="center">
      </el-table-column> -->

      <el-table-column prop="createTime" label="上传时间" align="center">
      </el-table-column>

      <el-table-column prop="createBy" label="上传人" align="center">
      </el-table-column>

      <el-table-column label="操作" align="center">
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
      v-loading="loading"
      element-loading-text="上传中,请勿刷新页面"
      :title="textMap[dialogStatus]"
      :before-close="cancel"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
      destroy-on-close="true"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-form-item label="标题" prop="text">
          <el-input v-model="temp.text" placeholder="标题" />
        </el-form-item>
        <h3>封面图:</h3>
        <!-- 单文件上传,无multiple -->
        <upload-file
          file-type="jpg/png"
          ref="clearData"
          list-type="picture"
          accept="image/*"
          max-size="20"
          @change="getFile"
        />
        <h3>视频:</h3>
        <upload-file
          file-type="mp4"
          ref="clearData1"
          list-type="video"
          accept="video/*"
          max-size="1000"
          @change="getFile1"
        />
        <el-form-item label="上传进度">
          <el-progress
            style="top: 10px"
            :text-inside="true"
            :stroke-width="18"
            :percentage="upTotal"
          ></el-progress>
        </el-form-item>
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
  getPageTtUploadFile,
  addTtUploadFile,
  deleteTtUploadFile,
} from ".././sysproject/api/ttuploadfile.js";
import { simpleUploads } from ".././sysproject/api/ttfile.js";
import Pagination from "@/components/Pagination";
import { updateTtUploadFile } from ".././sysproject/api/ttuploadfile";
import { deepClone } from "@/utils";
import OSS from "ali-oss";
import moment from "moment";
export default {
  name: "dataVideo",
  components: { Pagination, uploadFile },
  data() {
    return {
      ossConfig: {
        region: "oss-cn-hangzhou",
        accessKeyId: "LTAI4GKpzVjLoHp8rrrpTLFK",
        accessKeySecret: "sQHHfIvEr981dLIMUPwlSxJsx7cQcB",
        bucket: "newzhuochuang",
      },
      upTotal: 0,
      loading: false,
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      dataLoading: false,
      dialogFormVisible: false,
      temp: {
        id: null,
        text: null,
        pictureFilePath: null,
        videoFilePath: null,
        type: 4,
      },
      fileList: [],
      fileName1: "",
      fileList1: "",
      rules: {
        text: [
          { required: true, message: "必填内容", trigger: ["blur", "change"] },
        ],
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        createBy: undefined,
        type: 4,
      },
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    cancel() {
      this.fileList = [];
      this.fileName1 = "";
      this.fileList1 = "";
      this.$refs.clearData.clearData();
      this.$refs.clearData1.clearData();
      this.upTotal = 0;
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
      this.fileName1 = fileList[0].name;
      this.fileList1 = fileList[0].raw;
    },
    //单击添加选择文件
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
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
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
    //增加
    createData() {
      let that = this;
      this.loading = true;
      if (this.fileList.length == 0) {
        this.$message.error("请选择图片");
        this.loading = false;
        return;
      }
      if (this.fileName1 == "") {
        this.$message.error("请选择视频");
        this.loading = false;
        return;
      }
      simpleUploads(this.fileList).then((res) => {
        this.temp.pictureFilePath = res[0];
        new OSS(this.ossConfig)
          .multipartUpload(
            moment().format("yyyyMMDD") + "/" + this.fileName1,
            this.fileList1,
            {
              progress: function (p, checkpoint) {
                that.upTotal = parseInt(p * 100);
              },
              meta: { year: 2021, people: "test" },
              mime: "image/jpeg",
            }
          )
          .then((res) => {
            this.temp.videoFilePath =
              "https://" +
              this.ossConfig.bucket +
              "." +
              this.ossConfig.region +
              ".aliyuncs.com" +
              "/" +
              moment().format("yyyyMMDD") +
              "/" +
              this.fileName1;
            let param = JSON.parse(JSON.stringify(this.temp));
            addTtUploadFile(param)
              .then((response) => {
                this.loading = false;
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
    },
    //修改
    updateData() {
      let that = this;
      this.loading = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          simpleUploads(this.fileList).then((res) => {
            this.temp.pictureFilePath = res[0];
            if (this.fileName1 == "") {
              let param = JSON.parse(JSON.stringify(this.temp));
              updateTtUploadFile(param).then((response) => {
                this.loading = false;
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
            } else {
              new OSS(this.ossConfig)
                .multipartUpload(
                  moment().format("yyyyMMDD") + "/" + this.fileName1,
                  this.fileList1,
                  {
                    progress: function (p, checkpoint) {
                      that.upTotal = parseInt(p * 100);
                    },
                    meta: { year: 2021, people: "test" },
                    mime: "image/jpeg",
                  }
                )
                .then((res) => {
                  this.temp.videoFilePath =
                    "https://" +
                    this.ossConfig.bucket +
                    "." +
                    this.ossConfig.region +
                    ".aliyuncs.com" +
                    "/" +
                    moment().format("yyyyMMDD") +
                    "/" +
                    this.fileName1;
                  let param = JSON.parse(JSON.stringify(this.temp));
                  updateTtUploadFile(param).then((response) => {
                    this.loading = false;
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
            }
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

        let pictureFilePath = scope.row.pictureFilePath;
        let videoFilePath = scope.row.videoFilePath;
        let pictureFileName = pictureFilePath.substring(pictureFilePath.lastIndexOf("/") + 1,pictureFilePath.length);
        let videoFileName = videoFilePath.substring(videoFilePath.lastIndexOf("/") + 1,videoFilePath.length);
        this.$refs.clearData.addFile({name:pictureFileName,url:pictureFilePath})
        this.$refs.clearData1.addFile({name:videoFileName,url:videoFilePath})
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
    //重置临时变量值
    resetTemp() {
      this.temp = {
        id: null,
        text: null,
        pictureFilePath: null,
        videoFilePath: null,
        type: 4,
      };
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
