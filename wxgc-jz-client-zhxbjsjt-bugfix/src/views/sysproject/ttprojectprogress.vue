<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.progressName"
        placeholder="进度名称"
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
    <div class="tablebox">
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        height="100%"
        stripe
        fit
        highlight-current-row
      >
        <el-table-column prop="progressName" label="进度名称" align="center">
        </el-table-column>

        <el-table-column prop="planStart" label="计划开始时间" align="center">
        </el-table-column>

        <el-table-column prop="planEnd" label="计划结束时间" align="center">
        </el-table-column>

        <el-table-column prop="realStart" label="实际开始时间" align="center">
        </el-table-column>

        <el-table-column prop="realEnd" label="实际结束时间" align="center">
        </el-table-column>

        <el-table-column prop="sort" label="排序" align="center">
        </el-table-column>

        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0"><i></i>项目进度</span>
            <span v-if="scope.row.type == 1"><i></i>里程碑节点</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope)"
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
    </div>
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
              <el-form-item label="进度名称" prop="progressName">
                <el-input v-model="temp.progressName" placeholder="进度名称" />
              </el-form-item>
              <el-form-item label="计划开始时间" prop="planStart">
                <el-date-picker
                  v-model="temp.planStart"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="计划开始时间"
                  :picker-options="{ disabledDate: time => time.getTime() <= Date.now() }"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="计划结束时间" prop="planEnd">
                <el-date-picker
                  v-model="temp.planEnd"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="计划结束时间"
                  :picker-options="{ disabledDate: time => time.getTime() <= Date.now() }"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="实际开始时间" prop="realStart">
                <el-date-picker
                  v-model="temp.realStart"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="实际开始时间"
                  :picker-options="{ disabledDate: time => time.getTime() <= Date.now() }"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="实际结束时间" prop="realEnd">
                <el-date-picker
                  v-model="temp.realEnd"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="实际结束时间"
                  :picker-options="{ disabledDate: time => time.getTime() <= Date.now() }"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="排序" prop="sort">
                <el-input
                  v-model="temp.sort"
                  type="number"
                  placeholder="排序"
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
import {
  getPageTtProjectProgress,
  getAllTtProjectProgress,
  addTtProjectProgress,
  updateTtProjectProgress,
  deleteTtProjectProgress,
} from "./api/ttprojectprogress.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "TtProjectProgress",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "进度名称", field: "progressName" },
        { label: "计划开始时间", field: "planStart" },
        { label: "计划结束时间", field: "planEnd" },
        { label: "实际开始时间", field: "realStart" },
        { label: "实际结束时间", field: "realEnd" },
        { label: "排序", field: "sort" },
        { label: "类型", field: "typeConvert" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        progressName: undefined,
        type: 0,
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
        progressName: null,
        planStart: null,
        planEnd: null,
        realStart: null,
        realEnd: null,
        sort: null,
        type: 0,
      },
      rules: {
        //校验功能
        progressName: [
          {
            required: true,
            message: "必填进度名称",
            trigger: ["blur", "change"],
          },
        ],
        planStart: [
          {
            required: true,
            message: "必填计划开始时间",
            trigger: ["blur", "change"],
          },
        ],
        planEnd: [
          {
            required: true,
            message: "必填计划结束时间",
            trigger: ["blur", "change"],
          },
        ],
        // realStart: [
        //   {
        //     required: true,
        //     message: "必填实际开始时间",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // realEnd: [
        //   {
        //     required: true,
        //     message: "必填实际结束时间",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        sort: [
          { required: true, message: "必填排序", trigger: ["blur", "change"] },
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
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除此信息?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtProjectProgress(rows[index].id);
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
      getPageTtProjectProgress(this.listQuery)
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

      let records = this.tableData;
      records.forEach((item) => {
        item.typeConvert = item.type == 1 ? "项目里程碑" : "项目进度";
      });
      this.allTableData = records;
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
          filename: "项目进度展示",
        });
        this.downloadLoading = false;

        });

        // getAllTtProjectProgress()
        //   .then((res) => {
        //     if (res.code == "success") {
        //       this.allTableData = res.data;
        //       import("@/vendor/Export2Excel").then((excel) => {
        //         const tHeader = [];
        //         const filterVal = [];
        //         for (let column of self.columns) {
        //           tHeader.push(column.label);
        //           filterVal.push(column.field);
        //         }
        //         const data = this.formatJson(filterVal);
        //         excel.export_json_to_excel({
        //           header: tHeader,
        //           data,
        //           filename: "列表",
        //         });
        //         this.downloadLoading = false;
        //       });
        //     } else {
        //       this.errorMsg("下载数据失败");
        //     }
        //   })

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
        progressName: null,
        planStart: null,
        planEnd: null,
        realStart: null,
        realEnd: null,
        sort: null,
        type: 0,
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
          this.temp.createBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtProjectProgress(param)
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
          this.temp.updateBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          updateTtProjectProgress(param).then((response) => {
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
.app-container {
  height: 100%;
}
.tablebox {
  height: calc(100% - 100px);
}
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
