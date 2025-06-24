<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.proName"
        placeholder="项目名称"
        type="text"
        show-word-limit
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
      row-key="proId"
      stripe
      fit
      height="calc(100vh - 260px)"
      default-expand-all
      highlight-current-row
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="proName" label="项目名称" align="left">
      </el-table-column>
      <el-table-column prop="proId" label="主键" align="left">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0"
            ><svg-icon icon-class="success" /> 正常</span
          >
          <span v-if="scope.row.status == 1"
            ><svg-icon icon-class="disable" /> 禁用</span
          >
        </template>
      </el-table-column>

      <el-table-column prop="proDesc" label="项目的描述" show-overflow-tooltip align="left">
      </el-table-column>

      <el-table-column prop="sort" label="排序" align="center">
      </el-table-column>

      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click.native.prevent="handleEdit(scope)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            >删除
          </el-button>
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
              <el-form-item label="项目主键" prop="proId">
                <el-input
                  v-model="temp.proId"
                  :disabled="dialogStatus === 'update'"
                  placeholder="项目主键(不指定系统自动生产UUID)"
                />
              </el-form-item>
              <el-form-item label="项目名称" prop="proName">
                <el-input v-model="temp.proName" placeholder="项目名称" />
              </el-form-item>
              <el-form-item label="项目的描述" prop="proDesc">
                <el-input v-model="temp.proDesc" placeholder="项目的描述" />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input
                  type="number"
                  v-model="temp.sort"
                  placeholder="排序(不填默认:99)"
                />
              </el-form-item>
              <el-form-item label="父级项目Id" prop="parentId">
                <el-select v-model="temp.parentId" placeholder="请选择">
                  <el-option
                    v-for="item in allTableData"
                    :key="item.proId"
                    :label="item.proName"
                    :value="item.proId"
                    :disabled="item.proId == temp.proId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="状态" prop="status">
                <el-switch
                  v-model="temp.check"
                  active-text="正常"
                  inactive-text="禁用"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <p style="color: orange">
        注意:这里允许自定义主键ID，主要是兼容一些项目的id不是UUID
      </p>
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
  getPageSysProject,
  getAllSysProject,
  addSysProject,
  updateSysProject,
  deleteSysProject,
  getPageTtteam,
  getPageTtPerson,
} from "./api/sysproject.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "SysProject",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "项目主键", field: "proId" },
        { label: "项目名称", field: "proName" },
        { label: "状态", field: "status" },
        { label: "项目的描述", field: "proDesc" },
        { label: "排序", field: "sort" },
        { label: "父级项目Id", field: "parentId" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        proId: undefined,
        proName: undefined,
        proDesc: undefined,
        sort: undefined,
        parentId: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        proId: null,
        proName: null,
        status: null,
        proDesc: null,
        sort: null,
        parentId: null,
      },
      rules: {
        //校验功能
        proId: [
          {
            required: false,
            pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]+$/,
            message: "项目主键只能包含数字、英文和汉字",
            trigger: ["blur", "change"],
          },
        ],
        proName: [
          {
            required: true,
            message: "必填项目名称",
            trigger: ["blur", "change"],
          },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: ["blur", "change"],
          },
        ],
        proDesc: [
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: ["blur", "change"],
          },
        ],
        sort: [
          { required: false, message: "必填排序", trigger: ["blur", "change"] },
        ],

        /* //如需正则表达式验证 示例如下
                    born: [{ required: true, message: '必填', trigger: ['blur', 'change'] },
                        //额外添加正则的示例如下:
                        { pattern:/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/ , message: '请输入有效的日期格式', trigger: ['blur', 'change'] }
                    ],
                    */
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
    //删除单行
    deleteRow(index, row) {
      this.$confirm("你确定要删除此项目?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          
          let teamres = await getPageTtteam();
          
          if (teamres.code == "success") {
              console.log(teamres.data);
              console.log('111111111111111111111111111111111111111');
              if (teamres.data.length > 0) {
                this.errorMsg("删除失败，请先删除班组信息");
                return;
              }
          }
        
          console.log('111111111111111111111111111111111111111');
          let personres = await getPageTtPerson({ projectId: row.proId });
          if (personres.code == "success") {
            console.log(personres.data.records);
              if (personres.data.records.length > 0) {
                this.errorMsg("删除失败，请先删除人员信息");
                return;
              }
          }

          

          let res = await deleteSysProject(row.proId);
          if (res.code == "success") {
            //加载项目数据
            this.$store.dispatch("project/loadProjectData");
            //加载分页数据
            this.loadPageData();
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {});
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageSysProject(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          getAllSysProject()
            .then((res) => {
              if (res.code == "success") {
                this.allTableData = res.data;
              }
            })
            .catch((err) => {});
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
      getPageSysProject(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records.forEach((item) => {
              item.status = item.status == 0 ? "正常" : "禁止";
            });
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
    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        proId: null,
        proName: null,
        proDesc: null,
        sort: null,
        parentId: null,
        status: null,
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
          param.status = this.temp.check ? 0 : 1;
          addSysProject(param)
            .then((response) => {
              if (response.code == "success") {
                this.dialogFormVisible = false;
                this.loadPageData();
                //加载项目数据
                this.$store.dispatch("project/loadProjectData");
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
          param.status = this.temp.check ? 0 : 1;
          updateSysProject(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageData();
              //加载项目数据
              this.$store.dispatch("project/loadProjectData");
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

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
}

.filter-container {
  padding-bottom: 10px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;

    /deep/ .el-input__inner {
      padding-left: 5px;
      padding-right: 42px;
    }
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
