<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="grid-content bg-purple">
          <el-input
            v-model="listQuery.apiUrl"
            placeholder="访问url"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple">
          <el-input
            v-model="listQuery.apiNote"
            placeholder="接口描述"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input
            v-model="listQuery.apiClassname"
            placeholder="完全限定类名(当做类型)"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple">
          <el-input
            v-model="listQuery.apiClassNote"
            placeholder="类的描述"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple">
          <el-select
            v-model="listQuery.status"
            placeholder="请选择是否shiro验证"
            style="width: 100%"
            @change="handleFilter"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple ">
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
      </el-col>
    </el-row>
    <div class="tablebox">
      <!--显示列表-->
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        stripe
        height="100%"
        fit
        highlight-current-row
      >
        <el-table-column
          fixed
          prop="apiClassNote"
          label="类的描述"
          align="left"
        >
        </el-table-column>

        <el-table-column fixed prop="apiNote" label="接口描述" align="left">
        </el-table-column>

        <el-table-column fixed prop="apiUrl" label="访问url" align="left">
        </el-table-column>

        <el-table-column
          fixed
          prop="apiClassname"
          label="完全限定类名(当做类型)"
          align="left"
        >
        </el-table-column>

        <el-table-column prop="status" label="是否shiro验证" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0"
              ><svg-icon icon-class="success" /> 验证</span
            >
            <span v-if="scope.row.status == 1"
              ><svg-icon icon-class="sahndian" /> 放行</span
            >
          </template>
        </el-table-column>

        <el-table-column  label="操作" align="center" width="160">
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
              <!--                        <el-form-item label="主键" prop="apiId">
                            <el-input v-model="temp.apiId" placeholder="主键" />
                        </el-form-item>-->
              <el-form-item label="访问url" prop="apiUrl">
                <el-input
                  v-model="temp.apiUrl"
                  readonly
                  placeholder="访问url"
                />
              </el-form-item>
              <el-form-item label="接口描述" prop="apiNote">
                <el-input
                  v-model="temp.apiNote"
                  readonly
                  placeholder="接口描述"
                />
              </el-form-item>
              <el-form-item label="完全限定类名(当做类型)" prop="apiClassname">
                <el-input
                  v-model="temp.apiClassname"
                  readonly
                  placeholder="完全限定类名(当做类型)"
                />
              </el-form-item>
              <el-form-item label="类的描述" prop="apiClassNote">
                <el-input
                  v-model="temp.apiClassNote"
                  readonly
                  placeholder="类的描述"
                />
              </el-form-item>

              <el-form-item label="是否shiro验证" prop="status">
                <el-switch
                  v-model="temp.check"
                  active-text="验证"
                  inactive-text="放行"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>

              <!--字段单选 示例如下 -->
              <!--<el-form-item label="性别" prop="sex">
                          <el-radio-group v-model="sex">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                            <el-radio :label="0">未知</el-radio>
                          </el-radio-group>
                        </el-form-item>-->

              <!--字段开关 示例如下 -->
              <!-- <el-form-item label="状态" prop="status">
                                 <el-switch
                                   v-model="temp.status"
                                   active-text="可用"
                                   inactive-text="禁止"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949">
                                 </el-switch>
                               </el-form-item>-->
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
  getPageSysApi,
  getAllSysApi,
  addSysApi,
  updateSysApi,
  deleteSysApi,
} from "./api/sysapi.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "SysApi",
  components: { Pagination },
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        { label: "主键", field: "apiId" },
        { label: "类的描述", field: "apiClassNote" },
        { label: "接口描述", field: "apiNote" },
        { label: "访问url", field: "apiUrl" },
        
        { label: "完全限定类名(当做类型)", field: "apiClassname" },
        
        { label: "是否shiro验证", field: "status" },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        apiId: undefined,
        apiUrl: undefined,
        apiNote: undefined,
        apiClassname: undefined,
        apiClassNote: undefined,
        status: undefined,
      },
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "验证",
        },
        {
          value: 1,
          label: "放行",
        },
      ],
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        apiId: null,
        apiUrl: null,
        apiNote: null,
        apiClassname: null,
        apiClassNote: null,
        status: null,
      },
      rules: {
        //校验功能
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
    deleteRow(index, rows) {
      this.$confirm(
        "删除此接口数据,可能导致请求无法访问，你确定吗?",
        "系统警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let res = await deleteSysApi(rows[index].id);
          if (res.code == "success") {
            rows.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {
          this.errorMsg();
        });
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageSysApi(this.listQuery)
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
      getAllSysApi()
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data;
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
                filename: "shiro拦截接口列表",
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
        apiId: null,
        apiUrl: null,
        apiNote: null,
        apiClassname: null,
        apiClassNote: null,
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
          addSysApi(param)
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
          let param = JSON.parse(JSON.stringify(this.temp));
          param.status = param.check ? 0 : 1;
          updateSysApi(param).then((response) => {
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
.app-container{
  height: 100%;
  overflow-x: auto;
}
.tablebox{
  height: calc(100% - 170px);
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
.grid-content {
  border-radius: 4px;
  min-height: 56px;
}
.elbutton{
  display: inline-block;
  padding-left: 0!important;

}
</style>
