<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNum"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        clearable
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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button> -->
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
      height="calc(100vh - 260px)"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="machineNum" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="machineFactory" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="enterTime" label="进场时间" align="center">
      </el-table-column>
      <!-- <el-table-column prop="matchStatus" label="匹配状态" align="center">
      </el-table-column>

      <el-table-column prop="matchTime" label="匹配时间" align="center">
      </el-table-column> -->
      <el-table-column prop="machineState" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.machineState == 0"
            type="success"
            effect="dark"
          >在线
          </el-tag
          >
          <el-tag v-if="scope.row.machineState == 1" type="info" effect="dark"
          >离线
          </el-tag
          >
          <el-tag v-if="scope.row.machineState == 2" type="danger" effect="dark"
          >报警
          </el-tag
          >
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="300" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
          >编辑
          </el-button
          >
          <el-button size="mini" type="primary" @click="searchForm(scope.row)"
          >查看
          </el-button
          >
          <!-- <el-button size="mini" type="info">设置</el-button> -->
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >删除
          </el-button
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
        :disabled="dialogStatus == 'look'"
      >
        <div class="grid-content bg-purple">
          <el-form-item label="设备名称" prop="machineName">
            <el-input v-model="temp.machineName" placeholder="设备名称"/>
          </el-form-item>
          <el-form-item label="设备厂家" prop="machineFactory">
            <el-input v-model="temp.machineFactory" placeholder="设备厂家"/>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId">
            <el-cascader
              style="width: 100%"
              ref="cascaderArr"
              v-model="temp.projectId"
              :options="projectIdList"
              @change="handleChange"
              :show-all-levels="false"
              :props="{ checkStrictly: true }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="产权备案号" prop="remark">
            <el-input v-model="temp.remark" placeholder="产权备案号"/>
          </el-form-item>
          <el-form-item label="进场时间" prop="enterTime">
            <el-date-picker
              v-model="temp.enterTime"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="产权单位" prop="propertyCompany">
            <el-input v-model="temp.propertyCompany" placeholder="产权单位"/>
          </el-form-item>
          <el-form-item label="安装单位" prop="installCompany">
            <el-input v-model="temp.installCompany" placeholder="安装单位"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus != 'look'">
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
import {getPageTtLb, addTtLb, updateTtLb, deleteTtLb} from "./api/lbfh.js";
import {deepClone, parseTime} from "@/utils";
import {getPageSysProject} from "@/views/sysproject/api/sysproject.js";
import Pagination from "@/components/Pagination";

export default {
  name: "rlmachine",
  components: {Pagination, uploadFile},
  data() {
    return {
      options: ["单笼", "双笼"],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: "设备名称", field: "machineName"},
        {label: "设备编号", field: "machineNum"},
        {label: "设备厂家", field: "machineFactory"},
        {label: "项目名称", field: "projectName"},
        {label: "进场时间", field: "enterTime"},
        {label: "设备状态", field: "machineState"},
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        machineNum: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
        look: "查看",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        machineNum: null,
        projectName: "",
        projectId: "",
      },
      rules: {
        machineFactory: [
          {
            required: true,
            message: "必填设备厂家",
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
        enterTime: [
          {
            required: true,
            message: "必填进场时间",
            trigger: ["blur", "change"],
          },
        ],
      },
      projectIdList: [],
    };
  },
  created() {
    getPageSysProject({pageIndex: 1, pageSize: -1}).then((res) => {
      this.projectIdList = this.handleProject(res.data.records);
    });
    //加载分页数据
    this.loadPageData();
  },
  mounted() {
  },
  methods: {
    handleChange(list) {
      const checkNode = this.$refs.cascaderArr.getCheckedNodes();
      this.temp.projectName = checkNode[0].data.label;
      this.temp.projectId = checkNode[0].data.value;
    },
    handleProject(list) {
      if (list) {
        list.forEach((item) => {
          item["value"] = item.proId;
          item["label"] = item.proName;
          if (item.children && item.children.length !== 0) {
            this.handleProject(item.children);
          } else {
            delete item.children;
          }
        });
        return list;
      }
    },
    searchForm(scope) {
      this.resetTemp();
      this.dialogStatus = "look";
      this.temp = deepClone(scope);
      this.dialogFormVisible = true;
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
          let res = await deleteTtLb(rows[index].id);
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
      getPageTtLb(this.listQuery)
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
      getPageTtLb({...this.listQuery})
        .then((res) => {
          if (res.code == "success") {
            this.allTableData = res.data.records;
            for (let i = 0; i < this.allTableData.length; i++) {
              this.allTableData[i].machineState =
                this.allTableData[i].machineState == 0
                  ? "在线"
                  : this.allTableData[i].machineState == 1
                    ? "离线"
                    : this.allTableData[i].machineState == 2
                      ? "报警"
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
      this.temp = {
        id: null,
        machineNum: null,
        createBy: this.$store.getters.name,
        projectName: "",
        projectId: "",
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
          addTtLb(param)
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
        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.updateBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          updateTtLb(param).then((response) => {
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
