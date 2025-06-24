<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.role"
        placeholder="职务"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.imgUrl"
        placeholder="照片"
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
      <el-table-column fixed prop="role" label="职务" align="center">
      </el-table-column>

      <el-table-column fixed prop="name" label="姓名" align="center">
      </el-table-column>

      <el-table-column fixed prop="imgUrl" label="照片" align="center">
        <template slot-scope="scope">
          <el-image
            style="height: 50px; width: 50px"
            :src="scope.row.imgUrl"
            :preview-src-list="[scope.row.imgUrl]"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
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
              <el-form-item label="职务" prop="role">
                <el-input v-model="temp.role" placeholder="职务" />
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" placeholder="姓名" />
              </el-form-item>
              <upload-file
                file-type="jpg/png"
                ref="clearData"
                list-type="picture"
                accept="image/*"
                max-size="20"
                @change="getFile"
              /></div
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
import {
  getPageTtPartyMember,
  getAllTtPartyMember,
  addTtPartyMember,
  updateTtPartyMember,
  deleteTtPartyMember,
} from "./api/ttpartymember.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import { simpleUploads } from "@/views/sysproject/api/ttfile";
import uploadFile from "@/components/Upload/uploadFile"; // secondary package based on el-pagination
import axios from 'axios';

// Function to download an image and convert it to a Base64 string
async function convertImageToBase64(url) {
  try {
    // Fetch the image data as an array buffer
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    // Convert the array buffer to a Base64 string
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    
    // Return the Base64 string with the appropriate data URI prefix
    return `data:image/jpeg;base64,${base64}`; // Adjust MIME type if necessary
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
}

export default {
  name: "TtPartyMember",
  components: { Pagination, uploadFile },
  data() {
    return {
      loading: false,
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "职务", field: "role" },
        { label: "姓名", field: "name" },
        { label: "照片", field: "imgUrl" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        projectId: undefined,
        role: undefined,
        name: undefined,
        imgUrl: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      fileList: [],
      temp: {
        id: null,
        projectId: null,
        role: null,
        name: null,
        imgUrl: null,
      },
      rules: {
        //校验功能
        role: [
          { required: true, message: "必填职务", trigger: ["blur", "change"] },
        ],
        name: [
          { required: true, message: "必填姓名", trigger: ["blur", "change"] },
        ],
        imgUrl: [
          { required: true, message: "必填照片", trigger: ["blur", "change"] },
        ],
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
      this.$refs.clearData.clearData();
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
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除此信息?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtPartyMember(rows[index].id);
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
      getPageTtPartyMember(this.listQuery)
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
      getPageTtPartyMember(this.listQuery)
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
              const data = this.formatJson(filterVal).map(row => {
                if (row.imgUrl) {
                  row.imgUrl = this.convertImageToBase64(row.imgUrl);
                }
                return row;
              });
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: "组织成员",

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
        role: null,
        name: null,
        imgUrl: null,
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
          // if (this.fileList.length == 0) {
          //   this.$message.error("请选择图片");
          //   this.loading = false;
          //   return;
          // }
          simpleUploads(this.fileList).then((res) => {
            this.temp.imgUrl = res[0];
            this.temp.createBy = this.$store.getters.name;
            let param = JSON.parse(JSON.stringify(this.temp));
            addTtPartyMember(param)
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
        }
      });
    },
    //修改
    updateData() {
      this.loading = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.fileList.length == 0) {
            this.$message.error("请选择图片");
            this.loading = false;
            return;
          }
          simpleUploads(this.fileList).then((res) => {
            this.temp.imgUrl = res[0];
            this.temp.updateBy = this.$store.getters.name;
            let param = JSON.parse(JSON.stringify(this.temp));
            updateTtPartyMember(param).then((response) => {
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
