<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.createBy"
        placeholder="填报人"
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
        v-if="addShow"
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
      height="calc(100vh - 260px)"
      highlight-current-row
    >
      <el-table-column fixed prop="proName" label="项目名称" align="center">
      </el-table-column>

      <el-table-column fixed prop="creatBy" label="填报人" align="center">
      </el-table-column>
      <el-table-column fixed prop="percentage" label="实际进度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.percentage }}</span> <span>%</span>
        </template>
      </el-table-column>

      <el-table-column fixed prop="fillTime" label="填报时间" align="center">
      </el-table-column>
      <el-table-column fixed prop="remark" label="进度描述" align="center">
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)">编辑</el-button>
          <el-button
            v-if="addShow"
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
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="实际进度" prop="text">
                <el-input
                  v-model="temp.text"
                  placeholder="请输入项目进度"
                  type="number"
                  maxlength="2"
                />
                <span style="margin-left: 2%">%</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="填报时间" prop="checkTime">
                <el-date-picker
                  v-model="temp.checkTime"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择填报时间"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="grid-content bg-purple">
              <el-form-item label="进度描述">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="temp.remark"
                >
                </el-input>
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
  </div>
</template>

<script>
import {
  getProjectProgress,
  addProjectProgressList,
  bianjiProjectProgress,
  deleteProjectProgress,
} from "./api/ttuploadfile.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "notice",
  components: { Pagination },
  data() {
    return {
      addShow: true,
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
      temp: {
        id: null,
        text: null,
        checkTime: null,
        type: 0,
        remark:''
      },
      rules: {
        //校验功能
        text: [
          // { required:  true , message: '必填内容', trigger: ['blur', 'change'] },
          { required: true, message: "不能为空,且为数字" },

          {
            pattern: /^(?:0|[1-9][0-9]?|100)$/,
            message: "范围在0-100,且为整数",
            trigger: ["blur", "change"],
          },
        ],
        checkTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    if (this.$store.getters.projectChildrenIds.length>0) {
      this.addShow = false;
    }
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteProjectProgress(rows[index].id);
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
      // 得到项目进度列表
      this.dataLoading = true;
      getProjectProgress(this.listQuery)
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
        text: null,
        type: 0,
        remark:''
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
          var obj = {
            percentage: this.temp.text,
            fillTime: this.temp.checkTime,
            remark:this.temp.remark
          };
          addProjectProgressList(obj)
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
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var obj = {
            percentage: this.temp.text,
            fillTime: this.temp.checkTime,
            id: this.temp.id,
            remark:this.temp.remark
          };

          // console.log(param)
          bianjiProjectProgress(obj).then((response) => {
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
    //弹出修改窗口之前，填充值
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogStatus = "update";
      this.temp.text = deepClone(scope.row).percentage;
      this.temp.checkTime = deepClone(scope.row).fillTime;
      this.temp.id = deepClone(scope.row).id;
      this.temp.remark = scope.row.remark;

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
<style lang="less" scoped>
/deep/.el-form-item__content {
  display: flex !important;
}
</style>
