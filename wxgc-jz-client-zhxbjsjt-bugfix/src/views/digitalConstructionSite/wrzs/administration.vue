<template>
  <div class="boot">
    <!-- 搜索栏 -->
    <div class="hearder">
      <el-input
        v-model="listQuery.deviceName"
        placeholder="设备名称"
        class="filter-item"
        style="width: 500px"
      ></el-input>
      <el-button type="primary" class="filter-item" @click="handleFilter">搜索</el-button>
      <el-button type="primary" class="filter-item" @click="handleCreate">添加</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" v-loading="dataLoading" style="width: 100%">
      <el-table-column prop="deviceName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="deviceCode" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="manufacturer" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="mobilizationTime" label="进场时间" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click.native.prevent="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteRow(scope.$index, tableData)"
            >删除</el-button
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

    <!-- 弹框 -->
<el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="temp" ref="dataForm" :rules="rules">
        <el-form-item
          label="设备名称"
          :label-width="formLabelWidth"
          prop="deviceName"
        >
          <el-input v-model="temp.deviceName" autocomplete="off"  style="width:600px"></el-input>
        </el-form-item>

        <el-form-item
          label="设备编号"
          :label-width="formLabelWidth"
          prop="deviceCode"
        >
          <el-input v-model="temp.deviceCode" autocomplete="off" style="width:600px"></el-input>
        </el-form-item>

        <el-form-item
          label="设备厂家"
          :label-width="formLabelWidth"
          prop="manufacturer"
        >
          <el-input v-model="temp.manufacturer" autocomplete="off"  style="width:600px;  margin-left: 10px;"> </el-input>
        </el-form-item>
        <el-form-item
          label="进场时间"
          :label-width="formLabelWidth"
          prop="mobilizationTime"
        >
          <el-date-picker v-model="temp.mobilizationTime" type="date" placeholder="选择日期"  style="width:600px">
          </el-date-picker>
        </el-form-item>

       <el-form-item label="上传图片" prop="devicePic">
        <upload-file
          file-type="jpg/png"
          ref="clearData"
          list-type="picture"
          accept="image/*"
          max-size="20"
          :limit="5"
          multiple
          @change="getFile"
        />
        <el-image
          v-for="(img, idx) in temp.devicePicList"
          :key="idx"
          style="height: 50px; width: 50px; margin-right: 8px"
          :src="img"
          :preview-src-list="temp.devicePicList"
        />
      </el-form-item>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploadFile from "@/components/Upload/uploadFile";
import Pagination from "@/components/Pagination";
import { deepClone, parseTime } from "@/utils";
import { simpleUploads } from "@/views/sysproject/api/ttfile";
import {getAllWeighbridgeManager,addManager,updataManager,deleteManager} from "./api/administration.js"
import moment from "moment";
export default {
  name: "administration",
    components: { Pagination, uploadFile },
  data() {
    return {
      total:"",
      input: "",
          //搜索条件
       listQuery: {
        pageIndex: 1,
        pageSize: 10,
        deviceName: undefined,
      },
        website:"",
      // 弹框重新赋值
         temp: {
            deviceName: null,
            deviceCode: null,
            manufacturer: null,
            mobilizationTime: null,
            picture1: null,
      },
      dialogFormVisible: false,
        downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      tableData:[],
        //校验功能
          rules: {
        deviceName: [
          {
            required: true,
            message: "必填设备名称",
            trigger: ["blur", "change"],
          },
        ],
        deviceCode: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        mobilizationTime: [
          {
            required: true,
            message: "必填进场时间",
            trigger: ["blur", "change"],
          },
        ],
      },
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
    getFile(fileList) {
      this.temp.devicePicList = fileList.map(file => file.url || (file.response && file.response.url));
    },
        cancel() {
      this.fileList = [];
      this.$refs.clearData.clearData();
      this.resetTemp();
      this.dialogFormVisible = false;
    },

        //分页查询
    loadPageData() {
      this.dataLoading = true;
      getAllWeighbridgeManager(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
            console.log("地磅数据",res);
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
        //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        deviceName: null,
            deviceCode: null,
            manufacturer: null,
            mobilizationTime: null,
            picture1: null,

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
            this.temp.devicePic = res[0];
            let param = JSON.parse(JSON.stringify(this.temp));
            addManager(param)
              .then((response) => {
                if (response.code == "success") {
                  this.temp.picture1 = res[0]
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

        //弹出编辑窗口之前
    handleEdit(scope) {
      this.dialogType = "edit";
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
           simpleUploads(this.fileList).then((res) => {
            this.temp.devicePic = res[0];
            let param = JSON.parse(JSON.stringify(this.temp));
            updataManager(param).then((response) => {
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

     //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteManager(rows[index].id);
          if (res.code == "success") {
            this.listQuery.pageIndex =
              this.listQuery.pageIndex > 1 ? this.listQuery.pageIndex - 1 : "1";
            this.loadPageData();
          }
          this.$message({
            type: "success",
            message: res.msg
          });
        })
        .catch(err => {
          // this.errorMsg()
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.boot {
  width: 100%;
  height: 100%;
  background: #fff;
}
.hearder {
  padding: 20px;
}
.filter-item {
  margin-right: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
